import { Component, Provide, Vue } from 'vue-property-decorator';
import { Getter } from '@/decorators';
import { IAniListSession, IAniListUser } from '@/types';
import ProfileImage from './ProfileImage/ProfileImage.vue';

@Component({
  components: {
    ProfileImage,
  },
})
export default class ALHome extends Vue {
  @Getter('userSettings') session!: IAniListSession;

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
