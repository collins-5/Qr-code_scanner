import React from "react";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import IndexSheet, { IndexSheetDefinition } from "./sheet";
import LogoutSheet, { LogoutSheetDefinition } from "./logout";
import ShareSheet, { ShareSheetDefinition } from "./share-sheet";

const sheets: Record<string, React.ElementType> = {
  "index-sheet": IndexSheet,
  "logout-sheet": LogoutSheet,
  "share-sheet": ShareSheet,
};

(() => {
  Object.entries(sheets).forEach(([id, sheetComponent]) => {
    registerSheet(id, sheetComponent);
  });
})();

declare module "react-native-actions-sheet" {
  interface Sheets {
    "index-sheet": IndexSheetDefinition;
    "logout-sheet": LogoutSheetDefinition;
    "share-sheet": ShareSheetDefinition;
  }
}

export type { SheetDefinition };