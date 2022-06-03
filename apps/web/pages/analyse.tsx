import { useMemo, useState } from 'react';
import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Link,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Field, Form } from 'react-final-form';

import { Smell } from '@codebarker/domain';
import { Button } from '@codebarker/components';

import { Layout } from '../components/Layout';
import { useAuth } from '../hooks';
import { GithubRepositoryUrlParser } from '../parsers/GithubRepositoryUrlParser';
import { getFileContentFromGithub } from './api/getFileContentFromGithub';
import { LabeledInput, LabeledSelect, LabeledTextArea } from '../components';
import { CamelCaseUtil } from '../utils/CamelCaseUtil';
import { Option } from '../types';

const smells = Object.entries(Smell)
  .filter((e) => !isNaN(e[0] as any))
  .map((e) => ({ name: e[1], id: e[0] }));

const opts = smells.map((smell) => ({
  label: CamelCaseUtil.toReadableString(smell.name as string),
  value: smell.id,
}));

type SubmitValues = {
  codeSmell: Option;
  reason: string;
};

export function Analyse(): JSX.Element {
  useAuth({ required: true });
  const [isAnalysing, setIsAnalysing] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const { data, isLoading, isFetching } = useQuery(
    ['getFileContentFromGithub'],
    () =>
      getFileContentFromGithub({
        author: obj.author!,
        fileDir: obj.fileDir!,
        repositoryName: obj.repositoryName!,
      }),
    {
      enabled: isAnalysing,
    }
  );

  const obj = useMemo(() => {
    return GithubRepositoryUrlParser.parse(value);
  }, [value]);

  const code = useMemo(() => {
    if (!data) return [];

    return data.content.lines.map((line) => line.value).join('\n');
  }, [data]);

  function handleStart(): void {
    setIsAnalysing(true);
  }

  function handleSubmit(values: SubmitValues): void {
    console.log(values);
  }

  function handleGoBack(): void {
    setIsAnalysing(false);
  }

  const isLoaded = [!isLoading, !isFetching].every((v) => v);

  if (isAnalysing) {
    return (
      <Container maxW="1800px">
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
          >
            <Skeleton
              minH="500px"
              startColor="brand.panel"
              bgColor="brand.600"
              endColor="brand.600"
              fadeDuration={1}
              p={8}
              borderRadius={12}
              w="full"
              isLoaded={isLoaded}
            >
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
            </Skeleton>
          </Box>
          <Box
            mt={{ base: 8, lg: 0 }}
            bgColor="brand.600"
            borderRadius={12}
            flex={1}
            textColor="brand.text"
          >
            <Form
              initialValues={{
                codeSmell: '',
                reason: '',
              }}
              onSubmit={handleSubmit}
              render={(props): JSX.Element => (
                <VStack spacing={8} alignItems="start" flexDir="column" p={8}>
                  <Field name="codeSmell">
                    {(props): JSX.Element => (
                      <LabeledSelect
                        labelName="Code Smell"
                        opts={opts}
                        {...props.input}
                      />
                    )}
                  </Field>

                  <Field name="reason">
                    {(props): JSX.Element => (
                      <LabeledTextArea
                        labelName="Reason"
                        {...props.input}
                        _styles={{
                          h: '200px',
                          borderRadius: 'lg',
                        }}
                      />
                    )}
                  </Field>
                  <ButtonGroup>
                    <Button
                      variant="primary"
                      disabled={!Object.values(obj).every(Boolean)}
                      onClick={props.handleSubmit}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(): void => handleGoBack()}
                    >
                      Go Back
                    </Button>
                  </ButtonGroup>
                </VStack>
              )}
            />
          </Box>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl">
      <Flex
        bgColor="brand.600"
        borderRadius={12}
        flexDir={{ base: 'column', lg: 'row' }}
      >
        <VStack
          flex={4}
          p={10}
          color="brand.text"
          spacing={6}
          alignItems="start"
        >
          <VStack alignItems="start" spacing={2}>
            <Heading color="brand.text" fontSize={{ base: '3xl', lg: '5xl' }}>
              Fetch from Github
            </Heading>
            <Text
              opacity=".8"
              maxW="50ch"
              fontSize={{ base: 'xl', lg: '1xl' }}
              lineHeight="1.8"
            >
              Navigate to
              <Link
                href="https://github.com/explore"
                isExternal
                mx={2}
                color="brand.accent"
              >
                Github
                <ExternalLinkIcon ml={1} mb={1} />
              </Link>
              open a file you like, copy the full url and paste it in the field
              below.
            </Text>
          </VStack>
          <LabeledInput
            name="githubUrl"
            type="text"
            value={value}
            placeholder="https://github.com/{author}/{repository}/blob/{branch}/{file_location}"
            onChange={(e: any): void => setValue(e.target.value)}
            _styles={{
              px: 4,
              py: 6,
              maxW: '675px',
            }}
          />
          <ButtonGroup spacing={2}>
            <Button
              variant="primary"
              disabled={!Object.values(obj).every(Boolean)}
              onClick={(): void => handleStart()}
            >
              Fetch File
            </Button>
            {/* <Button variant="outline">Random</Button> */}
          </ButtonGroup>
        </VStack>
        <Flex
          flexDir="column"
          justifyContent="space-around"
          borderTopRightRadius={12}
          borderBottomRightRadius={12}
          flex={2}
          bgColor="brand.panel"
          p={8}
        >
          <VStack alignItems="start" spacing={0}>
            <Text fontWeight="bold" textColor="brand.accent" fontSize="lg">
              Author
            </Text>
            <Text
              fontWeight="bold"
              fontSize="xl"
              textColor="brand.accent"
              color="brand.text"
            >
              {obj.author ?? 'None'}
            </Text>
          </VStack>
          <VStack alignItems="start" spacing={0}>
            <Text fontWeight="bold" textColor="brand.accent" fontSize="lg">
              Repository
            </Text>
            <Text
              fontWeight="bold"
              fontSize="xl"
              textColor="brand.accent"
              color="brand.text"
            >
              {obj.repositoryName ?? 'None'}
            </Text>
          </VStack>
          <VStack alignItems="start" spacing={0}>
            <Text fontWeight="bold" textColor="brand.accent" fontSize="lg">
              File Location
            </Text>
            <Text
              fontWeight="bold"
              fontSize="xl"
              textColor="brand.accent"
              color="brand.text"
              wordBreak="break-word"
            >
              {obj.fileDir ?? 'None'}
            </Text>
          </VStack>
        </Flex>
      </Flex>
    </Container>
  );
}

Analyse.getLayout = (page: JSX.Element): JSX.Element => <Layout>{page}</Layout>;

export default Analyse;
