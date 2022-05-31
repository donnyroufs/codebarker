import { Link, LinkProps } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type NavLinkProps = LinkProps & {
  render: (isActive: boolean) => string | JSX.Element;
  to: string;
  _hover?: LinkProps;
};

const NavLink = ({ to, render, _hover }: NavLinkProps): JSX.Element => {
  const router = useRouter();
  const isActive = router.pathname === to;

  return (
    <NextLink href={to} passHref>
      <Link
        fontWeight="bold"
        borderRight="2px solid"
        borderColor={isActive ? 'brand.accent' : 'transparent'}
        py={2}
        px="35px"
        _hover={{
          opacity: 0.8,
        }}
      >
        {render(isActive)}
      </Link>
    </NextLink>
  );
};

export default NavLink;
