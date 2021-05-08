import { Getter } from '@/decorators';
import { IAniListSession, IAniListUser } from '@/types';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AnimeStats extends Vue {
  @Getter('userSettings') session!: IAniListSession;

  get currentUser(): IAniListUser | null {
    return this.session?.user ?? null;
  }

  get daysWatched(): string {
    if (!this.currentUser) {
      return '-/-';
    }

    const { minutesWatched } = this.currentUser.statistics.anime;

    return (minutesWatched / 1440).toFixed(1);
  }

  get animeMeanScore(): string {
    if (!this.currentUser) {
      return '-/-';
    }

    const { meanScore } = this.currentUser.statistics.anime;

    return meanScore.toFixed(1);
  }
}