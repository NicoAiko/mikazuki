import dayjs from 'dayjs';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAniListActivity } from '@/types';
import IndeterminateImage from '@/components/IndeterminateImage.vue';

@Component({
  components: {
    IndeterminateImage,
  },
})
export default class Activity extends Vue {
  @Prop(Object) activity!: IAniListActivity;

  get humanReadableCreatedAt(): string {
    return dayjs(this.activity.createdAt * 1000).fromNow();
  }

  get translateStatus(): string {
    switch (this.activity.status) {
      case 'watched episode':
        return 'watchedEpisode';
      case 'plans to watch':
        return 'plansToWatch';
      case 'paused watching':
        return 'pausedWatching';
      case 'rewatched episode':
        return 'rewatchedEpisode';
      case 'read chapter':
        return 'readChapter';
      case 'plans to read':
        return 'plansToRead';
      case 'reread chapter':
        return 'rereadChapter';
      case 'paused reading':
        return 'pausedReading';
      default:
        return this.activity.status;
    }
  }
}
