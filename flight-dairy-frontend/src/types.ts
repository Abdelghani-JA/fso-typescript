export interface DiaryFlight {
  id: number;
  date: string;
  weather: string;
  visibility: string;
  comment?: string;
}

export type NewDiaryEntry = Omit<DiaryFlight, "id">;

export interface ParseErrorResponse {
  error: {
    fieldErrors: { [index: string]: string[] };
  };
}
