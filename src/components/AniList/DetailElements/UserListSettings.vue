<template>
  <v-card :loading="isLoading">
    <v-card-title primary-title>
      {{ $t('pages.aniList.detailView.ownInformation') }}
    </v-card-title>
    <v-card-text v-if="!item.listEntry">
      {{ $t('alerts.notYetInList') }}
    </v-card-text>

    <v-container grid-list-md fluid>
      <v-layout column>
        <v-flex>
          <v-select
            v-model="status"
            dense
            :items="listStatusses"
            :label="$t('pages.aniList.detailView.ownStatus')"
            :rules="[rules.required]"
            @change="checkStatus"
          />
        </v-flex>

        <v-flex>
          <v-text-field
            v-model="progress"
            :mask="getMask(item.episodes)"
            :suffix="`/ ${item.episodes}`"
            :label="$t('pages.aniList.detailView.ownProgress')"
            :rules="[rules.required]"
          />
        </v-flex>

        <v-flex>
          <v-text-field
            v-if="scoreSystem === POINT_100"
            v-model="score"
            suffix="/ 100"
            :label="$t('pages.aniList.detailView.ownScore')"
            :rules="[rules.required]"
          />

          <div v-if="scoreSystem !== POINT_100" class="text-center ma-auto">
            <div class="body-1 text-xs-left pl-1">{{ $t('pages.aniList.detailView.ownScore') }} ({{ score }})</div>
            <v-rating v-if="scoreSystem === POINT_10_DECIMAL" v-model="score" length="10" hover half-increments />

            <v-rating v-if="scoreSystem === POINT_10" v-model="score" length="10" hover dense />

            <v-rating v-if="scoreSystem === POINT_5" v-model="score" length="5" hover dense />

            <v-rating v-if="scoreSystem === POINT_3" v-model="score" length="3" hover dense />
          </div>
        </v-flex>
      </v-layout>
    </v-container>

    <v-card-actions v-if="item.listEntry">
      <v-layout>
        <v-flex>
          <v-btn text block color="success" @click="saveChanges">
            <v-icon left> mdi-content-save </v-icon>
            {{ $t('actions.save') }}
          </v-btn>
        </v-flex>
        <v-flex>
          <v-btn text block color="error" @click="removeFromList">
            <v-icon left> mdi-delete </v-icon>
            {{ $t('actions.remove') }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>

    <v-card-actions v-else>
      <v-btn text color="success" block @click="addToList">
        <v-icon left> mdi-library-plus </v-icon>
        {{ $t('actions.add') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { isNumber } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { AniListScoreFormat, AniListListStatus, IAniListSession } from '@/types';
import aniListEventHandler from '@/plugins/AniList/eventHandler';

@Component({
  computed: {
    ...mapGetters('app', ['isLoading']),
    ...mapGetters('userSettings', ['session']),
  },
})
export default class UserListSettings extends Vue {
  readonly isLoading!: boolean;
  readonly session!: IAniListSession;

  @Prop()
  item!: any;
  // @TODO: Give item a proper type

  status: AniListListStatus = AniListListStatus.PLANNING;

  progress: number = 0;

  score: number = 0;

  readonly POINT_100 = AniListScoreFormat.POINT_100;

  readonly POINT_10_DECIMAL = AniListScoreFormat.POINT_10_DECIMAL;

  readonly POINT_10 = AniListScoreFormat.POINT_10;

  readonly POINT_5 = AniListScoreFormat.POINT_5;

  readonly POINT_3 = AniListScoreFormat.POINT_3;

  readonly listStatusses = [
    {
      text: this.$root.$t('misc.aniList.listStatusses.watching'),
      value: AniListListStatus.CURRENT,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.completed'),
      value: AniListListStatus.COMPLETED,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.dropped'),
      value: AniListListStatus.DROPPED,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.paused'),
      value: AniListListStatus.PAUSED,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.planning'),
      value: AniListListStatus.PLANNING,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.repeating'),
      value: AniListListStatus.REPEATING,
    },
  ];

  readonly rules = {
    required: (value: any) => !!value || this.$root.$t('misc.rules.required'),
  };

  created() {
    if (this.item && this.item.listEntry) {
      this.score = this.item.listEntry.score;
      this.status = this.item.listEntry.status;
      this.progress = this.item.listEntry.progress;
    }
  }

  get scoreSystem(): AniListScoreFormat | null {
    if (!this.item) {
      return null;
    }

    const { scoreFormat } = this.session.user.mediaListOptions;

    return scoreFormat === AniListScoreFormat.POINT_3
      ? AniListScoreFormat.POINT_3
      : scoreFormat === AniListScoreFormat.POINT_5
      ? AniListScoreFormat.POINT_5
      : scoreFormat === AniListScoreFormat.POINT_10
      ? AniListScoreFormat.POINT_10
      : scoreFormat === AniListScoreFormat.POINT_10_DECIMAL
      ? AniListScoreFormat.POINT_10_DECIMAL
      : AniListScoreFormat.POINT_100;
  }

  getMask(input: number | string): string | undefined {
    if (!isNumber(input)) {
      return '#####';
    }
    return '#'.repeat(input);
  }

  checkStatus(status: AniListListStatus) {
    if (status === AniListListStatus.COMPLETED && typeof this.item.episodes === 'number') {
      this.progress = this.item.episodes;
    }
  }

  async saveChanges(): Promise<void> {
    this.$store.commit('app/setLoadingState', true);
    if (this.item && this.item.listEntry) {
      const { entryId } = this.item;
      const status = !this.status ? AniListListStatus.PLANNING : this.status;
      const score = !this.score ? 0 : this.score;
      const progress = !this.progress ? 0 : this.progress;

      try {
        let completedAt = undefined;
        let startedAt = undefined;
        let notification = 'simpleUpdateText';
        const now = new Date();

        if (status === AniListListStatus.CURRENT) {
          startedAt = {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate(),
          };
        } else if (status === AniListListStatus.COMPLETED) {
          completedAt = {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate(),
          };
          notification = 'completeUpdateText';
        }

        await this.$http.updateEntry({
          entryId,
          progress,
          score,
          status,
          startedAt,
          completedAt,
        });

        await aniListEventHandler.refreshLists();
        this.$emit('updated');

        this.$notify({
          title: this.$t('notifications.aniList.successTitle') as string,
          text: this.$t(`notifications.aniList.${notification}`, [
            this.item.userPreferredTitle,
            this.progress,
          ]) as string,
        });
      } catch (error) {
        this.$notify({
          title: this.$t('errors.updateFailed.title') as string,
          text: this.$t('errors.updateFailed.text') as string,
          type: 'error',
        });
      }
    }
    this.$store.commit('app/setLoadingState', false);
  }

  async removeFromList(): Promise<void> {
    if (!this.item || !this.item.listEntry) {
      return;
    }

    this.$store.commit('app/setLoadingState', true);

    try {
      const { entryId } = this.item;

      await this.$http.removeEntry(entryId);
      this.$notify({
        title: this.$t('notifications.aniList.successTitle') as string,
        text: this.$t('notifications.aniList.removeEntry', [this.item.userPreferredTitle]) as string,
      });
      this.$emit('updated');
    } catch (error) {
      this.$notify({
        title: this.$t('errors.updateFailed.title') as string,
        text: this.$t('errors.updateFailed.text') as string,
        type: 'error',
      });
    }

    this.$store.commit('app/setLoadingState', false);
  }

  async addToList(): Promise<void> {
    if (!this.item || this.item.listEntry) {
      this.$notify({
        title: 'FATAL ERROR (100)',
        text: 'addToList called with no media item or with existing list entry!',
        type: 'error',
      });

      return;
    }

    this.$store.commit('app/setLoadingState', true);
    try {
      const { mediaId } = this.item;
      const status = !this.status ? AniListListStatus.PLANNING : this.status;
      const score = !this.score ? 0 : this.score;
      const progress = !this.progress ? 0 : this.progress;

      await this.$http.addEntry({ mediaId, status, score, progress });
      this.$notify({
        title: this.$t('notifications.aniList.successTitle') as string,
        text: this.$t('notifications.aniList.addedToList', [this.item.userPreferredTitle]) as string,
      });
      aniListEventHandler.refreshLists();
      this.$emit('updated');
    } catch (error) {
      this.$notify({
        title: this.$t('errors.updateFailed.title') as string,
        text: this.$t('errors.updateFailed.text') as string,
        type: 'error',
      });
    }
    this.$store.commit('app/setLoadingState', false);
  }
}
</script>
