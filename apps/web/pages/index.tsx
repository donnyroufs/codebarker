import { Box, Container, Flex } from '@chakra-ui/react';

import { Header } from '@codebarker/components';
import { Banner } from '../components';
import { Sidebar } from '../components/Sidebar';

export function Index(): JSX.Element {
  const progress = 38;

  return (
    <Box>
      <Header name="Donny R." />
      <Flex>
        <Sidebar />
        <Container maxW="100%" padding={8}>
          <Banner progress={progress} />
        </Container>
      </Flex>
    </Box>
  );
}

export default Index;
