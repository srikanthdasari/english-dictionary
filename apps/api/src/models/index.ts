export interface Phonetic {
  text: string;
  audio: string;
  sourceUrl: string;
  license: License;
}

export interface License {
  name: string;
  url: string;
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntryData {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];
}

export class DictionaryEntry {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];

  constructor(data: DictionaryEntryData) {
    this.word = data.word;
    this.phonetic = data.phonetic;
    this.phonetics = data.phonetics;
    this.meanings = data.meanings;
    this.license = data.license;
    this.sourceUrls = data.sourceUrls;
  }

  getAudio(): string[] {
    return this.phonetics.map(phonetic => phonetic.audio);
  }

  getDefinitions(partOfSpeech: string): Definition[] {
    const meanings = this.meanings.filter(meaning => meaning.partOfSpeech === partOfSpeech);
    return meanings.map(meaning => meaning.definitions).flat();
  }

  getJson() {
    return {
      word: this.word,
      phonetic: this.phonetic,
      phonetics: this.phonetics,
      meanings: this.meanings,
      license: this.license,
      sourceUrls: this.sourceUrls
    };
  }

}
