import { Getter } from '@/decorators';
import { IAniListSession, IAniListUser } from '@/types';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MangaStats extends Vue {
  @Getter('userSettings') session!: IAniListSession;

  get currentUser(): IAniListUser | null {
    return this.session?.user ?? null;
  }

  get mangaMeanScore() {
    if (!this.currentUser) {
      return '-/-';
    }

    const { meanScore } = this.currentUser.statistics.manga;

    return meanScore.toFixed(1);
  }
}