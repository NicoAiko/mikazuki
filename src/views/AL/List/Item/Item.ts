import dayjs from 'dayjs';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AniListMediaStatus, IAniListEntry } from '@/types';

@Component
export default class AniListUserListItem extends Vue {
  @Prop(Object) item!: IAniListEntry;

  get score(): string {
    return this.item?.score.toFixed(1) ?? 0;
  }

  get episodeText(): string {
    if (!this.item) {
      return 'Episode ? / ?';
    }

    const { progress } = this.item;
    const { episodes } = this.item.media;

    return ['Episode', progress, '/', episodes || '?'].join(' ');
  }

  get title(): string {
    return this.item?.media?.title?.userPreferred ?? '';
  }

  get cover(): string {
    return this.item?.media?.coverImage?.extraLarge ?? '';
  }

  get isAiring(): boolean {
    return this.item?.media.status === AniListMediaStatus.RELEASING ?? false;
  }

  get nextEpisode(): [number, string] | null {
    if (!this.item) {
      return null;
    }

    const { nextAiringEpisode } = this.item.media;
    return !nextAiringEpisode ? null : [nextAiringEpisode.episode, dayjs.unix(nextAiringEpisode.airingAt).fromNow()];
  }

  get missingEpisodes(): number {
    if (!this.item) {
      return 0;
    }

    const { progress } = this.item;
    const { nextAiringEpisode } = this.item.media;

    if (!nextAiringEpisode) {
      return 0;
    }

    const { episode: nextEpisode } = nextAiringEpisode;

    // Return the amount of episodes only when there are next episodes
    // and if there are episodes the user hasn't watched yet.
    return nextEpisode - 1 > 0 && nextEpisode - 1 - progress > 0 ? nextEpisode - 1 - progress : 0;
  }

  get userProgress(): number {
    if (!this.item) {
      return 0;
    }

    const { progress } = this.item;
    const { episodes, nextAiringEpisode } = this.item.media;

    if (!progress) {
      return 0;
    }

    if (episodes) {
      return (progress / episodes) * 100;
    }

    if (nextAiringEpisode?.episode) {
      const tempEpisodeAmount = nextAiringEpisode.episode - 1 > 0 ? nextAiringEpisode.episode - 1 : 1;

      return (progress / tempEpisodeAmount) * 75;
    }

    return 0;
  }

  get mediaProgress(): number {
    if (!this.item) {
      return 0;
    }

    const { progress } = this.item;
    const { nextAiringEpisode, episodes } = this.item.media;
    const episodesUntilNow = (nextAiringEpisode?.episode ?? 0) - 1;

    if (episodesUntilNow <= 0) {
      return 0;
    }

    if (!episodes) {
      const multiplyer = progress === episodesUntilNow ? 75 : 80;

      return (progress / episodesUntilNow) * multiplyer;
    }

    return (episodesUntilNow / episodes) * 100;
  }
}
