import { Component, Provide, Vue } from 'vue-property-decorator';
import { Getter } from '@/decorators';
import { IAniListActivity, IAniListSession, IAniListUser } from '@/types';
import ProfileImage from './ProfileImage/ProfileImage.vue';
import Activity from './Activity/Activity.vue';
import ReplyDialog from './ReplyDialog/ReplyDialog.vue';

@Component({
  components: {
    Activity,
    ProfileImage,
    ReplyDialog,
  },
})
export default class ALHome extends Vue {
  @Getter('userSettings') readonly session!: IAniListSession;
  @Getter('aniList') readonly latestActivities!: IAniListActivity[];
  selectedActivity: IAniListActivity | null = null;
  showReplyDialog: boolean = false;

  @Provide()
  get currentUser(): IAniListUser {
    return this.session.user;
  }

  get backgroundStyles(): Record<string, string> {
    if (!this.currentUser) {
      return {};
    }

    return {
      '--url': `url(${this.currentUser.bannerImage})`,
    };
  }

  onUpdateActivity(activity: Partial<IAniListActivity>) {
    const record = this.latestActivities.find((item) => item.id === activity.id);

    if (!record) {
      return;
    }

    Object.entries(activity).forEach(([key, value]) => {
      (record as any)[key] = value;
    });
  }

  onShowActivityReplyDialog(activity: IAniListActivity) {
    this.selectedActivity = activity;
    this.showReplyDialog = true;
  }

  onCloseActivityReplyDialog() {
    this.showReplyDialog = false;
    this.selectedActivity = null;
  }

  async onReloadActivity() {
    if (!this.selectedActivity) {
      return;
    }

    const currentActivity = this.selectedActivity;
    let record = this.latestActivities.find((item) => item.id === currentActivity.id);
    const activity = await this.$http.getActivity(currentActivity.id);

    this.selectedActivity = activity;
    record = activity;
  }
}
