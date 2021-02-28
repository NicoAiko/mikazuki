import dayjs from 'dayjs';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Reply extends Vue {
  @Prop(Object) reply!: any;

  get humanReadableCreatedAt(): string {
    return dayjs(this.reply.createdAt * 1000).format(this.$t('misc.dates.fullDateTime').toString());
  }
}
