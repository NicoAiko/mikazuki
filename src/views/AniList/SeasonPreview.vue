<template>
  <v-main>
    <v-container
      fluid
      class="py-0 px-1"
      :class="{ 'fill-height': isListEmpty || isLoading }"
      style="position: relative"
    >
      <v-dialog v-if="!isLoading" max-width="550">
        <template #activator="{ on }">
          <v-btn
            fixed
            dark
            large
            rounded
            v-on="on"
            :style="{
              ...buttonStyles,
              top: '16px',
              'z-index': 4,
            }"
          >
            <v-icon left>mdi-calendar</v-icon>
            {{ $t(`misc.aniList.seasons.${nextSeason.toLowerCase()}`) }} {{ currentYear }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>{{ $t('pages.seasonPreview.updateDialog.title') }}</v-card-title>
          <v-card-text>
            <v-select
              v-model="currentYear"
              :items="years"
              :label="$t('pages.seasonPreview.updateDialog.yearOfSeason')"
              menu-props="auto, offset-y"
            />
            <v-select
              v-model="nextSeason"
              :items="seasons"
              :label="$t('pages.seasonPreview.updateDialog.season')"
              menu-props="auto, offset-y"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="secondary" @click="onUpdatePreview">{{ $t('actions.save') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
          <v-col v-for="item in list" class="lg5-custom" cols="12" sm="6" md="4" lg="3" xl="2" :key="item.id">
            <v-card flat outlined class="ma-2" :id="item.id">
              <list-image
                :nameColumnSize="true"
                cardHeight="450px"
                :item="item"
                :show-studios="false"
                :show-score="false"
              >
                <template #before>
                  <v-col cols="auto" class="pb-2">
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-icon
                          v-if="!item.isAdded"
                          v-on="on"
                          color="success"
                          @click.stop.prevent="onAddEntry(item.id)"
                        >
                          mdi-plus
                        </v-icon>
                        <v-icon v-else v-on="on" color="info" @click.stop.prevent="">mdi-check</v-icon>
                      </template>
                      <span v-if="!item.isAdded">{{ $t('actions.addToPlanToWatch') }}</span>
                      <span v-else>{{ $t('actions.added') }}</span>
                    </v-tooltip>
                  </v-col>

                  <v-col v-if="item.isAdult" cols="auto" class="pb-2">
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-icon color="error" v-on="on">mdi-alert</v-icon>
                      </template>
                      <span>{{ $t('alerts.adultContent') }}</span>
                    </v-tooltip>
                  </v-col>

                  <v-col cols="12" class="pb-0">
                    <span class="text-body-2 teal--text text--lighten-3">
                      {{ $tc('pages.seasonPreview.episodes', [item.episodes]) }}
                    </span>
                  </v-col>
                  <v-col v-if="item.studios" cols="12" class="py-0">
                    <span class="text-body-2 teal--text text--lighten-3">
                      {{ item.studios }}
                    </span>
                  </v-col>
                  <v-col
                    cols="12"
                    :class="{
                      'py-0': (item.studios || item.episodes) && item.genres.length,
                      'pt-0 pb-2': (item.studios || item.episodes) && !item.genres.length,
                    }"
                  >
                    <span class="text-body-2 teal--text text--lighten-3">
                      {{ $t('pages.seasonPreview.startDate') }}
                      {{ item.startDate }}
                    </span>
                  </v-col>
                  <v-col v-if="item.genres.length" cols="12" class="pt-0 pb-2">
                    <span class="text-body-2 teal--text text--lighten-3">
                      {{ $t('pages.aniList.detailView.genres') }}:
                      {{ item.genres.join(', ') }}
                    </span>
                  </v-col>
                </template>
              </list-image>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import ListImage from '@/components/Anime/Elements/ListImage.vue';
import { AniListListStatus, AniListSeason, IAniListMediaListCollection, IAniListMediaStudio } from '@/types';
import { Getter } from '@/decorators';

@Component({
  components: { ListImage },
})
export default class SeasonPreview extends Vue {
  isLoading: boolean = false;
  entries: any[] = [];
  currentYear: number = 0;
  nextSeason: AniListSeason = AniListSeason.WINTER;
  currentListEntryIds: any[] = [];
  @Getter('aniList') aniListData!: IAniListMediaListCollection;

  get buttonStyles() {
    const isRTL = this.$vuetify.rtl;

    const isMobileAndRTL = this.isMobile && isRTL;
    const isMobileOnly = this.isMobile && !isRTL;
    const isRTLOnly = !this.isMobile && isRTL;
    const isNeither = !this.isMobile && !isRTL;

    let left;
    let right;

    if (isMobileAndRTL || isRTLOnly) {
      left = '16px';
      right = undefined;
    } else if (isMobileOnly) {
      left = undefined;
      right = '16px';
    } else if (isNeither) {
      left = '72px';
      right = undefined;
    }

    return {
      left,
      right,
    };
  }

  get years() {
    let year = new Date().getUTCFullYear() + 5;
    const arr = new Array(year - 1930).fill(0).map(() => --year);

    return arr;
  }

  get seasons() {
    return [
      {
        text: this.$t('misc.aniList.seasons.winter'),
        value: AniListSeason.WINTER,
      },
      {
        text: this.$t('misc.aniList.seasons.spring'),
        value: AniListSeason.SPRING,
      },
      {
        text: this.$t('misc.aniList.seasons.summer'),
        value: AniListSeason.SUMMER,
      },
      {
        text: this.$t('misc.aniList.seasons.fall'),
        value: AniListSeason.FALL,
      },
    ];
  }

  get isListEmpty(): boolean {
    return this.entries.length === 0;
  }

  get list() {
    return this.entries.map((entry) => {
      const { date, inputFormat, outputFormat } = this.getDateFormat(entry);
      const startDate = moment(date, inputFormat).format(outputFormat) || this.$t('misc.dates.dateUnknown');
      const studios = this.getStudios(entry.studios);
      const isAdded = this.currentListEntryIds.includes(entry.id);

      return {
        aniListId: entry.id,
        title: entry.title.userPreferred,
        episodes: entry.episodes || '?',
        genres: entry.genres,
        imageLink: entry.coverImage.extraLarge,
        startDate,
        studios,
        id: entry.id,
        isAdult: entry.isAdult,
        isLocked: entry.isLocked,
        isAdded,
      };
    });
  }

  get isMobile(): boolean {
    return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  async created() {
    this.currentYear = new Date().getUTCFullYear();
    this.nextSeason = this.getCurrentSeason();
    this.currentListEntryIds = this.aniListData.lists
      .map((list) => {
        const ids = list.entries.map((entry) => entry.media.id);

        return ids;
      })
      .flat();

    await this.loadData();
  }

  async loadData() {
    try {
      this.isLoading = true;
      const response = await this.$http.getSeasonPreview(this.currentYear, this.nextSeason);
      this.entries = response ? response.media : [];
    } catch (error) {
      this.$notify({
        title: 'Error loading season preview!',
        text: 'An error occurred while loading data for season preview!',
        type: 'error',
      });

      this.entries = [];
    } finally {
      this.isLoading = false;
    }
  }

  getCurrentSeason(): AniListSeason {
    const currentMonth = new Date().getUTCMonth() + 1;

    switch (currentMonth) {
      case 1:
      case 2:
      case 3:
        return AniListSeason.WINTER;
      case 4:
      case 5:
      case 6:
        return AniListSeason.SPRING;
      case 7:
      case 8:
      case 9:
        return AniListSeason.SUMMER;
      case 10:
      case 11:
      case 12:
      default:
        return AniListSeason.FALL;
    }
  }

  getNextSeason(): AniListSeason {
    const currentMonth = new Date().getUTCMonth() + 1;

    switch (currentMonth) {
      case 1:
      case 2:
      case 3:
        // Currently in winter, so next is spring
        return AniListSeason.SPRING;
      case 4:
      case 5:
      case 6:
        return AniListSeason.SUMMER;
      case 7:
      case 8:
      case 9:
        return AniListSeason.FALL;
      case 10:
      case 11:
      case 12:
      default:
        return AniListSeason.WINTER;
    }
  }

  getDateFormat(item: any) {
    const outputFormat = item.startDate.day
      ? (this.$t('misc.dates.full') as string)
      : item.startDate.month
      ? (this.$t('misc.dates.monthAndYear') as string)
      : item.startDate.year
      ? (this.$t('misc.dates.yearOnly') as string)
      : undefined;

    let dateFormat = '';
    let itemDate = '';

    if (item.startDate.year) {
      dateFormat = 'YYYY';
      itemDate = `${item.startDate.year}`;
    }

    if (item.startDate.month) {
      dateFormat = 'M-YYYY';
      itemDate = `${item.startDate.month}-${item.startDate.year}`;
    }

    if (item.startDate.day) {
      dateFormat = `D-${dateFormat}`;
      itemDate = `${item.startDate.day}-${itemDate}`;
    }

    return {
      date: itemDate,
      inputFormat: dateFormat,
      outputFormat,
    };
  }

  getStudios(studios: IAniListMediaStudio): string {
    return studios.nodes
      .filter((node) => node.isAnimationStudio)
      .map((node) => node.name)
      .join(', ');
  }

  async onUpdatePreview() {
    await this.loadData();
  }

  async onAddEntry(id: number) {
    try {
      const entry = await this.$http.addEntry({
        mediaId: id,
        status: AniListListStatus.PLANNING,
      });

      this.currentListEntryIds.push(id);

      this.$notify({
        title: this.$t('notifications.aniList.successTitle').toString(),
        text: this.$t('notifications.aniList.addedToList', [entry.media.title.userPreferred]).toString(),
      });
    } catch (error) {
      this.$notify({
        type: 'error',
        title: this.$t('errors.updateFailed.title').toString(),
        text: this.$t('errors.updateFailed.text').toString(),
      });
    }
  }
}
</script>
