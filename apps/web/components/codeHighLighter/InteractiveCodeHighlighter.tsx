import { cast } from '@codebarker/shared';

import { CodeHighlighter } from './CodeHighLighter';

function getElement(target: HTMLSpanElement): HTMLSpanElement {
  const hasWrappedLineProp =
    target.getAttribute('style')?.indexOf('--wrapped-line:') != -1;

  const el = hasWrappedLineProp ? target : target.parentElement!;

  const hasStyleAttr = el.getAttribute('style');
  return hasStyleAttr ? el : el.parentElement!;
}

type Props = {
  code: string;
  language: string;
  selectedLines: number[];
  setSelectedLines: React.Dispatch<React.SetStateAction<number[]>>;
};

export const InteractiveCodeHighlighter = ({
  code,
  language,
  selectedLines,
  setSelectedLines,
}: Props): JSX.Element => {
  return (
    <CodeHighlighter
      code={code}
      language={language}
      codeTagProps={{
        onClick: (e: React.MouseEvent<HTMLSpanElement>): void => {
          const target = cast<HTMLSpanElement>(e.target);

          const element = getElement(target);

          const styleValues = element.getAttribute('style')?.split(' ') ?? [];

          const value = Number(
            styleValues
              .find((val) => val.includes('--wrapped-line'))
              ?.split(':')
              .at(1)!
              .slice(0, -1)
          );

          if (!value) return;

          if (selectedLines.includes(value)) {
            setSelectedLines((curr) => [...curr.filter((n) => n !== value)]);
            return;
          }

          setSelectedLines((curr) => [...curr, value]);
        },
        onMouseOver: (e: any): void => {
          const target = cast<HTMLSpanElement>(e.target);
          const element = getElement(target);

          element.style.opacity = '0.5';
        },
        onMouseOut: (e: any): void => {
          const target = cast<HTMLSpanElement>(e.target);
          const element = getElement(target);

          element.style.opacity = '1';
        },
      }}
      lineProps={(lineNumber: number): { style: Record<string, unknown> } => {
        const style: Record<string, unknown> = {
          display: 'block',
          cursor: 'pointer',
          '--wrapped-line': lineNumber,
        };

        if (selectedLines.includes(lineNumber)) {
          style['backgroundColor'] = '#2B2844';
        }

        return { style };
      }}
    />
  );
};
