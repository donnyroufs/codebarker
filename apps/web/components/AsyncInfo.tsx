import { Heading, VStack, Text, Skeleton } from '@chakra-ui/react';

type Props = {
  title?: string;
  body?: string;
  isLoaded: boolean;
};

export const AsyncInfo = ({ title, body, isLoaded }: Props): JSX.Element => (
  <VStack alignItems="flex-start" spacing={2}>
    <Skeleton
      isLoaded={isLoaded}
      borderRadius="full"
      startColor="brand.panel"
      endColor="brand.headerShade"
      minW="12ch"
    >
      <Heading as="h2" fontSize="lg">
        {title}
      </Heading>
    </Skeleton>

    <Skeleton
      minH="14px"
      minW="8ch"
      isLoaded={isLoaded}
      borderRadius="full"
      startColor="brand.panel"
      endColor="brand.headerShade"
    >
      <Text opacity={0.8}>{body}</Text>
    </Skeleton>
  </VStack>
);
