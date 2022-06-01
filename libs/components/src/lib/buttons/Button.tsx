import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

export type Props = React.PropsWithChildren<
  ButtonProps & {
    variant?: 'primary' | 'secondary' | 'outline';
  }
>;

export const Button = ({ children, variant, ...props }: Props): JSX.Element => {
  return (
    <ChakraButton
      {...props}
      variant={variant ? variant : 'primary'}
      textDecor="none !important"
    >
      {children}
    </ChakraButton>
  );
};
