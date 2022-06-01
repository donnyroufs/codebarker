import { Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

type Props = React.PropsWithChildren<{
  href: string;
}>;

export const Link = ({ href, children }: Props): JSX.Element => (
  <NextLink href={href} passHref>
    <ChakraLink>{children}</ChakraLink>
  </NextLink>
);
