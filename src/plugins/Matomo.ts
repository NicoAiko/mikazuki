import router from '@/router';

export default {
  router,
  trackerFileName: process.env.VUE_APP_MATOMO_TRACKERFILENAME,
  host: process.env.VUE_APP_MATOMO_HOST,
  siteId: process.env.VUE_APP_MATOMO_SITEID,
  enableLinkTracking: false,
  disableCookies: true,
  enableHeatBeatTimer: true,
  debug: process.env.NODE_ENV !== 'production',
  domains: process.env.VUE_APP_MATOMO_DOMAINS,
};
