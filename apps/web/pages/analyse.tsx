import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useToast } from '@chakra-ui/react';

import { GithubRepositoryUrlParser } from '@codebarker/shared';

import { Layout } from '../components/Layout';
import { useAuth, useInfectedLineNumbers } from '../hooks';
import { getFileContentFromGithub } from './api/getFileContentFromGithub';
import { AnalysingStep, FetchFileFromGithubStep } from '../components';

export function Analyse(): JSX.Element {
  const auth = useAuth({ required: true });
  const toast = useToast();
  const infectedLines = useInfectedLineNumbers();
  const { setInfectedLineNumbers, setInfectedLineNumbersError } = infectedLines;

  const [error, setError] = useState<string | null>(null);
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
      // TODO: Improve how we sent errors from the backend
      onError(err: Error) {
        const ext = GithubRepositoryUrlParser.getFileExtension(
          parsedGithubUrl.fileDir!
        );
        setIsAnalysing(false);
        const message = err.message;

        if (message.includes('Not Found')) {
          setError('The file could not be found.');
          return;
        }

        if (message.includes(ext)) {
          setError(`We do not support the extension: '${ext}'`);
          return;
        }

        // TODO: Add logger
        setError(err.message);
      },
      onSuccess() {
        setError(null);
      },
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

  if (isAnalysing && isLoaded) {
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
      error={error}
      isLoading={isFetching}
      handleStart={handleStart}
      parsedGithubUrl={parsedGithubUrl}
      setUrlValue={setValue}
      urlValue={value}
    />
  );
}

Analyse.getLayout = (page: JSX.Element): JSX.Element => <Layout>{page}</Layout>;

export default Analyse;
