import { IconButton as ChakraIconButton } from '@chakra-ui/react';

export type Props = {
  'aria-label': string;
  icon: JSX.Element;
};

export const IconButton = (props: Props): JSX.Element => {
  return <ChakraIconButton {...props} variant="icon" color="brand.white" />;
};
