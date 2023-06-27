declare namespace NodeJS {
    interface ProcessEnv {
      // Define your environment variables here
      JWT_SECRET: string;
      DATABASE_URL: number;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      // ...
    }
  }
  