import { useEffect, useState } from 'react';

export type UseInfectedLineNumbersReturnValue = {
  infectedLineNumbersError: boolean;
  setInfectedLineNumbersError: React.Dispatch<React.SetStateAction<boolean>>;
  infectedLineNumbers: number[];
  setInfectedLineNumbers: React.Dispatch<React.SetStateAction<number[]>>;
};

export function useInfectedLineNumbers(): UseInfectedLineNumbersReturnValue {
  const [infectedLineNumbers, setInfectedLineNumbers] = useState<number[]>([]);
  const [infectedLineNumbersError, setInfectedLineNumbersError] =
    useState(false);

  useEffect(() => {
    if (infectedLineNumbers.length > 0 && infectedLineNumbersError) {
      setInfectedLineNumbersError(false);
    }
  }, [infectedLineNumbers, infectedLineNumbersError]);

  return {
    infectedLineNumbersError,
    setInfectedLineNumbersError,
    infectedLineNumbers,
    setInfectedLineNumbers,
  };
}
