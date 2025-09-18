import axios from "axios";
import type { DiaryFlight, NewDiaryEntry } from "./types";
const url = "http://localhost:3001/api/diaries";

const getFlightsDiary = async () => {
  const response = await axios.get<DiaryFlight[]>(url);
  return response.data;
};

const addFlightEntry = async (newEntry: NewDiaryEntry) => {
  const addedEntry = await axios.post<DiaryFlight>(url, newEntry);
  return addedEntry.data;
};

export { getFlightsDiary, addFlightEntry };
