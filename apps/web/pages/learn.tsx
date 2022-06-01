import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import {
  Link,
  Flex,
  Box,
  Container,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Checkbox,
  Heading,
  SimpleGrid,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  HStack,
  Skeleton,
} from '@chakra-ui/react';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { Smell } from '@codebarker/domain';
import { Button } from '@codebarker/components';

import { startKata } from './api/startKata';
import { __UserId } from '../container';

import { submitKata } from './api/submitKata';
import { Layout } from '../components/Layout';
import { CamelCaseUtil } from '../utils/CamelCaseUtil';
import useLocalStorage from '../hooks/useLocalStorage';

// TODO: Add E2E tests for excludeCompletedKatas
// TODO: Fix overflow caused by highlighter when too many lines
export const LearnPage = (): JSX.Element => {
  const [excludeFilter, setExcludeFilter] = useLocalStorage<boolean>(
    'codebarker-exclude-finished',
    true
  );
  const [previousKataId, setPreviousKataId] = useState<undefined | string>(
    undefined
  );
  const [lastChanged, setLastChanged] = useState(new Date());
  const client = useQueryClient();

  const [lastClicked, setLastClicked] = useState<number | null>(null);
  const { isLoading, data, isError } = useQuery(
    ['startKata', { lastChanged, previousKataId }],
    () =>
      startKata({
        userId: __UserId,
        excludeCompletedKatas: excludeFilter,
        previousKataId,
      })
  );

  const mutate = useMutation(submitKata, {
    onSuccess: (res) => {
      if (!res.isCorrect) return;

      setPreviousKataId(data!.id);
      client.invalidateQueries('startKata');
      setLastClicked(null);
    },
  });

  const code = useMemo(() => {
    if (!data) return [];

    return JSON.parse(data!.content)
      .map((item: any) => item.content)
      .join('\n');
  }, [data]);

  function onFilterChange(val: boolean): void {
    setExcludeFilter(val);
    setLastClicked(null);
    setLastChanged(new Date());
  }

  async function handleSelection(smell: Smell): Promise<void> {
    setLastClicked(null);

    await mutate.mutateAsync({
      userId: __UserId,
      kataId: data!.id,
      smell,
    });

    setLastClicked(smell);
  }

  const noAvailableKatas = !data || (data && isError);

  return (
    <Layout>
      <Container maxW="container.lg" w="100%">
        <Accordion
          allowToggle
          bgColor="brand.panel"
          color="brand.white"
          borderRadius={12}
          p={2}
          mb={6}
          w="100%"
        >
          <AccordionItem border="none">
            <Box>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading as="h1" fontSize="2xl" fontWeight="bold">
                    Your Filters
                  </Heading>
                  <Text>Configure the way smells are generated for you</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Box>
            <AccordionPanel pb={4}>
              <Divider my={2} borderColor="brand.white" height="2px" />
              <Box mt={4}>
                <Checkbox
                  isChecked={excludeFilter}
                  onChange={(e): void => onFilterChange(e.target.checked)}
                >
                  Exclude completed
                </Checkbox>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Skeleton
          startColor="brand.panel"
          bgColor="brand.600"
          endColor="brand.600"
          fadeDuration={1}
          p={8}
          borderRadius={12}
          w="full"
          isLoaded={!isLoading}
        >
          {noAvailableKatas && (
            <Alert
              status="info"
              variant="solid"
              bgColor="brand.600"
              color="brand.white"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                You have completed all smells
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  flexDir="column"
                >
                  <Text mb={4}>Keep practicing the ones you completed?</Text>
                  <HStack spacing={2} justifyContent="center" mt={2}>
                    <Button
                      onClick={(): void => onFilterChange(false)}
                      variant="primary"
                    >
                      Yes
                    </Button>
                    <NextLink href="/" passHref>
                      <Button as={Link} variant="outline">
                        Back to home
                      </Button>
                    </NextLink>
                  </HStack>
                </Flex>
              </AlertDescription>
            </Alert>
          )}
          {!noAvailableKatas && (
            <>
              <SyntaxHighlighter
                language="typescript"
                style={atomDark}
                customStyle={{
                  background: '#1C1A31',
                }}
                showLineNumbers={true}
              >
                {code}
              </SyntaxHighlighter>
              <Divider my={8} borderColor="brand.border" height="2px" />
              <SimpleGrid minChildWidth="200px" py={2} gap={4}>
                {data.options.map((opt) => (
                  <Button
                    variant="secondary"
                    fontWeight="bold"
                    bgColor={
                      !mutate.data?.isCorrect && lastClicked === opt
                        ? 'red.500'
                        : 'brand.400'
                    }
                    disabled={mutate.isLoading}
                    key={opt}
                    onClick={(): Promise<void> => handleSelection(opt)}
                  >
                    {CamelCaseUtil.toReadableString(Smell[opt])}
                  </Button>
                ))}
              </SimpleGrid>
            </>
          )}
        </Skeleton>
      </Container>
    </Layout>
  );
};

// LearnPage.getLayout = (page: JSX.Element): JSX.Element => (
//   <Layout>{page}</Layout>
// );

export default dynamic(() => Promise.resolve(LearnPage), {
  ssr: false,
});
