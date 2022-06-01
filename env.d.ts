declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      GITHUB_ID: string;
      GITHUB_SECRET: string;
      DISCORD_ID: string;
      DISCORD_SECRET: string;
      NEXTAUTH_URL: string;
    }
  }
}

export {}
