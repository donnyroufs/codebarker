import {
  Column,
  useFlexLayout,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import React, { useMemo } from 'react';
import {
  Box,
  Center,
  Flex,
  IconButton,
  Skeleton,
  Spacer,
  Stack,
  Table as ChakraTable,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  CgChevronDown,
  CgChevronLeft,
  CgChevronRight,
  CgChevronUp,
} from 'react-icons/cg';

import { PluralizeUtil } from '../utils';

type ChakraReactTableProps = {
  columns: Array<Column<any>>;
  data: Array<any>;
  rowCursor?: string;
  handleOnRowClick?: (row: Record<string, unknown>) => void;
  initialStateSortBy?: Array<{ id: string; desc: boolean }>;
  onPageChange(prev?: boolean): void;
  currentPageIndex: number;
  initialPageSize: number;
  isLoaded: boolean;
  pageCount: number;
  hasMore: boolean;
  total: number;
};

export const Table = ({
  columns,
  data,
  rowCursor = undefined,
  handleOnRowClick = undefined,
  initialStateSortBy = [],
  onPageChange,
  initialPageSize,
  currentPageIndex,
  pageCount,
  isLoaded,
  hasMore,
  total,
}: ChakraReactTableProps): JSX.Element => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    pageOptions,
    nextPage,
    previousPage,
    rows,
  } = useTable(
    {
      columns,
      data,
      pageCount,
      initialState: {
        pageSize: initialPageSize,
        sortBy: initialStateSortBy,
      },
      manualPagination: true,
    },
    useFlexLayout,
    useSortBy,
    usePagination
  );

  function setNextPage(): void {
    nextPage();
    onPageChange(false);
  }

  function setPrevPage(): void {
    previousPage();
    onPageChange(true);
  }

  const canNextPage = useMemo(() => {
    return hasMore;
  }, [hasMore]);

  const canPrevPage = useMemo(() => {
    // todo: add check if we have data
    return currentPageIndex !== 0;
  }, [currentPageIndex]);

  return (
    <Stack
      color="brand.text"
      bgColor="brand.600"
      borderRadius="lg"
      maxW="container.xl"
      margin="auto"
      p={9}
      mt={4}
      overflowX="auto"
    >
      <Skeleton
        isLoaded={isLoaded}
        borderRadius="md"
        startColor="brand.panel"
        endColor="brand.headerShade"
      >
        <ChakraTable
          {...getTableProps()}
          size="md"
          variant="unstyled"
          bgColor="brand.700"
          color="brand.text"
          border="1px solid"
          borderColor="brand.border"
        >
          <Thead bgColor="brand.600" w="100%" margin={0}>
            {headerGroups.map((headerGroup, index) => (
              <Tr
                {...headerGroup.getHeaderGroupProps()}
                key={`headerGroup${index}`}
              >
                {headerGroup.headers.map((column) => (
                  <Th pt={6} key={`column${column.id}`} flex={1}>
                    <Flex
                      align="center"
                      gridGap={2}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render('Header')}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <CgChevronDown />
                        ) : (
                          <CgChevronUp />
                        )
                      ) : (
                        ''
                      )}
                    </Flex>
                    <Box py={2}>
                      {column.canFilter ? column.render('Filter') : null}
                    </Box>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.length === 0 && (
              <Td colSpan={100}>
                <Center p={8}>
                  <Text fontSize={'md'} fontWeight={600}>
                    You do not have any reports to show
                  </Text>
                </Center>
              </Td>
            )}
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  key={row.id}
                  cursor={rowCursor}
                  _hover={{ backgroundColor: 'brand.600' }}
                  onClick={(): void =>
                    handleOnRowClick
                      ? handleOnRowClick(row.original as any)
                      : undefined
                  }
                >
                  {row.cells.map((cell, index) => (
                    <Td
                      {...cell.getCellProps()}
                      key={`row${index}`}
                      className={'pivoted'}
                      borderTop="1px solid"
                      borderColor="brand.border"
                    >
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </ChakraTable>
      </Skeleton>
      <Stack
        display={isLoaded && rows.length === 0 ? 'none' : 'flex'}
        direction="row"
        justify="center"
        align="center"
        wrap="wrap"
        spacing={5}
        px={3}
        pb={2}
      >
        <Skeleton
          isLoaded={isLoaded}
          borderRadius="md"
          startColor="brand.panel"
          endColor="brand.headerShade"
          h={8}
        >
          <Box>
            <Text fontSize="sm" mt={1}>
              Page <b>{currentPageIndex + 1}</b> of <b>{pageOptions.length}</b>
            </Text>
          </Box>
        </Skeleton>
        <Flex>
          <Skeleton
            isLoaded={isLoaded}
            borderRadius="md"
            startColor="brand.panel"
            endColor="brand.headerShade"
          >
            <IconButton
              size="sm"
              disabled={!canPrevPage}
              variant="ghost"
              aria-label="Go back a page"
              icon={<CgChevronLeft />}
              onClick={(): void => setPrevPage()}
            />
            <IconButton
              size="sm"
              disabled={!canNextPage}
              variant="ghost"
              aria-label="Go to next page"
              icon={<CgChevronRight />}
              onClick={(): void => setNextPage()}
            />
          </Skeleton>
        </Flex>
        <Spacer />

        <Skeleton
          isLoaded={isLoaded}
          borderRadius="md"
          startColor="brand.panel"
          endColor="brand.headerShade"
          h={8}
        >
          <Text fontSize="sm" fontStyle="italic" fontWeight={500} mt={1}>
            {total}{' '}
            {PluralizeUtil.maybePluralize(() => rows.length > 1, 'report')}{' '}
          </Text>
        </Skeleton>
      </Stack>
    </Stack>
  );
};
