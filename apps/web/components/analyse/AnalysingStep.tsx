import { useMemo } from 'react';
import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ValidationErrors } from 'final-form';
import { Field, Form } from 'react-final-form';
import { useMutation } from 'react-query';
import { startCase } from 'lodash';

import { Smell } from '@codebarker/domain';
import { GetFileContentFromGithubResponse } from '@codebarker/application';
import { Button } from '@codebarker/components';
import { ParsedGithubUrl } from '@codebarker/shared';

import { InteractiveCodeHighlighter } from '../codeHighLighter';
import { LabeledSelect } from '../LabeledSelect';
import { LabeledTextArea } from '../LabeledTextarea';
import { CamelCaseUtil } from '../../utils/CamelCaseUtil';
import { Option } from '../../types';
import { UseAuthReturnValue } from '../../hooks';
import { submitAnalysis } from '../../pages/api/submitAnalysis';

type SubmitValues = {
  codeSmell: Option;
  reason: string;
};

// TODO: Get from endpoint
const smells = Object.entries(Smell)
  .filter((e) => !isNaN(e[0] as any))
  .map((e) => ({ name: e[1], id: e[0] }));

const opts = smells.map((smell) => ({
  label: CamelCaseUtil.toReadableString(smell.name as string),
  value: smell.id,
}));

type Props = {
  isLoaded: boolean;
  parsedGithubUrl: ParsedGithubUrl;
  handleGoBack(): void;
  user: UseAuthReturnValue['user'];
  onSuccess(): void;
  infectedLineNumbersError: boolean;
  setInfectedLineNumbersError: React.Dispatch<React.SetStateAction<boolean>>;
  infectedLineNumbers: number[];
  setInfectedLineNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  data: GetFileContentFromGithubResponse | undefined;
};

export const AnalysingStep = ({
  isLoaded,
  parsedGithubUrl,
  handleGoBack,
  onSuccess,
  infectedLineNumbers,
  infectedLineNumbersError,
  setInfectedLineNumbers,
  setInfectedLineNumbersError,
  user,
  data,
}: Props): JSX.Element => {
  const mutate = useMutation(submitAnalysis, {
    onSuccess: (): void => {
      onSuccess();
    },
  });
  function handleSubmit(values: SubmitValues): void {
    if (infectedLineNumbers.length === 0) {
      setInfectedLineNumbersError(true);
      return;
    }

    mutate.mutate({
      author: parsedGithubUrl.author!,
      content: {
        lines: data!.content.lines.map((line) =>
          infectedLineNumbers.includes(line.lineNumber)
            ? { ...line, isInfected: true }
            : line
        ),
        programmingLanguage: {
          extension: 'ts',
          name: 'typescript',
        },
      },
      fileDir: parsedGithubUrl.fileDir!,
      reason: values.reason,
      repositoryName: parsedGithubUrl.repositoryName!,
      smell: +values.codeSmell.value,
      userId: user!.id,
      sha: parsedGithubUrl.sha,
    });
  }

  const code = useMemo(() => {
    if (!data) return '';

    return data.content.lines.map((line) => line.value).join('\n');
  }, [data]);

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
            <Box w="full" display="flex" justifyContent="end" py={2} pb={4}>
              <Text
                color="brand.accent"
                display="inline-flex"
                borderRadius="xl"
                fontWeight="bold"
              >
                {startCase(data?.content?.programmingLanguage?.name)}{' '}
              </Text>
            </Box>
            <InteractiveCodeHighlighter
              setSelectedLines={setInfectedLineNumbers}
              selectedLines={infectedLineNumbers}
              language={data?.content.programmingLanguage?.name ?? 'typescript'}
              code={code}
            />
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
          <VStack as="header" spacing={2} alignItems="start" mb={8}>
            <Heading>Your Analysis</Heading>
            <Text opacity={0.8} maxW="45ch">
              Mark the lines on the left that are infected by clicking the left
              mouse button on any line.{' '}
            </Text>
          </VStack>
          <Form
            validate={(values): ValidationErrors => {
              const codeSmellIsDefined = values.codeSmell.value !== undefined;

              return {
                codeSmell: codeSmellIsDefined ? undefined : 'Required',
              };
            }}
            initialValues={{
              codeSmell: '',
              reason: '',
            }}
            onSubmit={handleSubmit}
            render={(props): JSX.Element => (
              <VStack spacing={8} alignItems="start" flexDir="column">
                <Field name="codeSmell">
                  {(props): JSX.Element => (
                    <LabeledSelect
                      isRequired={true}
                      labelName="Code Smell"
                      isInvalid={props.meta.touched && props.meta.error}
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
                <Box
                  bgColor="brand.700"
                  w="full"
                  p={4}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={
                    infectedLineNumbersError ? 'red.600' : 'brand.border'
                  }
                >
                  <Text
                    color={
                      infectedLineNumbers.length > 0
                        ? 'green.200'
                        : 'brand.text'
                    }
                  >
                    {infectedLineNumbers.length} out of the{' '}
                    {data?.content.lines.length ?? 0} lines are infected.
                  </Text>
                </Box>
                <ButtonGroup>
                  <Button
                    variant="primary"
                    disabled={
                      !Object.values(parsedGithubUrl).every(Boolean) ||
                      mutate.isLoading
                    }
                    onClick={props.handleSubmit}
                    isLoading={mutate.isLoading}
                  >
                    Submit
                  </Button>
                  <Button
                    disabled={mutate.isLoading}
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
};
