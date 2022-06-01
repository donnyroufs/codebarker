import { Box, Flex, Container, useDisclosure } from '@chakra-ui/react';

import { Header } from '@codebarker/components';
import { signOut } from 'next-auth/react';
import { useAuth } from '../hooks';
import { useAuthError } from '../hooks/useAuthError';

import { Sidebar } from './Sidebar';
import { SignInModal } from './SignInModal';

export const Layout = ({ children }): JSX.Element => {
  useAuthError();

  const { onOpen, ...disclosure } = useDisclosure();
  const { user, isLoading } = useAuth({
    required: false,
  });

  return (
    <Box>
      <SignInModal {...disclosure} />
      <Header
        name={user?.name}
        onOpen={onOpen}
        isLoading={isLoading}
        avatarUrl={user?.image}
        signOut={signOut}
      />
      <Flex>
        <Sidebar />
        <Container maxW="100%" padding={8}>
          {children}
        </Container>
      </Flex>
    </Box>
  );
};
