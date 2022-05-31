import { Box } from '@chakra-ui/react';

import { Banner } from '../components';
import { Layout } from '../components/Layout';

export function Index(): JSX.Element {
  const progress = 38;

  return (
    <Box>
      <Banner progress={progress} />
    </Box>
  );
}

Index.getLayout = (page: JSX.Element): JSX.Element => <Layout>{page}</Layout>;

export default Index;
