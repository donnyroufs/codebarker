import {
  Text,
  Box,
  Divider,
  Skeleton,
  VStack,
  Heading,
  ButtonGroup,
  Container,
  Flex,
  Progress,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useMutation, useQuery } from 'react-query';

import { Button } from '@codebarker/components';
import { AnalysisType, Smell } from '@codebarker/domain';

import { AsyncInfo, CodeHighlighter, Layout } from '../components';
import { useAuth, useLanguagesQueryString } from '../hooks';
import { CamelCaseUtil } from '../utils/CamelCaseUtil';
import { getAnalysisDetails } from './api/getAnalysisDetails';
import { voteOnAnalysis } from './api/voteOnAnalysis';

const Investigate = (): JSX.Element => {
  const { user, isSignedIn } = useAuth({ required: true });
  const { languages, clearQueryString } = useLanguagesQueryString();

  const { data, isLoading, isFetching, remove } = useQuery(
    ['getAnalysisDetails', languages],
    () =>
      getAnalysisDetails({
        languages,
        userId: user!.id,
      }),
    {
      enabled: isSignedIn,
      cacheTime: 0,
    }
  );

  const mutate = useMutation(voteOnAnalysis, {
    onSettled: () => {
      remove();
    },
  });

  const code = useMemo(() => {
    if (!data) return '';

    return data.content.lines.map((line) => line.value).join('\n');
  }, [data]);

  const highlightedLines = useMemo(() => {
    if (!data) return [];

    return data.content.lines
      .filter((line) => line.isInfected)
      .map((line) => line.lineNumber);
  }, [data]);

  const isLoaded = ![isLoading, isFetching].every(Boolean);
  const totalVotes = useMemo(() => {
    if (!data) return 0;

    return data.agreedVotesCount + data.disagreedVotesAcount;
  }, [data]);

  const codeSmell = useMemo(() => {
    if (!data) return undefined;

    return CamelCaseUtil.toReadableString(Smell[data!.smell]);
  }, [data]);

  function handleVote(type: AnalysisType): void {
    mutate.mutate({
      id: data!.analysisId,
      type,
      userId: user!.id,
    });
  }

  function onRemoveLanguageFilters(): void {
    clearQueryString();
  }

  const hasLanguageFilters = languages.length > 0 && languages.at(0) !== 'all';

  return (
    <Container maxW="1700px">
      <Flex
        borderRadius={12}
        flexDir={{ base: 'column', lg: 'row' }}
        columnGap={8}
      >
        <Box
          borderRadius={12}
          bgColor="brand.600"
          minW="60%"
          maxW={{ base: '100%', lg: '60%' }}
          h="full"
        >
          <Skeleton
            minH="610px"
            startColor="brand.panel"
            bgColor="brand.600"
            endColor="brand.600"
            fadeDuration={1}
            p={4}
            borderRadius={12}
            w="full"
            isLoaded={isLoaded}
          >
            {data && (
              <>
                <Box w="full" display="flex" justifyContent="start" pt={1}>
                  <Text
                    color="brand.text"
                    display="inline-flex"
                    textTransform="lowercase"
                    px={4}
                    borderRadius="xl"
                    fontWeight="bold"
                  >
                    {data?.content?.programmingLanguage?.name}{' '}
                  </Text>
                </Box>
                <Divider my={4} borderColor="brand.border" height="2px" />
              </>
            )}
            {!data && isLoaded && (
              <Box display="grid" placeItems="center" h="full" mt={4}>
                <Text color="brand.text" opacity={0.8}>
                  There are currently no reports for you to investigate,
                </Text>
                <Text color="brand.text" opacity={0.8}>
                  Please come back at a later time.
                </Text>
                {hasLanguageFilters && (
                  <Box
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    mt={4}
                  >
                    <Button
                      variant="secondary"
                      onClick={onRemoveLanguageFilters}
                    >
                      Remove language filters
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            {data && (
              <CodeHighlighter
                code={code}
                language={data.content.programmingLanguage.name}
                selectedLines={highlightedLines}
                highlightSelectedLines={true}
              />
            )}
          </Skeleton>
        </Box>
        <Box
          mt={{ base: 8, lg: 0 }}
          bgColor="brand.600"
          borderRadius={12}
          flex={1}
          textColor="brand.text"
          p={8}
          height="fit-content"
        >
          <VStack as="header" spacing={2} alignItems="start" mb={6} w="full">
            <Heading>Analysis Report</Heading>
            <Text opacity={0.8} maxW="45ch">
              Someone reported this as a smell. Its on you to determine whether
              that's the case.
            </Text>
          </VStack>
          <Divider my={4} borderColor="brand.border" height="2px" />

          <VStack spacing={8} alignItems="start" py={2}>
            <AsyncInfo
              isLoaded={isLoaded}
              title="Code Smell"
              body={codeSmell ?? 'None'}
            />
            <AsyncInfo
              isLoaded={isLoaded}
              title="Reported By"
              body={data?.reportedBy.name ?? 'None'}
            />
            <AsyncInfo
              isLoaded={isLoaded}
              title="Reason"
              body={
                (data?.reason !== undefined && data.reason.length === 0) ||
                !data?.reason
                  ? 'None'
                  : data?.reason
              }
            />
            <Skeleton
              isLoaded={isLoaded}
              borderRadius="lg"
              startColor="brand.panel"
              endColor="brand.headerShade"
              maxH="60px"
              w="full"
            >
              <Box
                bgColor="brand.700"
                w="full"
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor="brand.border"
              >
                <Text color="brand.text">
                  {!data && 'There is no analysis report to be reviewed'}
                  {data &&
                    totalVotes === 0 &&
                    'Be the first to vote on this report.'}
                  {data && totalVotes > 0 && (
                    <>
                      {data?.agreedVotesCount} out of {totalVotes} agreed with
                      this report.
                    </>
                  )}
                </Text>
              </Box>
            </Skeleton>
            <ButtonGroup spacing={4}>
              <Button
                isLoading={
                  mutate.isLoading &&
                  mutate.variables?.type === AnalysisType.Agree
                }
                isDisabled={!isLoaded || !data}
                variant="primary"
                onClick={(): void => handleVote(AnalysisType.Agree)}
              >
                Agree
              </Button>
              <Button
                isLoading={
                  mutate.isLoading &&
                  mutate.variables?.type === AnalysisType.Disagree
                }
                isDisabled={!isLoaded || !data}
                variant="outline"
                onClick={(): void => handleVote(AnalysisType.Disagree)}
              >
                Disagree
              </Button>
            </ButtonGroup>
          </VStack>
        </Box>
      </Flex>
    </Container>
  );
};

Investigate.getLayout = (page: JSX.Element): JSX.Element => (
  <Layout>{page}</Layout>
);

export default Investigate;
