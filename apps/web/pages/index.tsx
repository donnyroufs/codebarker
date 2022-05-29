import { Box, Container, Flex, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query';

import { Header } from '@codebarker/components';

import { Banner } from '../components';
import { Sidebar } from '../components/Sidebar';
import { startKata } from './api/startKata';
import { __UserId } from '../container';

export function Index(): JSX.Element {
  const { isLoading, data } = useQuery('startKata', () =>
    startKata({ userId: __UserId, excludeCompletedKatas: false })
  );

  const progress = 38;

  if (isLoading) {
    return <Spinner color="brand.accent" />;
  }

  return (
    <Box>
      <Header name="Donny R." />
      <Flex>
        <Sidebar />
        <Container maxW="100%" padding={8}>
          <Banner progress={progress} />
          <Text color="brand.white">{JSON.stringify(data, null, 2)}</Text>
        </Container>
      </Flex>
    </Box>
  );
}

export default Index;
