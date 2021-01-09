<template>
  <v-img
    :src="imageLink"
    :height="cardHeight"
    position="50% 35%"
    class="pointerCursor"
    @click.native="moveToDetails(aniListId)"
  >
    <template v-slot:placeholder>
      <v-container class="pa-0 justify-center fill-height align-center">
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-container>
    </template>

    <v-icon v-if="mediaStatusIcon" class="glow media-status-icon" :color="mediaStatusChipColor">
      {{ mediaStatusIcon }}
    </v-icon>

    <slot name="action" />

    <v-container v-if="name" class="fluid fill-height d-flex align-end py-0 anime-image-container">
      <v-row :class="`${darkMode ? 'shadowed' : 'lightened'} ${isMobile ? 'titled-mobile' : 'titled'}`">
        <v-col :cols="nameColSize" class="pb-1 media-title-col">
          <list-element-title :name="name" :missing-episodes="missingEpisodes" :next-episode="nextEpisode" />
        </v-col>

        <slot name="before" />

        <v-col cols="auto" class="pb-2" v-if="showScore">
          <score-chip :score="item.score" :title="item.title" @on-save-click="onScoreChipSaveClick" />
        </v-col>

        <v-col v-if="missingEpisodes" cols="12" :class="{ 'pb-2': !nextEpisode, 'pb-0': nextEpisode }">
          <missing-episodes :missing-episodes="missingEpisodes" />
        </v-col>

        <v-col v-if="nextEpisode" cols="12" class="pb-2" :class="{ 'pt-0': missingEpisodes }">
          <next-episode :next-episode="nextEpisode" />
        </v-col>

        <v-spacer v-if="concatenatedStudios.length" />

        <v-col v-if="concatenatedStudios.length" cols="12" align-self="end">
          <studios :studios="concatenatedStudios" />
        </v-col>

        <slot name="after" />
      </v-row>
    </v-container>
  </v-img>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { mapGetters } from 'vuex';
import ListElementTitle from './ListImageElements/Title.vue';
import MissingEpisodes from './ListImageElements/MissingEpisodes.vue';
import NextEpisode from './ListImageElements/NextEpisode.vue';
import ScoreChip from './ListImageElements/ScoreChip.vue';
import Studios from './ListImageElements/Studios.vue';
import {
  AniListListStatus,
  AniListMediaStatus,
  AniListScoreFormat,
  IAniListMediaStudio,
  IAniListMediaStudioNode,
  // ZeroTwoListDataItem,
  IAniListNextAiringEpisode,
  IAniListSession,
} from '@/types';

@Component({
  computed: {
    ...mapGetters('userSettings', ['session']),
  },
  components: { ListElementTitle, MissingEpisodes, NextEpisode, ScoreChip, Studios },
})
export default class ListImage extends Vue {
  @Prop({ type: String, default: '250px' }) cardHeight!: string;
  @Prop(String) status!: AniListListStatus;
  @Prop(Object) item!: any;
  @Prop(Boolean) showStudios!: boolean;
  @Prop({ type: Boolean, default: true }) showScore!: boolean;
  @Prop([Number, String, Boolean]) nameColumnSize!: number | string | boolean;
  readonly session!: IAniListSession;

  get nameColSize(): boolean | number | string {
    return this.nameColumnSize ? this.nameColumnSize : this.showScore ? true : 12;
  }

  get nextEpisode(): string | null {
    return this.nextAiringEpisode
      ? this.$root
          .$t('pages.aniList.list.nextAiringEpisode', [
            this.nextAiringEpisode.episode,
            moment(this.nextAiringEpisode.airingAt, 'X').fromNow(),
          ])
          .toString()
      : null;
  }
  get nextAiringEpisode(): IAniListNextAiringEpisode {
    return this.item.nextAiringEpisode;
  }
  get currentProgress(): number {
    return this.item.currentProgress;
  }
  get missingEpisodes(): number {
    const { currentProgress, nextAiringEpisode } = this;
    if (!nextAiringEpisode) {
      return 0;
    }
    const nextEpisode = nextAiringEpisode.episode;
    // Return the amount of episodes only when there are next episodes
    // and if there are episodes the user hasn't watched yet.
    return nextEpisode - 1 > 0 && nextEpisode - 1 - currentProgress > 0 ? nextEpisode - 1 - currentProgress : 0;
  }
  get aniListId(): number {
    return this.item.aniListId;
  }
  get name(): string {
    return this.item.title;
  }
  get imageLink(): string {
    return this.item.imageLink;
  }
  get studios(): IAniListMediaStudio {
    return this.item.studios;
  }
  get mediaStatusIcon(): string {
    return this.item.mediaStatus === AniListMediaStatus.CANCELLED
      ? 'mdi-cancel'
      : this.item.mediaStatus === AniListMediaStatus.NOT_YET_RELEASED
      ? 'mdi-calendar'
      : this.item.mediaStatus === AniListMediaStatus.RELEASING
      ? 'mdi-antenna'
      : '';
  }
  get mediaStatusChipColor(): string {
    return this.item.mediaStatus === AniListMediaStatus.CANCELLED
      ? 'red darken-2'
      : this.item.mediaStatus === AniListMediaStatus.NOT_YET_RELEASED
      ? 'yellow darken-4'
      : this.item.mediaStatus === AniListMediaStatus.RELEASING
      ? 'success'
      : '';
  }
  get scoreColor(): string {
    const score = this.item.score;
    if (!score) {
      return 'error darken-2';
    }
    const userScoringSystem = this.session.user.mediaListOptions.scoreFormat;
    switch (userScoringSystem) {
      case AniListScoreFormat.POINT_100:
        return score / 100 < 1 / 3 ? 'error darken-2' : score / 100 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_10_DECIMAL:
      case AniListScoreFormat.POINT_10:
        return score / 10 < 1 / 3 ? 'error darken-2' : score / 10 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_5:
        return score / 5 < 1 / 3 ? 'error darken-2' : score / 5 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_3:
        return score <= 1 ? 'error darken-2' : score === 2 ? 'warning darken-2' : 'success darken-2';
      default:
        return 'white';
    }
  }
  get darkMode(): boolean {
    return this.$vuetify.theme.dark;
  }
  get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  get concatenatedStudios(): string {
    if (!this.studios || !this.studios.nodes || !this.studios.nodes.length || !this.showStudios) {
      return '';
    }
    let animationStudios = this.studios.nodes
      .filter((item: IAniListMediaStudioNode) => item.isAnimationStudio)
      .map((item: IAniListMediaStudioNode) => item.name);
    if (!animationStudios.length) {
      animationStudios = this.studios.nodes.map((item: IAniListMediaStudioNode) => item.name);
    }
    return animationStudios[0];
  }
  moveToDetails(id: number) {
    if (!id) {
      return;
    }

    const aniListId = id.toString();
    const location: RawLocation = { name: 'DetailView', params: { id: aniListId } };
    this.$router.push(location);
  }

  @Emit('update:score')
  onScoreChipSaveClick(rating: number) {
    return this.item.id;
  }
}
</script>

<style lang="scss" scoped>
.pointerCursor {
  cursor: pointer;
}
.anime-image-container {
  & .titled,
  & .titled-mobile {
    & .media-title-col {
      overflow: hidden;

      & .clamp-title {
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
      }

      & .clamp-title-single {
        -webkit-line-clamp: 5;
      }

      & .clamp-title-double {
        -webkit-line-clamp: 3 !important;
      }
    }
  }

  & .titled {
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.65);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.85);
    }
    position: absolute;
    bottom: 9px;
    width: 100%;
    max-height: 48px;
    transition: 0.25s ease-in-out;
  }
  & .titled-mobile {
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.65);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.85);
    }
    position: absolute;
    bottom: 9px;
    width: 100%;
    transition: 0.25s ease-in-out;
  }
  &:hover > .titled {
    max-height: 100%;
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.85);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.95);
    }
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 4px #3a3, 0 0 6px #1c1, 0 0 2px #0f0;
  }
  to {
    text-shadow: 0 0 4px #c71, 0 0 6px #07f, 0 0 2px #000;
  }
}

.media-status-icon {
  &.glow {
    animation: glow 5s ease-in-out infinite alternate;
  }

  position: absolute;
  z-index: 2;
  top: 5px;
  left: 5px;
}
</style>
