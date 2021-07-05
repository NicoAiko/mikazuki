<template>
  <v-main>
    <list :status="status" :sort-by="sortBy" :sort-desc="sortDesc" />

    <burger-button @on-sort-click="onSortClick" @on-filter-click="onFilterClick" />

    <sort-menu :position="position" :show.sync="showSortMenu" @update:sort="onUpdateSort" />
    <!-- <filter-menu :show="showFilterMenu" /> -->
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import List from '@/components/Anime/List.vue';
import BurgerButton from '@/components/Anime/BurgerButton.vue';
import SortMenu from '@/components/Anime/BurgerButtonElements/SortMenu.vue';

// Custom Components
import EventBus from '@/eventBus';
import { AniListListStatus } from '@/types';

@Component({
  components: {
    BurgerButton,
    List,
    SortMenu,
  },
  beforeRouteUpdate(to, from, next) {
    EventBus.$emit('resetAllSorts');
    next();
  },
  beforeRouteLeave(to, from, next) {
    EventBus.$emit('resetAllSorts');
    next();
  },
})
export default class AniList extends Vue {
  status!: AniListListStatus;
  showSortMenu: boolean = false;
  showFilterMenu: boolean = false;
  position: [number, number] = [0, 0];
  sortBy: string = 'title';
  sortDesc: boolean = false;

  created() {
    this.status = this.$route.meta?.status;
  }

  onSortClick(position: [number, number]) {
    this.position = position;
    this.showSortMenu = true;
  }

  onFilterClick() {
    this.showFilterMenu = true;
  }

  onUpdateSort([key, desc]: [string, boolean]) {
    this.sortBy = key;
    this.sortDesc = desc;
  }
}
</script>
