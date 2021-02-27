import { Component, Provide, Vue } from 'vue-property-decorator';
import { Getter } from '@/decorators';
import { IAniListActivity, IAniListSession, IAniListUser } from '@/types';
import ProfileImage from './ProfileImage/ProfileImage.vue';
import Activity from './Activity/Activity.vue';

@Component({
  components: {
    Activity,
    ProfileImage,
  },
})
export default class ALHome extends Vue {
  @Getter('userSettings') readonly session!: IAniListSession;
  @Getter('aniList') readonly latestActivities!: IAniListActivity[];

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
}
