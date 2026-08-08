declare module 'expo-sqlite' {
  export interface SQLiteDatabase {
    execAsync(sql: string): Promise<void>;
    runAsync(sql: string, params?: any[]): Promise<void>;
    getFirstAsync<T = any>(sql: string, params?: any[]): Promise<T | null>;
    getAllAsync<T = any>(sql: string, params?: any[]): Promise<T[]>;
  }

  export function openDatabaseSync(
    databaseName: string,
    options?: {
      enableCRSQLite?: boolean;
      useNewConnection?: boolean;
    }
  ): SQLiteDatabase;
}