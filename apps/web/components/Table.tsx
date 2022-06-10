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
  Heading,
  IconButton,
  Spacer,
  Spinner,
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
    // TODO: add check if we have data
    return currentPageIndex !== 0;
  }, [currentPageIndex]);

  return (
    <Stack
      color="brand.text"
      bgColor="brand.600"
      borderRadius="lg"
      p={9}
      w="100%"
      mt={4}
      overflowX="auto"
    >
      <Heading mb={4}>Your Reports</Heading>
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
          {rows.length === 0 && !isLoaded && (
            <Flex h="full" w="full" py={8}>
              <Spinner margin="auto" color="brand.accent" thickness="3px" />
            </Flex>
          )}
          {rows.length === 0 && isLoaded && (
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
        <Box>
          <Text fontSize="sm">
            Page <b>{currentPageIndex + 1}</b> of <b>{pageOptions.length}</b>
          </Text>
        </Box>
        <Flex>
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
        </Flex>
        <Spacer />

        <Text fontSize="sm" fontStyle="italic" fontWeight={500}>
          {total}{' '}
          {PluralizeUtil.maybePluralize(
            () => rows.length > 1 || rows.length === 0,
            'report'
          )}{' '}
        </Text>
      </Stack>
    </Stack>
  );
};
