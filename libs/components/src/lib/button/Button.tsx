import { PropsWithChildren } from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

export type Props = PropsWithChildren<ButtonProps>;

export const Button = ({ children, ...props }: Props): JSX.Element => {
  return (
    <ChakraButton variant="solid" {...props}>
      {children}
    </ChakraButton>
  );
};
