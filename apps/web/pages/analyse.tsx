import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useToast } from '@chakra-ui/react';

import { Layout } from '../components/Layout';
import { useAuth, useInfectedLineNumbers } from '../hooks';
import { GithubRepositoryUrlParser } from '../parsers/GithubRepositoryUrlParser';
import { getFileContentFromGithub } from './api/getFileContentFromGithub';
import { AnalysingStep, FetchFileFromGithubStep } from '../components';

export function Analyse(): JSX.Element {
  const auth = useAuth({ required: true });
  const toast = useToast();
  const infectedLines = useInfectedLineNumbers();
  const { setInfectedLineNumbers, setInfectedLineNumbersError } = infectedLines;

  const [isAnalysing, setIsAnalysing] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const { data, isLoading, isFetching } = useQuery(
    ['getFileContentFromGithub'],
    () =>
      getFileContentFromGithub({
        author: parsedGithubUrl.author!,
        fileDir: parsedGithubUrl.fileDir!,
        repositoryName: parsedGithubUrl.repositoryName!,
        sha: parsedGithubUrl.sha,
      }),
    {
      enabled: isAnalysing,
    }
  );

  useEffect(() => {
    setInfectedLineNumbers([]);
    setInfectedLineNumbersError(false);
  }, [isAnalysing, setInfectedLineNumbers, setInfectedLineNumbersError]);

  const parsedGithubUrl = useMemo(() => {
    return GithubRepositoryUrlParser.parse(value);
  }, [value]);

  function handleStart(): void {
    setIsAnalysing(true);
  }

  function handleGoBack(): void {
    setIsAnalysing(false);
  }

  function onSuccess(): void {
    setIsAnalysing(false);
    setValue('');

    toast({
      title: 'Success',
      description: 'Your analysis got submitted.',
      status: 'success',
      duration: 5_000,
      isClosable: true,
      position: 'top',
    });
  }

  const isLoaded = [!isLoading, !isFetching].every((v) => v);

  if (isAnalysing) {
    return (
      <AnalysingStep
        isLoaded={isLoaded}
        parsedGithubUrl={parsedGithubUrl}
        handleGoBack={handleGoBack}
        user={auth?.user}
        onSuccess={onSuccess}
        data={data}
        {...infectedLines}
      />
    );
  }

  return (
    <FetchFileFromGithubStep
      handleStart={handleStart}
      parsedGithubUrl={parsedGithubUrl}
      setUrlValue={setValue}
      urlValue={value}
    />
  );
}

Analyse.getLayout = (page: JSX.Element): JSX.Element => <Layout>{page}</Layout>;

export default Analyse;
