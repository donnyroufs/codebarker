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
    solid: {
      bgColor: 'brand.accent',
      color: 'white',
      fontSize: '.9rem',
      padding: '1rem 1.45rem',
      textTransform: 'capitalize',
      _hover: {
        bgColor: 'brand.accent',
        opacity: 0.9,
      },
    },
    secondary: {
      bgColor: 'brand.btnSecondary',
      color: 'white',
      textTransform: 'capitalize',
      fontSize: '.9rem',
      padding: '1rem 1.45rem',
      _hover: {
        opacity: 0.9,
      },
    },
  },
};
