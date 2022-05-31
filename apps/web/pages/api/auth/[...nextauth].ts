import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';

import { PrismaService } from '@codebarker/infrastructure';

import { container } from '../../../container';
// import RedditProvider from "next-auth/providers/reddit"
// new PrismaService().

export default NextAuth({
  adapter: PrismaAdapter(container.get(PrismaService)),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
