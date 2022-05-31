import {
  HStack,
  Text,
  Box,
  Wrap,
  WrapItem,
  Avatar,
  ButtonGroup,
  Skeleton,
  Button,
} from '@chakra-ui/react';
import { FaRegBell, FaAngleDown } from 'react-icons/fa';
import { IconButton } from '../iconButton/IconButton';

export type Props = {
  name?: string | null;
  avatarUrl?: string | null;
  onOpen: () => void;
  isLoading: boolean;
};

// TODO: Move avatar to its own component
export const Header = ({
  onOpen,
  isLoading,
  name,
  avatarUrl,
}: Props): JSX.Element => {
  const isSignedIn = !isLoading && Boolean(name);
  const isLoaded = !isLoading;

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
        {!isSignedIn && (
          <ButtonGroup spacing={2}>
            <Button onClick={onOpen}>Sign Up</Button>
            <Button variant="secondary" fontWeight="normal" onClick={onOpen}>
              Sign In
            </Button>
          </ButtonGroup>
        )}
        {isSignedIn && (
          <>
            <HStack spacing={4} display={{ base: 'none', sm: 'flex' }}>
              <Skeleton
                isLoaded={isLoaded}
                borderRadius="full"
                startColor="brand.panel"
                endColor="brand.headerShade"
              >
                <Wrap>
                  <WrapItem>
                    <Avatar
                      name={name!}
                      src={
                        avatarUrl ??
                        `https://avatars.dicebear.com/api/avataaars/${name!}.svg?`
                      }
                      userSelect="none"
                    />
                  </WrapItem>
                </Wrap>
              </Skeleton>
              <Skeleton
                isLoaded={isLoaded}
                startColor="brand.panel"
                endColor="brand.headerShade"
              >
                <Text
                  textTransform="capitalize"
                  fontWeight="600"
                  userSelect="none"
                >
                  {name}
                </Text>
              </Skeleton>
            </HStack>
            {isSignedIn && (
              <ButtonGroup spacing={2}>
                <IconButton
                  aria-label="your notifcations"
                  icon={<FaRegBell />}
                />
                <IconButton aria-label="menu" icon={<FaAngleDown />} />
              </ButtonGroup>
            )}
          </>
        )}
      </HStack>
    </HStack>
  );
};
