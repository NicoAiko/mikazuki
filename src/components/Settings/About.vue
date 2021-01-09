<template>
  <v-container fluid class="py-0">
    <div class="text-h5 text-center mb-4">{{ $t('menus.settings.about') }}</div>
    <v-row>
      <v-col cols="12">
        <div class="text-h3 text-center">
          {{ $t('pages.settings.about.version') }}
        </div>
        <div class="text-h1 text-center">
          {{ currentAppVersion }}
        </div>
      </v-col>

      <v-col cols="4" align-self="center">
        <image-link dark :link="githubPage" :image="require('@/assets/logos/github-logo.png')" image-text="GitHub" />
      </v-col>

      <v-col cols="4" align-self="center">
        <image-link
          :link="discordPage"
          :image="require('@/assets/logos/discord-blurple-logo.png')"
          image-text="Discord"
        />
      </v-col>

      <v-col cols="4" align-self="center">
        <image-link
          :link="crunchyrollPage"
          :image="require('@/assets/logos/Crunchyroll.svg')"
          image-text="Crunchyroll"
        />
      </v-col>

      <v-col cols="4" align-self="center">
        <image-link :link="appHomepage" :image="require('@/assets/logos/Mikazuki.svg')" image-text="Mikazuki" />
      </v-col>

      <v-col cols="4" align-self="center">
        <image-link :link="aniListPage" :image="require('@/assets/logos/AniListLogo.svg')" image-text="AniList" />
      </v-col>

      <v-col cols="4" align-self="center">
        <image-link
          :link="redditPage"
          :image="require('@/assets/logos/reddit-logo.svg')"
          image-text="Reddit r/Mikazuki"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ImageLink from './About/ImageLink.vue';
import { version } from '@/../package.json';

@Component({
  components: {
    ImageLink,
  },
})
export default class About extends Vue {
  readonly githubPage = 'https://github.com/nicoaiko/mikazuki';
  readonly discordPage = 'https://discord.gg/sTpR4Gw';
  readonly appHomepage = 'https://www.mikazuki.moe';
  readonly aniListPage = 'https://anilist.co';
  readonly redditPage = 'https://www.reddit.com/r/Mikazuki';
  readonly crunchyrollPage = 'https://www.crunchyroll.com';

  get currentAppVersion(): string {
    return version;
  }
}
</script>
