/*
global-data plugin makes it possible to use the
named media queries from open-props in all CSS files.

for reference of available media queries: https://open-props.style/#media-queries
*/

export default {
  plugins: {
    'postcss-import': {},
    '@csstools/postcss-global-data': {
      files: ['./node_modules/open-props/media.min.css'],
    },
    'postcss-custom-media': {},
    'postcss-pxtorem': {
      propList: ['*'],
      minPixelValue: 1,
    },
    'postcss-preset-env': {
      stage: 0,
      autoprefixer: {
        grid: true,
      },
    },
  },
};
