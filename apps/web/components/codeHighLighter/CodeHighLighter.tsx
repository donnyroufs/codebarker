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
};

export const CodeHighlighter = ({
  language,
  code,
  codeTagProps,
  lineProps,
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
      lineProps={lineProps}
    >
      {code}
    </SyntaxHighlighter>
  );
};
