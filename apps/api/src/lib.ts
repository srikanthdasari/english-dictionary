import axios from "axios";
import { DictionaryEntry, DictionaryEntryData } from "./models";

export async function fetchDictionaryEntry(word: string): Promise<DictionaryEntry> {
  try {
    const response = await axios.get<DictionaryEntryData[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

    // Assuming the API returns an array of entries, we take the first one
    const entryData = response.data[0];

    // Convert the raw data to an instance of DictionaryEntry
    const dictionaryEntry = new DictionaryEntry(entryData);

    return dictionaryEntry;
  } catch (error) {
    console.error('Error fetching dictionary entry:', error);
    throw error;
  }
}
