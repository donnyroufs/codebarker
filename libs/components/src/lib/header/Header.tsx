import {
  HStack,
  Text,
  Box,
  Wrap,
  WrapItem,
  Avatar,
  ButtonGroup,
} from '@chakra-ui/react';
import { FaRegBell, FaAngleDown } from 'react-icons/fa';
import { IconButton } from '../iconButton/IconButton';

export type Props = {
  name: string;
  avatarUrl?: string;
};

// TODO: Move avatar to its own component
export const Header = (props: Props): JSX.Element => {
  return (
    <HStack
      bgColor="brand.header"
      color="brand.white"
      h="8rem"
      px={8}
      justifyContent="space-between"
      borderBottom="2px solid"
      borderColor="brand.border"
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          codebarker.
        </Text>
      </Box>
      <HStack spacing={6}>
        <HStack spacing={4} display={{ base: 'none', sm: 'flex' }}>
          <Wrap>
            <WrapItem>
              <Avatar
                name={props.name}
                src={props.avatarUrl ?? ''}
                userSelect="none"
              />
            </WrapItem>
          </Wrap>
          <Text textTransform="capitalize" fontWeight="600" userSelect="none">
            {props.name}
          </Text>
        </HStack>
        <ButtonGroup spacing={2}>
          <IconButton aria-label="your notifcations" icon={<FaRegBell />} />
          <IconButton aria-label="menu" icon={<FaAngleDown />} />
        </ButtonGroup>
      </HStack>
    </HStack>
  );
};
