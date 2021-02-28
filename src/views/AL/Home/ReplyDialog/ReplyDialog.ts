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
