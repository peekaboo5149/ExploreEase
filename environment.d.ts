declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string
      REDIS_URL: string
      ACCESS_TOKEN_EXP: string
      REFRESH_TOKEN_EXP: string
      DATABASE_URL: string
      PUBLIC_KEY: string
      NODE_ENV: 'development' | 'production'
      PORT?: string
      PWD: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
