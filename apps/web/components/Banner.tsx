import NextLink from 'next/link';
import {
  Box,
  Heading,
  VStack,
  Text,
  CircularProgress,
  Container,
  Link,
} from '@chakra-ui/react';

type Props = {
  progress: number;
};

// TODO: Add a popover where it explains that done means you will only get code smells
// that you have done before, perhaps a suggestion saying: "You can investigate new cases"
function getLinkText(progress: number): string {
  switch (progress) {
    case 0:
      return 'Start';
    case 100:
      return 'Done';
    default:
      return 'Continue';
  }
}

export const Banner = ({ progress }: Props): JSX.Element => {
  const linkTxt = getLinkText(progress);

  return (
    <Box bgColor="brand.600" boxShadow="card" borderRadius={16}>
      <Container
        display="flex"
        justifyContent="space-between"
        color="brand.text"
        width="full"
        p={10}
        alignItems="center"
        maxW="1400px"
        flexDir={{
          base: 'column',
          lg: 'row',
        }}
      >
        <VStack
          textAlign={{ base: 'center', lg: 'start' }}
          alignItems={{ base: 'center', lg: 'flex-start' }}
          maxW="70ch"
          spacing={4}
        >
          <Heading
            as="h1"
            textTransform="uppercase"
            fontSize={{ base: '3xl', lg: '5xl' }}
          >
            Start learning
          </Heading>
          <Text fontSize={{ base: 'xl', lg: '2xl' }} lineHeight="1.8">
            Become a better developer by finding code smells in real source code
            and help authors avoid spaghetti.
          </Text>
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
            <NextLink href="/learn" passHref>
              <Link
                fontSize="xl"
                variant="unstyled"
                position="absolute"
                left="50%"
                transform="translate(-50%, -50%)"
                textTransform="uppercase"
                top="50%"
                _hover={{
                  textDecor: 'none',
                  opacity: 0.8,
                }}
                fontWeight="bold"
              >
                {linkTxt}
              </Link>
            </NextLink>
          </CircularProgress>
        </Box>
      </Container>
    </Box>
  );
};
