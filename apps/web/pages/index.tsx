import { Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import { Banner } from '../components';
import { Layout } from '../components/Layout';

export function Index(): JSX.Element {
  const session = useSession();
  const progress = 38;
  console.log(session);

  return (
    <Box>
      <Banner progress={progress} />
    </Box>
  );
}

Index.getLayout = (page: JSX.Element): JSX.Element => <Layout>{page}</Layout>;

export default Index;
