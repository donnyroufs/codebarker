import { List, ListIcon } from '@chakra-ui/react';
import { AiOutlineHome } from 'react-icons/ai';
import { FaChalkboardTeacher } from 'react-icons/fa';

import NavLink from './NavLink';

export const Navigation = (): JSX.Element => {
  return (
    <List
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      <NavLink
        to="/"
        render={(isActive): JSX.Element => (
          <ListIcon
            as={AiOutlineHome}
            fontSize="3xl"
            margin={0}
            color={isActive ? 'brand.accent' : 'brand.gray'}
          />
        )}
      />
      <NavLink
        to="/learn"
        render={(isActive): JSX.Element => (
          <ListIcon
            as={FaChalkboardTeacher}
            fontSize="3xl"
            margin={0}
            color={isActive ? 'brand.accent' : 'brand.gray'}
          />
        )}
      />
    </List>
  );
};
