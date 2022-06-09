import { ChakraProps } from '@chakra-ui/react';
import { Button, ButtonVariant } from '@codebarker/components';
import NextLink from 'next/link';

type Props = React.PropsWithChildren<{
  href: string;
  variant?: ButtonVariant;
  _style?: ChakraProps;
}>;

export const ButtonLink = ({
  href,
  children,
  variant,
  _style,
}: Props): JSX.Element => (
  <NextLink href={href} passHref>
    <a>
      <Button
        as="span"
        textDecor="none !important"
        variant={variant ? variant : 'primary'}
        {..._style}
      >
        {children}
      </Button>
    </a>
  </NextLink>
);
