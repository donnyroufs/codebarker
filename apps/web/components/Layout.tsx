import { Box, Flex, Container, useDisclosure } from '@chakra-ui/react';

import { Header } from '@codebarker/components';
import { signOut, useSession } from 'next-auth/react';

import { Sidebar } from './Sidebar';
import { SignInModal } from './SignInModal';

export const Layout = ({ children }): JSX.Element => {
  const { onOpen, ...disclosure } = useDisclosure();
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';

  return (
    <Box>
      <SignInModal {...disclosure} />
      <Header
        name={session?.user?.name}
        onOpen={onOpen}
        isLoading={isLoading}
        avatarUrl={session?.user?.image}
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
