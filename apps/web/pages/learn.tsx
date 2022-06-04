import { useState, useMemo, useEffect } from 'react';
import {
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
  Spinner,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { Smell } from '@codebarker/domain';
import { Button } from '@codebarker/components';

import { startKata } from './api/startKata';

import { submitKata } from './api/submitKata';
import { Layout } from '../components/Layout';
import { CamelCaseUtil } from '../utils/CamelCaseUtil';
import { ButtonLink, CodeHighlighter } from '../components';
import {
  useAuth,
  LocalStorageItem,
  useLocalStorage,
  useIsFirstRender,
} from '../hooks';

export const LearnPage = (): JSX.Element => {
  const client = useQueryClient();
  const isFirstRender = useIsFirstRender();
  const [excludeFilter, setExcludeFilter] = useLocalStorage(
    LocalStorageItem.ExcludeFilter,
    true
  );
  const [previousKataId, setPreviousKataId] = useState<undefined | string>(
    undefined
  );
  const { user, isSignedIn } = useAuth();

  const [lastClicked, setLastClicked] = useState<number | null>(null);
  const { isLoading, data, isError, isFetching } = useQuery(
    ['startKata', previousKataId, excludeFilter],
    () =>
      startKata({
        userId: user!.id,
        excludeCompletedKatas: excludeFilter,
        previousKataId,
      }),
    {
      enabled: isSignedIn,
    }
  );

  useEffect(() => {
    return () => {
      // Might become an issue later on since I'm not invalidating the exact query
      client.clear();
    };
  }, [client]);

  const mutate = useMutation(submitKata, {
    onSuccess: (res) => {
      if (!res.isCorrect) return;

      setPreviousKataId(data!.id);
      setLastClicked(null);
    },
  });

  const code = useMemo(() => {
    if (!data) return '';

    return data.content.lines.map((line) => line.value).join('\n');
  }, [data]);

  function onFilterChange(val: boolean): void {
    setExcludeFilter(val);
    setLastClicked(null);
  }

  async function handleSelection(smell: Smell): Promise<void> {
    setLastClicked(null);

    await mutate.mutateAsync({
      userId: user!.id,
      kataId: data!.id,
      smell,
    });

    setLastClicked(smell);
  }

  const noAvailableKatas = !data || (data && isError);

  const isLoaded = [!isLoading, !isFetching].every((v) => v);

  console.log(data);
  return (
    <Container maxW="container.lg" w="100%">
      <Accordion
        allowToggle
        bgColor="brand.panel"
        color="brand.text"
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
            <Divider my={2} borderColor="brand.text" height="2px" />
            <Box mt={4}>
              {!isFirstRender && (
                <Checkbox
                  isChecked={excludeFilter}
                  onChange={(e): void => onFilterChange(e.target.checked)}
                >
                  Exclude completed
                </Checkbox>
              )}
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
        isLoaded={isLoaded}
      >
        {noAvailableKatas && (
          <Alert
            status="info"
            variant="solid"
            bgColor="brand.600"
            color="brand.text"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            minH="200px"
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
                  <ButtonLink href="/" variant="outline">
                    Back to home
                  </ButtonLink>
                </HStack>
              </Flex>
            </AlertDescription>
          </Alert>
        )}
        {!noAvailableKatas && (
          <>
            <Box pos="relative">
              {mutate.isLoading && (
                <Spinner
                  pos="absolute"
                  top={-2}
                  right={4}
                  color="brand.accent"
                  thickness="3px"
                />
              )}
              <CodeHighlighter
                language={data?.content.programmingLanguage.name}
                code={code}
              />
            </Box>
            <Divider my={8} borderColor="brand.border" height="2px" />
            <SimpleGrid minChildWidth="200px" py={2} gap={4}>
              {data.options.map((opt) => (
                <Button
                  variant="secondary"
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
  );
};

LearnPage.getLayout = (page: JSX.Element): JSX.Element => (
  <Layout>{page}</Layout>
);

export default LearnPage;
