import { Component, Prop, ProvideReactive, Vue } from 'vue-property-decorator';
import { Getter } from '@/decorators';
import { AniListListStatus, IAniListMediaListCollection } from '@/types';
import ListItem from './Item/Item.vue';

@Component({
  components: {
    ListItem,
  },
})
export default class AniListUserList extends Vue {
  @Prop(String) readonly status!: AniListListStatus;
  @Getter('aniList') readonly aniListData!: IAniListMediaListCollection;

  @ProvideReactive()
  get listData() {
    return this.aniListData.lists.find((list) => list.status === this.status)?.entries ?? [];
  }
}
