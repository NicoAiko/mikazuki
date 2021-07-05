<template>
  <v-app-bar app fixed flat dense>
    <v-navigation-drawer v-model="navigationDrawer" temporary app hide-overlay :right="$vuetify.rtl">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ currentRouteName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('menus.navigationDrawer.timeUntilNextRefresh', [timerText]) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list dense nav shaped>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item v-for="(item, index) in mainMenuItems" :key="index" @click="navigateTo(item.location)">
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>

            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
          </v-list-item>

          <v-divider class="py-1" />

          <v-list-item
            v-for="(item, index) in aniListMenuItems"
            :key="index + mainMenuItems.length"
            @click="navigateTo(item.location)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>

            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar-nav-icon @click.stop="navigationDrawer = !navigationDrawer" />

    <v-toolbar-title @click.stop="navigationDrawer = !navigationDrawer" v-text="currentRouteName" />

    <v-spacer />

    <template v-if="!isMediaPage && isAniListRoute">
      <AniListToolbar class="d-none d-lg-flex" />

      <v-spacer class="d-none d-lg-flex" />
    </template>

    <template v-if="isSeasonPreviewPage">
      <SeasonPreviewToolbar class="d-none d-sm-flex" />

      <v-spacer class="d-none d-lg-flex" />
    </template>

    <template v-if="isMediaPage">
      <MediaToolbar class="d-none d-lg-flex" />

      <v-spacer class="d-none d-lg-flex" />
    </template>

    <v-toolbar-items>
      <TransferMessageBox />

      <LoadingIndicator />

      <BackButton v-if="$vuetify.breakpoint.mdAndUp && (isMediaPage || isSettingsPage || isSearchablePage)" />
      <SortButton v-if="isSortingPage" />
      <SearchButton v-if="isAuthenticated" />

      <AniListRefresh />

      <SettingsButton v-if="$vuetify.breakpoint.mdAndUp" />
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { mapGetters } from 'vuex';

// Custom Components
import { refreshTimer } from '@/plugins/refreshTimer';

// Navigation Toolbars
import AniListToolbar from './NavigationToolbars/AniListToolbar.vue';
import MediaToolbar from './NavigationToolbars/MediaToolbar.vue';
import SeasonPreviewToolbar from './NavigationToolbars/SeasonPreviewToolbar.vue';

import TransferMessageBox from './TransferMessageBox.vue';

// Navigation Items
import AniListRefresh from './NavigationToolbars/Items/AniList/Refresh.vue';
import BackButton from './NavigationToolbars/Items/Back.vue';
import LoadingIndicator from './NavigationToolbars/Items/Loading.vue';
import SearchButton from './NavigationToolbars/Items/Search.vue';
import SettingsButton from './NavigationToolbars/Items/Settings.vue';
import SortButton from './NavigationToolbars/Items/Sort.vue';

@Component({
  components: {
    AniListToolbar,
    MediaToolbar,
    SeasonPreviewToolbar,
    // Indicators
    LoadingIndicator,
    // Buttons
    BackButton,
    SearchButton,
    SettingsButton,
    SortButton,
    // AniList Buttons
    AniListRefresh,
    TransferMessageBox,
  },
  computed: {
    ...mapGetters('userSettings', ['isAuthenticated']),
  },
})
export default class Navigation extends Vue {
  readonly refreshTimer = refreshTimer;
  readonly isAuthenticated!: boolean;
  navigationDrawer: boolean = false;

  item = 0;

  mainMenuItems: Array<{ title: string; location: RawLocation; routeName: string; icon: string }> = [
    {
      title: 'menus.aniList.home',
      location: { name: 'Home' },
      routeName: 'Home',
      icon: 'mdi-home',
    },
    {
      title: 'menus.aniList.seasonPreview',
      location: { name: 'SeasonPreview' },
      routeName: 'SeasonPreview',
      icon: 'mdi-calendar-month',
    },
    {
      title: 'menus.settings.title',
      location: { name: 'Settings' },
      routeName: 'Settings',
      icon: 'mdi-settings',
    },
  ];

  aniListMenuItems: Array<{ title: string; location: RawLocation; routeName: string; icon: string }> = [
    {
      title: 'menus.aniList.watching',
      location: { name: 'Watching' },
      routeName: 'Watching',
      icon: 'mdi-play',
    },
    {
      title: 'menus.aniList.repeating',
      location: { name: 'Repeating' },
      routeName: 'Repeating',
      icon: 'mdi-repeat',
    },
    {
      title: 'menus.aniList.completed',
      location: { name: 'Completed' },
      routeName: 'Completed',
      icon: 'mdi-check',
    },
    {
      title: 'menus.aniList.paused',
      location: { name: 'Paused' },
      routeName: 'Paused',
      icon: 'mdi-pause',
    },
    {
      title: 'menus.aniList.dropped',
      location: { name: 'Dropped' },
      routeName: 'Dropped',
      icon: 'mdi-stop',
    },
    {
      title: 'menus.aniList.planning',
      location: { name: 'Planning' },
      routeName: 'Planning',
      icon: 'mdi-menu',
    },
  ];

  get isMediaPage(): boolean {
    return this.$route.meta && this.$route.meta.mediaPage;
  }

  get isSearchablePage(): boolean {
    return this.$route.meta && this.$route.meta.searchablePage;
  }

  get isSettingsPage(): boolean {
    return this.$route.name === 'Settings';
  }

  get isSeasonPreviewPage(): boolean {
    return this.$route.meta && this.$route.meta.seasonPreviewPage;
  }

  get isSortingPage(): boolean {
    return this.$route.meta && this.$route.meta.sortingPage;
  }

  get currentRouteName(): string {
    const routeName = this.$route.meta?.routeName ?? '';

    return this.$t(`routes.${routeName}`) as string;
  }

  get isAniListRoute(): boolean {
    const currentRoute = this.$route.path;

    return currentRoute.startsWith('/aniList');
  }

  get timeUntilRefresh(): number {
    return this.refreshTimer.timeUntilRefresh;
  }

  get timerText(): string {
    const time = this.timeUntilRefresh * 1000;

    return moment(time).format('mm:ss');
  }

  created() {
    const currentRouteName = this.$route.name;

    this.item = this.mainMenuItems.findIndex((item) => item.routeName === currentRouteName);

    if (this.item === -1) {
      this.item = this.aniListMenuItems.findIndex((item) => item.routeName === currentRouteName);

      if (this.item !== -1) {
        this.item += 2;
      }
    }
  }

  navigateTo(location: RawLocation) {
    this.$router.push(location);
  }

  @Watch('currentRouteName')
  routeChanged() {
    const currentRouteName = this.$route.name;

    this.item = this.mainMenuItems.findIndex((item) => item.routeName === currentRouteName);

    if (this.item === -1) {
      this.item = this.aniListMenuItems.findIndex((item) => item.routeName === currentRouteName);

      if (this.item !== -1) {
        this.item += 2;
      }
    }
  }
}
</script>
