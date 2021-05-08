import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('./assets/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages = {};

  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });

  return messages;
}

export const validLanguageCodes: string[] = [
  'ar',
  'de',
  'en',
  'es_MX',
  'fr',
  'id',
  'it',
  'ja',
  'my',
  'pt_BR',
  'th',
  'tr',
  'zh_CN',
];

export const i18n = new VueI18n({
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  pluralizationRules: {
    ar(choice: number, choicesLength: number): number {
      if (choice === 0) {
        return 0;
      }

      if (choicesLength === 3) {
        if (choice === 1) {
          return 1;
        }

        return 2;
      } else if (choicesLength === 2) {
        if (choice === 1) {
          return 0;
        }

        return 1;
      }

      if (choice > 0 && choice < 3) {
        return choice;
      }

      if (choice >= 3 && choice <= 10) {
        return 3;
      }

      if (choice > 10) {
        return 4;
      }

      return 0;
    },
  },
});
