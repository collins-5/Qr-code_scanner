import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('qrscanner.db');

export async function initDatabase() {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS scans (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        isFavorite INTEGER DEFAULT 0,
        notes TEXT,
        qrImagePath TEXT
      );
    `);

    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_scans_date ON scans(date DESC);
      CREATE INDEX IF NOT EXISTS idx_scans_type ON scans(type);
    `);

    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export const scanDb = {
  async getAllScans(): Promise<any[]> {
    try {
      return await db.getAllAsync('SELECT * FROM scans ORDER BY date DESC');
    } catch (error) {
      console.error('Error getting scans:', error);
      return [];
    }
  },

  async getScanById(id: string): Promise<any | null> {
    try {
      return await db.getFirstAsync('SELECT * FROM scans WHERE id = ?', [id]) || null;
    } catch (error) {
      console.error('Error getting scan:', error);
      return null;
    }
  },

  async addScan(scan: { 
    id: string; 
    content: string; 
    type: string; 
    date: Date; 
    isFavorite?: boolean; 
    notes?: string; 
    qrImagePath?: string 
  }): Promise<boolean> {
    try {
      await db.runAsync(
        `INSERT INTO scans (id, content, type, date, isFavorite, notes, qrImagePath) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          scan.id,
          scan.content,
          scan.type,
          scan.date.toISOString(),
          scan.isFavorite ? 1 : 0,
          scan.notes || null,
          scan.qrImagePath || null
        ]
      );
      return true;
    } catch (error) {
      console.error('Error adding scan:', error);
      return false;
    }
  },

  async deleteScan(id: string): Promise<boolean> {
    try {
      await db.runAsync('DELETE FROM scans WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error('Error deleting scan:', error);
      return false;
    }
  },

  async toggleFavorite(id: string): Promise<boolean> {
    try {
      const scan = await db.getFirstAsync('SELECT isFavorite FROM scans WHERE id = ?', [id]);
      if (!scan) return false;
      
      const newStatus = scan.isFavorite === 1 ? 0 : 1;
      await db.runAsync('UPDATE scans SET isFavorite = ? WHERE id = ?', [newStatus, id]);
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },

  async updateQRImagePath(id: string, path: string): Promise<boolean> {
    try {
      await db.runAsync('UPDATE scans SET qrImagePath = ? WHERE id = ?', [path, id]);
      return true;
    } catch (error) {
      console.error('Error updating QR image path:', error);
      return false;
    }
  },

  async clearAllScans(): Promise<boolean> {
    try {
      await db.runAsync('DELETE FROM scans');
      return true;
    } catch (error) {
      console.error('Error clearing scans:', error);
      return false;
    }
  },

  async getScansByType(type: string): Promise<any[]> {
    try {
      return await db.getAllAsync('SELECT * FROM scans WHERE type = ? ORDER BY date DESC', [type]);
    } catch (error) {
      console.error('Error getting scans by type:', error);
      return [];
    }
  },

  async getScanCount(): Promise<number> {
    try {
      const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM scans');
      return result?.count || 0;
    } catch (error) {
      console.error('Error getting scan count:', error);
      return 0;
    }
  }
};

export default db;