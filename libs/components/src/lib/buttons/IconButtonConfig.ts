import { ComponentStyleConfig } from '@chakra-ui/react';

export const IconButtonConfig: ComponentStyleConfig = {
  variants: {
    icon: {
      borderRadius: 'full',
      bgColor: 'brand.headerShade',
      _hover: {
        opacity: 0.8,
      },
    },
  },
};
