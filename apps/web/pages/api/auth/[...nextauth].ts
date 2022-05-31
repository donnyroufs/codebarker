import NextAuth from 'next-auth';

import GithubProvider from 'next-auth/providers/github';
// import RedditProvider from "next-auth/providers/reddit"

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
