import 'next-auth';

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface User {
    id: string;
    role: number;
    email: string;
    image: ?string;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Session {
    user?: User;
  }
}
