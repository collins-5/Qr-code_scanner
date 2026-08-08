import { create } from "zustand";
import { scanDb } from "@/lib/database";

export interface Scan {
  id: string;
  content: string;
  type: "url" | "text" | "email" | "phone" | "wifi" | "other";
  date: Date;
  isFavorite: boolean;
  notes?: string;
  qrImagePath?: string;
}

interface ScanStore {
  scans: Scan[];
  isLoading: boolean;
  loadScans: () => Promise<void>;
  addScan: (scan: Omit<Scan, "id" | "date" | "isFavorite">) => Promise<string>;
  deleteScan: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  getScanById: (id: string) => Scan | undefined;
  updateQRImagePath: (id: string, path: string) => Promise<void>;
}

export const useScanStore = create<ScanStore>((set, get) => ({
  scans: [],
  isLoading: false,

  loadScans: async () => {
    set({ isLoading: true });
    try {
      const dbScans = await scanDb.getAllScans();
      const scans = dbScans.map((s: any) => ({
        ...s,
        date: new Date(s.date),
        isFavorite: s.isFavorite === 1,
      }));
      set({ scans, isLoading: false });
    } catch (error) {
      console.error("Error loading scans:", error);
      set({ isLoading: false });
    }
  },

  addScan: async (scanData) => {
    const newScan: Scan = {
      ...scanData,
      id: Date.now().toString(),
      date: new Date(),
      isFavorite: false,
    };

    try {
      await scanDb.addScan({
        ...newScan,
        date: newScan.date,
      });

      set((state) => ({
        scans: [newScan, ...state.scans],
      }));
    } catch (error) {
      console.error("Error adding scan:", error);
    }

    return newScan.id;
  },

  deleteScan: async (id) => {
    try {
      await scanDb.deleteScan(id);
      set((state) => ({
        scans: state.scans.filter((scan) => scan.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting scan:", error);
    }
  },

  toggleFavorite: async (id) => {
    try {
      await scanDb.toggleFavorite(id);
      set((state) => ({
        scans: state.scans.map((scan) =>
          scan.id === id ? { ...scan, isFavorite: !scan.isFavorite } : scan
        ),
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  },

  clearHistory: async () => {
    try {
      await scanDb.clearAllScans();
      set({ scans: [] });
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  },

  getScanById: (id) => {
    return get().scans.find((scan) => scan.id === id);
  },

  updateQRImagePath: async (id, path) => {
    try {
      await scanDb.updateQRImagePath(id, path);
      set((state) => ({
        scans: state.scans.map((scan) =>
          scan.id === id ? { ...scan, qrImagePath: path } : scan
        ),
      }));
    } catch (error) {
      console.error("Error updating QR image path:", error);
    }
  },
}));