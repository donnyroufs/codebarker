import { ChakraProps, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

type Props = React.PropsWithChildren<{
  href: string;
  _styles?: ChakraProps;
}>;

export const Link = ({ href, children, _styles }: Props): JSX.Element => (
  <NextLink href={href} passHref>
    <ChakraLink {..._styles}>{children}</ChakraLink>
  </NextLink>
);
