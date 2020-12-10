<script lang="ts">
import { chain, entries, reduce } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ListImage from './Elements/ListImage.vue';
import ProgressBar from './Elements/ProgressBar.vue';
import { Getter } from '@/decorators';
import aniListEventHandler from '@/plugins/AniList/eventHandler';
import { AniListListStatus, IAniListList, IAniListMediaListCollection } from '@/types';

@Component({
  components: {
    ListImage,
    ProgressBar,
  },
})
export default class AnimeList extends Vue {
  @Prop(String) readonly status!: AniListListStatus;
  @Prop(String) readonly sortBy!: string;
  @Prop(Boolean) readonly sortDesc!: boolean;
  isLoading: boolean = false;
  // TODO: Use other name and typing to use animelist for other list providers as well
  @Getter('aniList') readonly aniListData!: IAniListMediaListCollection;
  @Getter('app') readonly listItemStartAmount!: number;
  @Getter('userSettings') readonly allowAdultContent!: boolean;
  updateTimer: NodeJS.Timeout | null = null;
  updatePayload: any[] = [];
  updatePayloadHasCompletedItems: boolean = false;
  readonly updateInterval = 750;
  listItemIndex: number = 0;

  get isListEmpty(): boolean {
    return this.listData.length === 0;
  }

  get listData(): any[] {
    const listElement = this.aniListData.lists.find((list) => list.status === this.status);

    if (!listElement) {
      return [];
    }

    let list = chain(listElement.entries).map((entry) => {
      const { media } = entry;

      return {
        __rendered: false,
        __entry: entry,
        __media: media,
        aniListId: media.id,
        currentProgress: entry.progress,
        episodeAmount: media.episodes || '?',
        id: entry.id,
        // TODO: Use Object with multiple sizes
        imageLink: media.coverImage.extraLarge,
        isAdult: media.isAdult,
        mediaStatus: media.status,
        nextAiringEpisode: media.nextAiringEpisode,
        score: entry.score,
        status: entry.status,
        studios: media.studios,
        title: media.title.userPreferred,
      };
    });

    if (!this.allowAdultContent) {
      list = list.filter((entry) => !entry.isAdult);
    }

    return list.orderBy(this.sortBy, this.sortDesc ? 'desc' : 'asc').value();
  }

  get slicedListData(): any[] {
    return this.listData.slice(0, this.listItemStartAmount * (this.listItemIndex + 1));
  }

  created() {
    window.onscroll = this.onScroll;
  }

  async onScroll() {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

    if (bottomOfWindow) {
      if ((this.listItemIndex + 1) * this.listItemStartAmount < this.listData.length) {
        this.listItemIndex++;
      }
    }
  }

  startUpdateTimer(entry: any) {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    const now = Date.now();
    const uploadEntry = {
      entryId: entry.id,
      mediaId: entry.aniListId,
      title: entry.title,
      progress: entry.currentProgress,
      status: entry.status,
      score: entry.score,
      changeFrom: now,
    };

    this.updatePayload.push(uploadEntry);
    this.updateTimer = setTimeout(this.updateChanges, this.updateInterval);
  }

  async updateChanges() {
    if (!this.updatePayload.length) {
      return;
    }

    const entries = chain(this.updatePayload)
      .groupBy('entryId')
      .map((group) =>
        reduce(group, (acc: any, item: any) => (item.changeFrom > acc.changeFrom ? item : acc), { changeFrom: 0 })
      )
      .filter((group) => !!group.entryId)
      .map(async (entry) => {
        const { entryId, status, progress, score } = entry;

        if (!entryId || progress === null) {
          return;
        }

        let completedAt = undefined;
        if (status === AniListListStatus.COMPLETED) {
          const now = new Date();
          completedAt = {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate(),
          };
          this.updatePayloadHasCompletedItems = true;
        }

        return this.$http.updateEntry({
          entryId,
          progress,
          status,
          score,
          completedAt,
        });
      })
      .value();

    if (!entries.length) {
      return;
    }

    Promise.all(entries)
      .then((results) => {
        if (!results?.length) {
          return;
        }

        results.forEach((result) => {
          if (!result) return;

          const entry = this.listData.find((item) => item.id === result?.id);

          if (!entry) return;

          entry.__entry = Object.assign(entry.__entry, {
            ...result,
          });
          entry.currentProgress = result.progress;
          entry.score = result.score;
          entry.status = result.status;

          const updateText = result.status === AniListListStatus.COMPLETED ? 'completeUpdateText' : 'simpleUpdateText';
          this.$notify({
            title: this.$t('notifications.aniList.successTitle').toString(),
            text: this.$t(`notifications.aniList.${updateText}`, [entry.title, result.progress]).toString(),
          });
        });
      })
      .then(() => {
        if (this.updatePayloadHasCompletedItems) {
          this.isLoading = true;
          return aniListEventHandler.refreshLists();
        }
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.error(error))
      .finally(() => {
        this.isLoading = false;
        this.updatePayload = [];
        this.updatePayloadHasCompletedItems = false;
      });
  }

  onIncreaseEpisode(entryId: number) {
    const listEntry = this.listData.find((entry) => entry.id === entryId);

    if (!listEntry) {
      return;
    }

    const { currentProgress, episodeAmount } = listEntry;
    listEntry.__entry.progress++;
    listEntry.currentProgress++;

    if (episodeAmount !== '?' && listEntry.currentProgress >= episodeAmount) {
      listEntry.status = AniListListStatus.COMPLETED;
      listEntry.currentProgress = episodeAmount;
      listEntry.__entry.progress = episodeAmount;
    }

    this.startUpdateTimer(listEntry);
  }

  onRepeatAnime(entryId: number) {
    const listEntry = this.listData.find((entry) => entry.id === entryId);
    if (!listEntry) {
      return;
    }

    listEntry.status = AniListListStatus.REPEATING;
    listEntry.currentProgress = 0;

    this.startUpdateTimer(listEntry);
  }

  onRevertAnime(entryId: number) {
    const listEntry = this.listData.find((entry) => entry.id === entryId);
    if (!listEntry) {
      return;
    }

    listEntry.status = AniListListStatus.CURRENT;

    this.startUpdateTimer(listEntry);
  }

  onUpdateScore(entryId: number, score: number) {
    const listEntry = this.listData.find((entry) => entry.id === entryId);
    if (!listEntry) {
      return;
    }

    listEntry.score = score;

    this.startUpdateTimer(listEntry);
  }
}
</script>

<template>
  <v-container fluid class="py-0 px-1" :class="{ 'fill-height': isListEmpty || isLoading }">
    <v-row no-gutters>
      <v-col v-show="isLoading" cols="12" align-self="center">
        <div class="text-center display-3">
          {{ $t('actions.loading') }}
          <v-progress-circular indeterminate style="vertical-align: super" />
        </div>
      </v-col>

      <v-col v-if="!isLoading && isListEmpty" cols="12">
        <div class="display-3 text-center">
          {{ $t('$vuetify.noDataText') }}
        </div>
      </v-col>

      <template v-if="!isLoading && !isListEmpty">
        <v-col v-for="item in slicedListData" class="lg5-custom" cols="12" sm="6" md="4" lg="3" xl="2" :key="item.id">
          <v-lazy v-model="item.__rendered" :options="{ threshold: 0.5 }">
            <v-card flat outlined class="ma-2" :id="item.id">
              <list-image :status="status" :item="item" :show-studios="false" @update:score="onUpdateScore" />

              <progress-bar
                :item="item"
                :status="status"
                @increase="onIncreaseEpisode"
                @repeat="onRepeatAnime"
                @revert="onRevertAnime"
              />
            </v-card>
          </v-lazy>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
