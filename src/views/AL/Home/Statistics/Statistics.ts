import { Component, Vue } from 'vue-property-decorator';
import AnimeStats from './SubComponents/AnimeStats/AnimeStats.vue';
import MangaStats from './SubComponents/MangaStats/MangaStats.vue';

@Component({
  components: {
    AnimeStats,
    MangaStats,
  }
})
export default class HomeStatistics extends Vue {}