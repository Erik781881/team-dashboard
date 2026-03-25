import { google } from "googleapis";
import { env } from "@/lib/env";

const SHEET_NAME = "Progress";

export type SheetRow = {
  Team: string;
  TotalPoints: number;
  Stage1_Completed: boolean;
  Stage2_Completed: boolean;
  Stage3_Completed: boolean;
  Stage4_Completed: boolean;
  taskCompleted: boolean[];
  taskPoints: number[];
};

const parseBoolean = (value: string | undefined) =>
  ["true", "1", "yes", "done", "completed"].includes((value ?? "").toLowerCase().trim());

const parseNumber = (value: string | undefined) => Number.parseInt(value ?? "0", 10) || 0;

export async function fetchProgressSheet(): Promise<SheetRow[]> {
  const auth = new google.auth.JWT({
    email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A1:AD1000`
  });

  const rows = result.data.values ?? [];
  if (rows.length <= 1) return [];

  const [header, ...dataRows] = rows;
  const columnIndex = (name: string) => header.indexOf(name);

  return dataRows
    .filter((r) => r[columnIndex("Team")])
    .map((row) => {
      const taskCompleted = Array.from({ length: 12 }, (_, i) => {
        const idx = columnIndex(`Task${i + 1}_Completed`);
        return parseBoolean(row[idx]);
      });

      const taskPoints = Array.from({ length: 12 }, (_, i) => {
        const idx = columnIndex(`Task${i + 1}_Points`);
        return parseNumber(row[idx]);
      });

      return {
        Team: row[columnIndex("Team")] ?? "",
        TotalPoints: parseNumber(row[columnIndex("TotalPoints")]),
        Stage1_Completed: parseBoolean(row[columnIndex("Stage1_Completed")]),
        Stage2_Completed: parseBoolean(row[columnIndex("Stage2_Completed")]),
        Stage3_Completed: parseBoolean(row[columnIndex("Stage3_Completed")]),
        Stage4_Completed: parseBoolean(row[columnIndex("Stage4_Completed")]),
        taskCompleted,
        taskPoints
      };
    });
}
