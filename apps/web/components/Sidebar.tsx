import { Box } from '@chakra-ui/react';
import { Navigation } from './Navigation';

export const Sidebar = (): JSX.Element => {
  return (
    <Box
      width="100px"
      bgColor="brand.600"
      height="calc(100vh - 8rem)"
      borderRight="2px solid #2F2F4C"
      display={{ base: 'none', md: 'block' }}
    >
      <Box mt={8}>
        <Navigation />
      </Box>
    </Box>
  );
};
