import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Scan {
  id: string;
  content: string;
  type: "url" | "text" | "email" | "phone" | "wifi" | "other";
  date: Date;
  isFavorite: boolean;
  notes?: string;
}

interface ScanStore {
  scans: Scan[];
  addScan: (scan: Omit<Scan, "id" | "date" | "isFavorite">) => void;
  deleteScan: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  getScanById: (id: string) => Scan | undefined;
  getScansByType: (type: Scan["type"]) => Scan[];
  updateScanNotes: (id: string, notes: string) => void;
}

export const useScanStore = create<ScanStore>()(
  persist(
    (set, get) => ({
      scans: [],

      addScan: (scanData) => {
        const newScan: Scan = {
          ...scanData,
          id: Date.now().toString(),
          date: new Date(),
          isFavorite: false,
        };

        set((state) => ({
          scans: [newScan, ...state.scans], // Newest first
        }));
      },

      deleteScan: (id) => {
        set((state) => ({
          scans: state.scans.filter((scan) => scan.id !== id),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          scans: state.scans.map((scan) =>
            scan.id === id
              ? { ...scan, isFavorite: !scan.isFavorite }
              : scan
          ),
        }));
      },

      clearHistory: () => {
        set({ scans: [] });
      },

      getScanById: (id) => {
        return get().scans.find((scan) => scan.id === id);
      },

      getScansByType: (type) => {
        return get().scans.filter((scan) => scan.type === type);
      },

      updateScanNotes: (id, notes) => {
        set((state) => ({
          scans: state.scans.map((scan) =>
            scan.id === id ? { ...scan, notes } : scan
          ),
        }));
      },
    }),
    {
      name: "scan-storage", // Unique name for storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);