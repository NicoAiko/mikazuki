import dayjs from 'dayjs';
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
import { IAniListActivity } from '@/types';
import Reply from './Reply/Reply.vue';

@Component({
  components: { Reply },
})
export default class ReplyDialog extends Vue {
  @PropSync('dialog', Boolean) show!: boolean;
  @Prop(Object) activity!: IAniListActivity;
  replyText: string = '';

  get humanReadableCreatedAt(): string {
    return dayjs(this.activity.createdAt * 1000).format(this.$t('misc.dates.fullDateTime').toString());
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

  onCancelClick() {
    this.replyText = '';
    this.$emit('close');
  }

  async onSubmitClick() {
    await this.$http.saveActivityReply(this.activity.id, this.replyText);

    this.replyText = '';
    this.$emit('reload');
    // this.$emit('close');
  }
}
