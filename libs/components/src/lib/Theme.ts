import '@fontsource/karla';

import { extendTheme } from '@chakra-ui/react';
import { merge } from 'lodash';

import { IconButtonConfig } from './buttons/IconButtonConfig';
import { ButtonConfig } from './buttons/ButtonConfig';

export const theme = extendTheme({
  config: {
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Karla', 'sans-serif'",
    body: "'Karla', 'sans-serif'",
  },
  colors: {
    brand: {
      400: '#2B2844',
      500: '#212037',
      600: '#1C1A31',
      700: '#151329',
      accent: '#21A2B1',
      header: '#2B2844',
      headerShade: '#3c3c5c',
      text: '#c1c1d6',
      border: '#2F2F4C',
      gray: '#4C4C58',
      panel: '#2F2F4C',
      btnSecondary: '#2F2F4C',
    },
  },
  components: {
    Button: merge(IconButtonConfig, ButtonConfig),
  },
  shadows: {
    card: '5px 9px 66px -15px #292741',
  },
});
