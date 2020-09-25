<template>
  <v-progress-linear color="success darken-2" :value="percentage" :height="!!mediaProgress ? 27 : 25" Î>
    <v-container v-if="!!mediaProgress" fluid class="ma-0 pa-0" style="position: absolute; bottom: 0">
      <v-progress-linear color="rgba(255, 193, 7, 0.8)" :value="mediaProgress" :height="2" />
    </v-container>
    <v-container class="ma-0 pa-0 d-flex flex-row align-center align-self-baseline justify-space-between">
      <span class="pl-3 white--text episodeCount">{{ currentProgress }} / {{ episodeAmount }}</span>
      <v-btn v-if="!completedList" small text icon @click="increaseEpisodeCounter">
        <v-icon size="20">mdi-plus</v-icon>
      </v-btn>
    </v-container>
  </v-progress-linear>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { AniListListStatus } from '@/types';

@Component
export default class ProgressCircle extends Vue {
  @Prop(Object) item!: any;
  @Prop(String) status!: string;
  @Prop(Function) increaseEpisode!: Function;

  get completedList(): boolean {
    return this.status === AniListListStatus.COMPLETED;
  }

  get entryId(): number {
    return this.item.id;
  }

  get percentage(): number {
    const { episodeAmount, nextAiringEpisode, currentProgress } = this.item;

    if (!currentProgress) {
      return 0;
    }
    // Check if max episode amount is known
    if (episodeAmount && typeof episodeAmount === 'number') {
      return (currentProgress / episodeAmount) * 100;
    }
    // We don't know the exact amount of episodes
    // But we might know how many episodes have been aired so far
    // so we can calculate the percentage of the currently available episodes
    // and then add some buffer
    if (nextAiringEpisode?.episode) {
      // We have to substract one here as that episode isn't aired yet
      const episode = nextAiringEpisode.episode - 1 > 0 ? nextAiringEpisode.episode - 1 : 1;
      // We choose only 80 percent here, as we are unaware of the episode amount
      return (currentProgress / episode) * 75;
    }
    // Just return 75% if we have a non-zero progress but
    // neither through the next airing episode nor through the episode amount
    // we can determine our status.
    return 75;
  }

  get currentProgress(): number {
    return this.item.currentProgress;
  }

  get episodeAmount(): number | string {
    return this.item.episodeAmount;
  }

  get mediaProgress(): number {
    const { nextAiringEpisode, episodeAmount, currentProgress } = this.item;
    const episodesUntilNow = nextAiringEpisode?.episode - 1;

    if (!episodesUntilNow) {
      return 0;
    }

    if (!episodeAmount || episodeAmount === '?') {
      const multiplyer = currentProgress === episodesUntilNow ? 75 : 80;

      return (currentProgress / episodesUntilNow) * multiplyer;
    }

    return (episodesUntilNow / episodeAmount) * 100;
  }

  async increaseEpisodeCounter() {
    try {
      await this.increaseEpisode(this.entryId);
    } catch (error) {
      console.error('nope');
    }
  }
}
</script>