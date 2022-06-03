import { Box, Flex, Container } from '@chakra-ui/react';

import { Header } from '@codebarker/components';
import { signOut } from 'next-auth/react';
import { useAuth, useRedirectLogin, useModal } from '../hooks';
import { useAuthError } from '../hooks/useAuthError';

import { Sidebar } from './Sidebar';
import { SignInModal } from './SignInModal';

export const Layout = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  useAuthError();
  useRedirectLogin();

  const { onOpen, ...disclosure } = useModal();

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
        signOut={(): Promise<void> =>
          signOut({
            callbackUrl: '/',
          })
        }
      />
      <Flex>
        <Sidebar />
        <Container padding={8} maxW={{ base: 'auto', md: 'calc(100% - 8rem)' }}>
          {children}
        </Container>
      </Flex>
    </Box>
  );
};
