import Vue from 'vue';
import VueMatomo from 'vue-matomo';
import Notification from 'vue-notification';
import Vuetify from 'vuetify';
import './registerServiceWorker';

// Components
import App from './App.vue';
import { i18n } from './i18n';
import router from './router';
import store from './store';
import AniListAPI from './plugins/AniList';
import MatomoOptions from './plugins/Matomo';

// Styles & Fonts
import '@/assets/scss/extra.scss';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';
import 'flag-icon-css/css/flag-icon.min.css';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});

Vue.use(Notification);
Vue.use(AniListAPI);

if (process.env.VUE_APP_USE_MATOMO == 'true') {
  Vue.use(VueMatomo, MatomoOptions);
}

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: (h: any) => h(App),
}).$mount('#app');
