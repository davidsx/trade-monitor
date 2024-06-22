declare global {
  namespace NodeJS {
    interface ProcessEnv {
      WOO_APPLICATION_ID: string;
      WOO_API_KEY: string;
      WOO_API_SECRET: string;
      COINALYZE_API_KEY: string;
    }
  }
}

export {};
