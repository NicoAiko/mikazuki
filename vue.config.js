module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PUBLIC_PATH : '/',
  productionSourceMap: false,
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'assets/locales',
      enableInSFC: false,
    },
  },
  configureWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.output.filename = '[name].[contenthash].js';
    }
  },
  chainWebpack(config) {
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();
  },
};
