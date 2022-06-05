import {
  Box,
  Heading,
  VStack,
  Text,
  CircularProgress,
  Container,
  CircularProgressLabel,
  ButtonGroup,
  FormHelperText,
  FormControl,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import { getAllProgrammingLanguages } from '../pages/api/getAllProgrammingLanguages';
import { Option } from '../types';
import { ButtonLink } from './ButtonLink';
import { LabeledSelect } from './LabeledSelect';

type Props = {
  progress: number;
};

export const Banner = ({ progress }: Props): JSX.Element => {
  const [selectedLanguages, setSelectedLanguages] = useState<Option[]>([]);
  const { data: langs } = useQuery(['getAllProgrammingLanguages'], () =>
    getAllProgrammingLanguages()
  );

  const opts = useMemo(() => {
    if (!langs) return [];

    return langs.programmingLanguages.map((lang) => ({
      label: lang.name,
      value: lang.name,
    }));
  }, [langs]);

  const languagesQueryString = useMemo(() => {
    if (selectedLanguages.length === 0) return 'all';

    return selectedLanguages.map((lang) => lang.value).join(',');
  }, [selectedLanguages]);

  return (
    <Box>
      <Container
        borderRadius={16}
        boxShadow="card"
        bgColor="brand.600"
        display="flex"
        justifyContent="space-between"
        color="brand.text"
        width="full"
        p={10}
        alignItems="center"
        maxW="container.xl"
        flexDir={{
          base: 'column',
          lg: 'row',
        }}
      >
        <VStack
          textAlign={{ base: 'center', lg: 'start' }}
          alignItems={{ base: 'center', lg: 'flex-start' }}
          maxW="70ch"
          spacing={5}
        >
          <Heading
            as="h1"
            textTransform="uppercase"
            fontSize={{ base: '3xl', lg: '5xl' }}
          >
            Start learning
          </Heading>
          <Text fontSize={{ base: 'xl', lg: '1xl' }} lineHeight="1.8">
            Become a better developer by finding code smells in real source code
            and help authors avoid spaghetti.
          </Text>
          <Box mt={4} w="full" pb={2}>
            <FormControl>
              <LabeledSelect
                labelName="Languages"
                name="languages"
                onChange={(e: any): void => setSelectedLanguages(e)}
                opts={opts}
                placeholder="Select languages (optional)"
                value={selectedLanguages}
                isMulti={true}
              />
              <FormHelperText>
                Leave it empty to get all languages
              </FormHelperText>
            </FormControl>
          </Box>
          <ButtonGroup>
            <ButtonLink href={`/learn?languages=${languagesQueryString}`}>
              Start Learning
            </ButtonLink>
            {/* <ButtonLink variant="outline" href="/investigate">
              Investigate
            </ButtonLink> */}
          </ButtonGroup>
        </VStack>

        <Box mt={{ base: 6, lg: 0 }}>
          <CircularProgress
            value={progress}
            size="250px"
            thickness={2}
            position="relative"
            color="brand.accent"
            trackColor="brand.400"
          >
            <CircularProgressLabel>{progress}%</CircularProgressLabel>
          </CircularProgress>
        </Box>
      </Container>
    </Box>
  );
};
