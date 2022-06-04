import { Box } from '@chakra-ui/react';

export const Required = (): JSX.Element => (
  <Box as="span" color="red.300" ml={2} fontWeight="bold" fontSize="xl">
    *
  </Box>
);
