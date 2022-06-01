import { Button, ButtonVariant } from '@codebarker/components';
import NextLink from 'next/link';

type Props = React.PropsWithChildren<{
  href: string;
  variant?: ButtonVariant;
}>;

export const ButtonLink = ({ href, children, variant }: Props): JSX.Element => (
  <NextLink href={href} passHref>
    <a>
      <Button
        as="span"
        textDecor="none !important"
        variant={variant ? variant : 'primary'}
      >
        {children}
      </Button>
    </a>
  </NextLink>
);
