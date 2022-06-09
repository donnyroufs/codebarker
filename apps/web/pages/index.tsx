import { Box } from '@chakra-ui/react';

import { Banner, Table } from '../components';
import { Layout } from '../components/Layout';
import { useAnalysisReportsTable } from '../hooks';

export function Index(): JSX.Element {
  const tableProps = useAnalysisReportsTable();
  const progress = 38;

  return (
    <Box>
      <Banner progress={progress} />
      <Table {...tableProps} />
    </Box>
  );
}

Index.getLayout = (page: JSX.Element): JSX.Element => <Layout>{page}</Layout>;

export default Index;
