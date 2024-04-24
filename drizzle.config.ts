import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  driver: 'turso',
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_URL as string,
    authToken: process.env.DB_AUTH_TOKEN as string,
  },
  verbose: true,
  strict: true,
})
