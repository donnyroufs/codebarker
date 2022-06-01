import { ComponentStyleConfig } from '@chakra-ui/react';

export const ButtonConfig: ComponentStyleConfig = {
  variants: {
    primary: {
      bgColor: 'brand.accent',
      color: 'white',
      fontSize: '.9rem',
      padding: '1rem 1.45rem',
      textTransform: 'capitalize',
      _hover: {
        bgColor: 'brand.accent',
        opacity: 0.8,
      },
    },
    secondary: {
      bgColor: 'brand.btnSecondary',
      color: 'white',
      textTransform: 'capitalize',
      fontSize: '.9rem',
      padding: '1rem 1.45rem',
      fontWeight: 'normal',
      _hover: {
        opacity: 0.8,
      },
    },
    outline: {
      bgColor: 'transparent !important',
      border: '2px solid',
      borderColor: 'brand.border',
      color: 'brand.white',
      textTransform: 'capitalize',
      fontSize: '.9rem',
      padding: '1rem 1.45rem',
      fontWeight: 'normal',
      _hover: {
        opacity: 0.8,
      },
    },
  },
};
