import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuItemProps,
  MenuDividerProps,
  IconButton,
} from '@chakra-ui/react';
import { FaAngleDown } from 'react-icons/fa';
import React from 'react';

type Props = React.PropsWithChildren<unknown>;

// TODO: Make list tabbable
export const Dropdown = (props: Props): JSX.Element => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        position="relative"
        icon={<FaAngleDown aria-label="menu" />}
        _expanded={{ bg: 'brand.accent', color: 'white' }}
        _focus={{ boxShadow: 'outline' }}
        borderRadius="full"
        bgColor="brand.headerShade"
        _hover={{
          opacity: 0.8,
        }}
      />
      <MenuList bgColor="brand.600" borderColor="brand.border" borderRadius={4}>
        {props.children}
        <Dropdown.MenuDivider />
      </MenuList>
    </Menu>
  );
};

Dropdown.MenuItem = (props: MenuItemProps): JSX.Element => (
  <MenuItem
    textTransform="capitalize"
    _hover={{
      bg: 'brand.headerShade',
    }}
    _active={{
      bg: 'brand.headerShade',
    }}
    _focus={{
      bg: 'brand.headerShade',
    }}
    {...props}
  />
);

Dropdown.MenuDivider = (props: MenuDividerProps): JSX.Element => (
  <MenuDivider {...props} />
);
