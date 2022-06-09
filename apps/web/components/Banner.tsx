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
      p={{ base: 8, lg: 10 }}
      borderRadius="lg"
      flex={3}
      display="flex"
      flexDir="column"
      alignItems="start"
      justifyContent="center"
    >
      <VStack alignItems="start" maxW="70ch" spacing={6}>
        <Box>
          <Heading as="h1" fontSize={{ base: '3xl', lg: '4xl' }} mb={4}>
            Start Learning
          </Heading>
          <Text fontSize="lg" lineHeight="1.8" opacity={0.8}>
            Become a better developer by finding code smells in real source code
            and help authors avoid spaghetti.
          </Text>
        </Box>
        <Box mt={4} w="full" pb={2} display={isSignedIn ? 'block' : 'none'}>
          <FormControl mb={2}>
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
        <ButtonGroup
          flexDir={{ base: 'column', md: 'row' }}
          w="100%"
          spacing={{ base: 0, md: 4 }}
        >
          <ButtonLink
            href={`/learn${languagesQueryString}`}
            _style={{
              width: '100%',
              mb: {
                base: 4,
                md: 0,
              },
            }}
          >
            Start Learning
          </ButtonLink>
          <ButtonLink
            _style={{
              width: '100%',
            }}
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
