import { Text, Box, Container, Heading, Flex, Divider } from '@chakra-ui/react';

import { Banner, Link, Table } from '../components';
import { Layout } from '../components/Layout';
import { useAnalysisReportsTable } from '../hooks';

export function Index(): JSX.Element {
  const tableProps = useAnalysisReportsTable();

  return (
    <Container
      borderRadius={16}
      boxShadow="card"
      display="flex"
      justifyContent="space-between"
      color="brand.text"
      width="full"
      alignItems="start"
      maxW="1800px"
      flexDir={{
        base: 'column',
        lg: 'column',
      }}
    >
      <Flex flexDir={{ base: 'column', xl: 'row' }} w="full">
        <Banner />
        <Box
          display="flex"
          flexDir="column"
          bgColor="brand.600"
          borderRadius={12}
          ml={{ base: 0, xl: 5 }}
          mt={{ base: 4, xl: 0 }}
          p={10}
          flex={2}
          w="full"
        >
          <Heading mb={4}>About Codebarker</Heading>
          <Text lineHeight={1.7} opacity={0.8} fontSize="lg">
            Codebarker uses real snippets from Github, submitted by community
            members to fill its content. Users can learn from approved code
            smells, submit a code smell or report a code smell.
          </Text>
          <Text lineHeight={1.7} opacity={0.8} fontSize="lg" mt={4}>
            A reported code smell needs to be{' '}
            <Link
              href="/investigate"
              _styles={{ mr: 2, textDecor: 'underline', color: 'brand.accent' }}
            >
              investigated
            </Link>
            by at least 10 community members in order to be added to the
            approved code smells list.
          </Text>
          <Box as="footer" mt="auto" opacity={0.6}>
            <Divider my={8} borderColor="brand.border" height="2px" />
            <Text lineHeight={1.7} opacity={0.8} fontSize="lg" mt="auto">
              The app is still a work in progress and a roadmap will be added
              soon!
            </Text>
          </Box>
        </Box>
      </Flex>
      <Table {...tableProps} />
    </Container>
  );
}

Index.getLayout = (page: JSX.Element): JSX.Element => <Layout>{page}</Layout>;

export default Index;
