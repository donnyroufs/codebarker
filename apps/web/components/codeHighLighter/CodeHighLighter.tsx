import { merge } from 'lodash';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow as atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export type Props = {
  language: string;
  code: string;
  codeTagProps?: {
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
    onMouseOver?: (e: any) => void;
    onMouseOut?: (e: any) => void;
  };
  lineProps?: (lineNumber: number) => { style: Record<string, unknown> };
  highlightSelectedLines?: boolean;
  selectedLines: number[];
};

export const CodeHighlighter = ({
  language,
  code,
  codeTagProps,
  lineProps,
  highlightSelectedLines = false,
  selectedLines,
}: Props): JSX.Element => {
  return (
    <SyntaxHighlighter
      language={language}
      style={atomDark}
      customStyle={{
        background: '#1C1A31',
        userSelect: 'none',
        padding: 0,
      }}
      showLineNumbers={true}
      codeTagProps={codeTagProps}
      wrapLines={true}
      lineProps={(lineNumber: number): Record<string, unknown> => {
        let style: Record<string, unknown> = {
          display: 'block',
          '--wrapped-line': lineNumber,
        };

        if (selectedLines.includes(lineNumber) && highlightSelectedLines) {
          style['backgroundColor'] = '#2B2844';
        }

        if (lineProps) {
          style = merge(style, lineProps(lineNumber).style);
        }

        return { style };
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
};
