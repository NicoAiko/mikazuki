<template>
  <v-navigation-drawer
    v-model="drawerActive"
    app
    touchless
    overlay-color="black"
    :overlay-opacity="isMobile ? 0.8 : 0"
    :temporary="isMobile"
    :expand-on-hover="!isMobile"
    :mini-variant="!isMobile"
    :right="$vuetify.rtl"
    :permanent="!isMobile"
    :src="userBackground"
    :style="customStyling"
  >
    <v-list dense nav>
      <v-list-item two-line class="px-0">
        <v-list-item-avatar>
          <img v-if="userAvatar" :src="userAvatar" />
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            <template v-if="userName">
              {{ userName }}
            </template>
            <template v-else>
              {{ $t('alerts.unauthenticated') }}
            </template>
          </v-list-item-title>

          <v-list-item-subtitle v-if="isAuthenticated">
            {{ $t('menus.navigationDrawer.timeUntilNextRefresh', [timerText]) }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn v-if="isMobile" x-small icon text @click.prevent="drawerActive = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn x-small icon text @click.prevent="onRefreshClick">
            <v-icon>
              mdi-refresh
              {{ loading ? 'mdi-spin' : '' }}
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-divider class="my-2" />

      <template v-if="isAuthenticated">
        <v-list-item-group v-model="item" :color="listItemHighlightColor">
          <template v-for="(item, index) in menuItems">
            <v-divider v-if="item.title === 'divider'" :key="index" class="my-2" />

            <v-list-item :key="index" :to="item.location" v-else exact>
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>

              <v-list-item-title>
                {{ $t(item.title) }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list-item-group>

        <v-divider class="my-2" />
      </template>

      <v-list-item @click="settings = !settings">
        <v-list-item-icon>
          <v-icon>mdi-cogs</v-icon>
        </v-list-item-icon>

        <v-list-item-title>
          {{ $t('menus.settings.title') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <v-list-item class="px-2 py-2">
        <v-img style="cursor: pointer" min-width="112" :src="kofiLogo" @click="openSupportPage" />
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { Getter, isMobile } from '@/decorators';
import { refreshTimer, RefreshTimer } from '@/plugins/refreshTimer';
import { IAniListSession } from '@/types';
import KofiDarkLogo from '@/assets/logos/Ko-fi-Support-Logo-Dark.png';
import KofiLightLogo from '@/assets/logos/Ko-fi-Support-Logo-Light.png';

interface NavigationItem {
  title: string | 'divider';
  location?: RawLocation;
  routeName?: string;
  icon?: string;
}

@Component
export default class NavigationDrawer extends Vue {
  @PropSync('settingsDialog', Boolean) settings!: Boolean;
  @PropSync('value', Boolean) drawerActive!: boolean;
  @Getter('userSettings') isAuthenticated!: boolean;
  @Getter('userSettings') session!: IAniListSession;
  @Getter('app') navigationDrawerListItemColor!: string;
  @Getter('app') navigationDrawerBackgroundBrightness!: number;
  @Getter('app') navigationDrawerBackgroundBlurriness!: number;
  @isMobile({ iPadMobile: true }) readonly isMobile!: boolean;

  loading: boolean = false;
  item = 0;
  menuItems: NavigationItem[] = [
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
      title: 'menus.search',
      location: { name: 'Search' },
      routeName: 'Search',
      icon: 'mdi-magnify',
    },
    {
      title: 'divider',
    },
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
      icon: 'mdi-clock-outline',
    },
  ];

  get listItemHighlightColor(): string | undefined {
    return this.navigationDrawerListItemColor === 'auto' ? undefined : this.navigationDrawerListItemColor;
  }

  get customStyling() {
    return {
      '--brightness': `${this.navigationDrawerBackgroundBrightness}%`,
      '--blurriness': `${this.navigationDrawerBackgroundBlurriness}px`,
    };
  }

  get userBackground(): string {
    return this.session.user.bannerImage ?? '';
  }

  get userAvatar(): string {
    return this.session.user.avatar.medium ?? '';
  }

  get userName(): string {
    return this.session.user.name ?? '-/-';
  }

  get timerText(): string {
    const seconds = (refreshTimer.timeUntilRefresh % 60).toString().padStart(2, '0');
    const minutes = Math.floor((refreshTimer.timeUntilRefresh / 60) % 60)
      .toString()
      .padStart(2, '0');
    const hours = Math.floor(refreshTimer.timeUntilRefresh / 3600)
      .toString()
      .padStart(2, '0');
    return `${hours && hours !== '00' ? `${hours}:` : ''}${minutes}:${seconds}`;
  }

  get kofiLogo() {
    return this.navigationDrawerBackgroundBrightness <= 70 ? KofiLightLogo : KofiDarkLogo;
  }

  openSupportPage() {
    window.open('https://ko-fi.com/nicoaiko', '_blank');
  }

  async onRefreshClick() {
    this.loading = true;
    await refreshTimer.triggerRefresh();
    this.loading = false;
  }
}
</script>

<style lang="scss">
.v-navigation-drawer__image {
  -webkit-filter: blur(var(--blurriness)) brightness(var(--brightness));
  filter: blur(var(--blurriness)) brightness(var(--brightness));
}
</style>
