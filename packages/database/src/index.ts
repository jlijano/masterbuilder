export interface DatabaseRuntimeConfig {
  databaseUrl: string;
}

export function createDatabaseRuntimeConfig(databaseUrl: string): DatabaseRuntimeConfig {
  if (!databaseUrl.trim()) {
    throw new Error("DATABASE_URL is required.");
  }

  return { databaseUrl };
}
