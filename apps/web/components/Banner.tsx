import {
  Box,
  Heading,
  VStack,
  Text,
  ButtonGroup,
  FormHelperText,
  FormControl,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import { useAuth } from '../hooks';
import { getAllProgrammingLanguages } from '../pages/api/getAllProgrammingLanguages';
import { Option } from '../types';
import { ButtonLink } from './ButtonLink';
import { Select } from './Select';

export const Banner = (): JSX.Element => {
  const { isSignedIn } = useAuth({ required: false });
  const [selectedLanguages, setSelectedLanguages] = useState<Option[]>([]);
  const {
    data: langs,
    isLoading: isLoadingLanguages,
    isFetching,
  } = useQuery(
    ['getAllProgrammingLanguages'],
    () => getAllProgrammingLanguages(),
    {
      enabled: isSignedIn,
    }
  );

  const opts = useMemo(() => {
    if (!langs) return [];

    return langs.programmingLanguages.map((lang) => ({
      label: lang.name,
      value: lang.name,
    }));
  }, [langs]);

  const languagesQueryString = useMemo(() => {
    if (selectedLanguages.length === 0) return '';

    return (
      '?languages=' + selectedLanguages.map((lang) => lang.value).join(',')
    );
  }, [selectedLanguages]);

  return (
    <Box
      bgColor="brand.600"
      p={12}
      borderRadius="lg"
      flex={3}
      display="flex"
      flexDir="column"
      alignItems="start"
      justifyContent="center"
    >
      <VStack alignItems="start" maxW="70ch" spacing={5}>
        <Heading
          as="h1"
          textTransform="uppercase"
          fontSize={{ base: '3xl', lg: '4xl' }}
        >
          Start learning
        </Heading>
        <Text
          fontSize={{ base: 'xl', lg: '1xl' }}
          lineHeight="1.8"
          opacity={0.8}
        >
          Become a better developer by finding code smells in real source code
          and help authors avoid spaghetti.
        </Text>
        <Box mt={4} w="full" pb={2} display={isSignedIn ? 'block' : 'none'}>
          <FormControl>
            <Select
              isLoading={isLoadingLanguages || isFetching}
              name="languages"
              onChange={(e: any): void => setSelectedLanguages(e)}
              opts={opts}
              placeholder="Select languages (optional)"
              value={selectedLanguages}
              isMulti={true}
            />
            <FormHelperText>Leave it empty to get all languages</FormHelperText>
          </FormControl>
        </Box>
        <ButtonGroup>
          <ButtonLink href={`/learn${languagesQueryString}`}>
            Start Learning
          </ButtonLink>
          <ButtonLink
            variant="outline"
            href={`/investigate${languagesQueryString}`}
          >
            Investigate
          </ButtonLink>
        </ButtonGroup>
      </VStack>
    </Box>
  );
};
