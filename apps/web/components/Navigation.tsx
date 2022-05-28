import { Link, List, ListIcon } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AiOutlineHome } from 'react-icons/ai';

export const Navigation = (): JSX.Element => {
  return (
    <List
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      spacing={2}
    >
      <NextLink href="/" passHref>
        <Link
          borderRight="2px solid"
          borderColor="brand.accent"
          py={2}
          px="35px"
          _hover={{
            opacity: 0.8,
          }}
        >
          <ListIcon
            as={AiOutlineHome}
            color="brand.accent"
            fontSize="3xl"
            margin={0}
          />
        </Link>
      </NextLink>
    </List>
  );
};
