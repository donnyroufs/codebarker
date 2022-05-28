import '@fontsource/karla';

import { extendTheme } from '@chakra-ui/react';
import { IconButtonConfig } from './iconButton/IconButtonConfig';

export const theme = extendTheme({
  fonts: {
    heading: "'Karla', 'sans-serif'",
    body: "'Karla', 'sans-serif'",
  },
  colors: {
    brand: {
      400: '#2B2844',
      500: '#212037',
      600: '#1C1A31',
      accent: '#23D6EC',
      header: '#2B2844',
      headerShade: '#3c3c5c',
      white: '#D0D0D1',
      border: '#2F2F4C',
    },
  },
  components: {
    Button: IconButtonConfig,
  },
  shadows: {
    card: '5px 9px 66px -15px #292741',
  },
});
