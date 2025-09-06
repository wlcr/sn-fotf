import type {CodegenConfig} from '@graphql-codegen/cli';
import {pluckConfig, preset, getSchema} from '@shopify/hydrogen-codegen';

export default {
  overwrite: true,
  pluckConfig,
  generates: {
    'storefrontapi.generated.d.ts': {
      schema: getSchema('storefront'),
      documents: [
        './*.{ts,tsx,js,jsx}',
        './app/**/*.{ts,tsx,js,jsx}',
        '!./app/graphql/customer-account/*.{ts,tsx,js,jsx}',
      ],
      preset,
    },
    'customeraccountapi.generated.d.ts': {
      schema: getSchema('customer-account'),
      documents: ['./app/graphql/customer-account/*.{ts,tsx,js,jsx}'],
      preset,
    },
  },
} as CodegenConfig;
