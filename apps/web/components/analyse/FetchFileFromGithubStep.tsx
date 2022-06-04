import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Container,
  Flex,
  Heading,
  VStack,
  Text,
  Link,
  ButtonGroup,
} from '@chakra-ui/react';

import { Button } from '@codebarker/components';

import { ParsedGithubUrl } from '../../parsers/GithubRepositoryUrlParser';
import { LabeledInput } from '../LabeledInput';

type Props = {
  urlValue: string;
  handleStart(): void;
  setUrlValue(value: string): void;
  parsedGithubUrl: ParsedGithubUrl;
};

export const FetchFileFromGithubStep = ({
  urlValue,
  handleStart,
  setUrlValue,
  parsedGithubUrl,
}: Props): JSX.Element => (
  <Container maxW="container.xl">
    <Flex
      bgColor="brand.600"
      borderRadius={12}
      flexDir={{ base: 'column', lg: 'row' }}
    >
      <VStack flex={4} p={12} color="brand.text" spacing={6} alignItems="start">
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
          value={urlValue}
          placeholder="https://github.com/{author}/{repository}/blob/{branch}/{file_location}"
          onChange={(e: any): void => setUrlValue(e.target.value)}
          _styles={{
            px: 4,
            py: 6,
            maxW: '675px',
          }}
        />
        <ButtonGroup spacing={2}>
          <Button
            variant="primary"
            disabled={!Object.values(parsedGithubUrl).every(Boolean)}
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
            {parsedGithubUrl.author ?? 'None'}
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
            {parsedGithubUrl.repositoryName ?? 'None'}
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
            {parsedGithubUrl.fileDir ?? 'None'}
          </Text>
        </VStack>
        <VStack alignItems="start" spacing={0}>
          <Text fontWeight="bold" textColor="brand.accent" fontSize="lg">
            Branch
          </Text>
          <Text
            fontWeight="bold"
            fontSize="xl"
            textColor="brand.accent"
            color="brand.text"
            wordBreak="break-word"
          >
            {parsedGithubUrl.sha ?? 'None'}
          </Text>
        </VStack>
      </Flex>
    </Flex>
  </Container>
);
