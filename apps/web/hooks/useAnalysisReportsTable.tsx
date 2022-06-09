import { useMemo, useState } from 'react';
import { Tag } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { Column } from 'react-table';

import { AnalysisStatus, Smell } from '@codebarker/domain';

import { getMyAnalysisReports } from '../pages/api/getMyAnalysisReports';
import { CamelCaseUtil, StatusColourPickerUtil } from '../utils';
import { useAuth } from './useAuth';

type AnalysisReportsTableData = {
  id: string;
  smellType: string;
  languageName: string;
  agreedVotesCount: number;
  disagreedVotesCount: number;
  percentage: string;
  status: string;
};

type Props = {
  isLoaded: boolean;
  hasMore: boolean;
  columns: Column<AnalysisReportsTableData>[];
  data: AnalysisReportsTableData[];
  currentPageIndex: number;
  pageCount: number;
  total: number;
  onPageChange: (prev?: boolean) => void;
  initialPageSize: number;
};

export function useAnalysisReportsTable(pageSize = 10): Props {
  const [offset, setOffset] = useState(0);

  const { isSignedIn, user } = useAuth({ required: false });
  const { data, isLoading } = useQuery(
    ['myAnalysis', offset],
    () =>
      getMyAnalysisReports({
        amount: pageSize,
        offset,
        userId: user!.id,
      }),
    {
      enabled: isSignedIn,
      keepPreviousData: true,
    }
  );

  const rows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.details.map<AnalysisReportsTableData>((item) => {
      const totalVotes = item.agreedVotesCount + item.disagreedVotesAcount;

      const hasVotes = totalVotes > 0;

      const percentageAgreedVotes = hasVotes
        ? (item.agreedVotesCount / totalVotes) * 100
        : 0;

      return {
        id: item.analysisId,
        agreedVotesCount: item.agreedVotesCount,
        disagreedVotesCount: item.disagreedVotesAcount,
        percentage: `${percentageAgreedVotes.toFixed(1)}%`,
        languageName: item.programmingLanguage.name,
        smellType: CamelCaseUtil.toReadableString(Smell[item.smell]),
        status: AnalysisStatus[item.status],
      };
    });
  }, [data]);

  const columns = useMemo<Column<AnalysisReportsTableData>[]>(
    () => [
      {
        Header: 'status',
        accessor: 'status',
        Cell: ({ value }): JSX.Element => (
          <Tag
            variant="subtle"
            bgColor={StatusColourPickerUtil.getColour(
              AnalysisStatus[value as any] as any
            )}
            color="white"
          >
            {value}
          </Tag>
        ),
      },
      {
        Header: 'smell',
        accessor: 'smellType',
      },
      {
        Header: 'langauge',
        accessor: 'languageName',
      },
      {
        Header: 'percentage',
        accessor: 'percentage',
      },
      {
        Header: 'agreed',
        accessor: 'agreedVotesCount',
      },
      {
        Header: 'disagreed',
        accessor: 'disagreedVotesCount',
      },
    ],
    []
  );

  const isLoaded = ![isLoading].some(Boolean);

  const pageCount = useMemo(() => {
    if (!data) return 0;

    return Math.ceil(data.count / pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function onPageChange(prev?: boolean): void {
    setOffset((curr) => (prev ? curr - 1 : curr + 1));
  }

  return {
    isLoaded,
    hasMore: Boolean(data?.hasMore),
    columns,
    data: rows,
    currentPageIndex: offset,
    pageCount,
    total: data?.count || 0,
    onPageChange,
    initialPageSize: pageSize,
  };
}
