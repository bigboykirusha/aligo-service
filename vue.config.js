const { defineConfig } = require('@vue/cli-service');
const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = defineConfig({
  publicPath: '/',
  outputDir: path.resolve(__dirname, 'dist'),
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
  },
});
