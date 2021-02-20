import { format } from 'url';
import { Component, Vue } from 'vue-property-decorator';
import { Getter } from '@/decorators';
import { USERSETTINGS_MUTATIONS } from '@/store/modules/userSettings';

interface Language {
  value: string;
  title: string;
  subtitle: string;
}

@Component
export default class LoginView extends Vue {
  @Getter('app') readonly language!: string;
  loginFailed: boolean = false;

  get _language(): string {
    return this.language;
  }
  set _language(value: string) {
    this.$store.commit('app/setLanguage', value);
  }
  get languages(): Language[] {
    const { messages } = this.$i18n;

    return Object.entries(messages).map(([key, value]) => {
      const locale = key;
      const original = value.originalReading.toString();
      const english = value.englishReading.toString();
      return {
        value: locale,
        title: original,
        subtitle: english,
      };
    });
  }

  async beforeMount() {
    if (this.$route.query?.access_token) {
      const { access_token } = this.$route.query;

      if (!access_token) {
        this.loginFailed = true;
        return;
      }

      this.$store.commit(USERSETTINGS_MUTATIONS.SET_SESSION, access_token);
      await this.$router.replace({ name: 'Home' });
    }
  }

  onChangeLanguageClick({ value }: Language) {
    this._language = value;
  }

  onLoginClick() {
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
}
