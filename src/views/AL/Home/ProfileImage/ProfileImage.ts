import { Component, Inject, Vue } from 'vue-property-decorator';
import { IAniListUser } from '@/types';

@Component
export default class ProfileImage extends Vue {
  @Inject() currentUser!: IAniListUser;

  get avatarUrl(): string {
    return this.currentUser?.avatar?.large;
  }

  get username(): string {
    return this.currentUser?.name;
  }
}
