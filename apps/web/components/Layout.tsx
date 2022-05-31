import { Box, Flex, Container } from '@chakra-ui/react';

import { Header } from '@codebarker/components';

import { Sidebar } from './Sidebar';

export const Layout = ({ children }): JSX.Element => {
  return (
    <Box>
      <Header name="Donny R." />
      <Flex>
        <Sidebar />
        <Container maxW="100%" padding={8}>
          {children}
        </Container>
      </Flex>
    </Box>
  );
};
