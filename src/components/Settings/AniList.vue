<template>
  <v-container fluid class="py-0">
    <template v-if="!isAuthenticated">
      <div class="py-1">
        <p>{{ $t('pages.settings.aniList.notLoggedIn') }}</p>
        <v-btn block color="primary" @click="login" v-text="$t('actions.login')" />
      </div>
    </template>

    <template v-if="isAuthenticated">
      <v-row>
        <v-col cols="12" md>
          <v-chip pill>
            <v-avatar left v-if="userProfilePicture">
              <v-img :src="userProfilePicture" />
            </v-avatar>
            {{ $t('pages.settings.aniList.loggedInAs', [username]) }}
          </v-chip>
        </v-col>

        <v-divider vertical v-if="$vuetify.breakpoint.mdAndUp" />

        <v-col cols="12" md>
          <v-btn block color="error" @click="logout">
            <v-icon left small>mdi-logout</v-icon>
            {{ $t('actions.logout') }}
          </v-btn>
        </v-col>
      </v-row>

      <v-container fluid class="px-0">
        <div class="text-h5 pb-0">{{ $t('pages.settings.aniList.userAccountSettings.headline') }}</div>
        <div class="text-subtitle-1 warning--text pt-0">
          {{ $t('pages.settings.aniList.userAccountSettings.subHeadline') }}
        </div>
        <v-row>
          <v-col cols="12" md="6">
            <user-title-language :user-title-language="titleLanguage" />
          </v-col>
          <v-col cols="12" md="6">
            <scoring-format :scoring-format="scoringFormat" />
          </v-col>
          <v-col cols="12" md="6">
            <show-explicit-content :show="explicitContent" />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-container>
</template>

<script lang="ts">
import { format } from 'url';
import { Component, Vue } from 'vue-property-decorator';
import UserTitleLanguage from './AniList/UserTitleLanguage.vue';
import ScoringFormat from './AniList/ScoringFormat.vue';
import ShowExplicitContent from './AniList/ShowExplicitContent.vue';
import { Getter } from '@/decorators';
import { IAniListSession, AniListUserTitleLanguage, AniListScoreFormat } from '@/types';

@Component({
  components: {
    ScoringFormat,
    UserTitleLanguage,
    ShowExplicitContent,
  },
})
export default class AniList extends Vue {
  @Getter('userSettings') readonly isAuthenticated!: boolean;
  @Getter('userSettings') session!: IAniListSession;
  @Getter('userSettings') refreshRate!: number;

  get username(): string | null {
    return this.session?.user?.name ?? null;
  }

  get userProfilePicture(): string | null {
    return this.session?.user?.avatar.medium ?? null;
  }

  get titleLanguage(): AniListUserTitleLanguage | null {
    return this.session?.user.options.titleLanguage ?? null;
  }

  get scoringFormat(): AniListScoreFormat | null {
    return this.session?.user.mediaListOptions.scoreFormat ?? null;
  }

  get explicitContent(): boolean | null {
    return this.session?.user.options.displayAdultContent ?? null;
  }

  login() {
    if (this.isAuthenticated) {
      return;
    }

    const oauthConfig = {
      clientId: process.env.VUE_APP_CLIENT_ID,
      redirectUri: process.env.VUE_APP_REDIRECT_HOST,
      authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
      tokenUrl: 'https://anilist.co/api/v2/oauth/token',
      useBasicAuthorizationHeader: true,
    };
    const url = format(`${oauthConfig.authorizationUrl}?client_id=${oauthConfig.clientId}&response_type=token`);

    window.open(url, '_self');
  }

  async logout() {
    if (!this.isAuthenticated) {
      return;
    }

    this.$store.commit('app/setLoadingState', true);
    await this.$store.dispatch('userSettings/logout');
    this.$store.commit('app/setLoadingState', false);

    // Move back to Home page if not there yet
    if (this.$route.name !== 'Home') {
      await this.$router.push({ name: 'Home' });
    }
  }
}
</script>
