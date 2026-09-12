export type Gender = 'male' | 'female' | 'none';
export type HistoryCategory = 'education' | 'work';
export type EducationAction = '入学' | '転学' | '退学' | '卒業';
export type WorkAction = '入社' | '退社' | '異動';

export interface JpDate {
  year: number;
  month: number;
}

export interface HistoryEntry {
  id: string;
  date: JpDate;
  category: HistoryCategory;
  name: string;
  nameFurigana?: string;
  action: EducationAction | WorkAction;
  detail?: string;
}

export interface LicenseEntry {
  id: string;
  date: JpDate;
  name: string;
  issuer?: string;
}

export interface RirekishoData {
  fillDate: JpDate;
  photo?: string;
  furigana: string;
  fullName: string;
  dateOfBirth: JpDate;
  gender: Gender;
  postalCode: string;
  prefecture: string;
  address: string;
  addressFurigana: string;
  phone: string;
  email: string;
  alternateContactEnabled: boolean;
  alternateContact?: {
    relation: string;
    name: string;
    phone: string;
  };
  history: HistoryEntry[];
  historyCurrent: boolean;
  licenses: LicenseEntry[];
  specialties: string;
  hobbies: string;
  motivation: string;
  commuteHours: number;
  commuteMinutes: number;
  spouse: boolean;
  dependents: number;
  requests: string;
}

export const DRAFT_VERSION = 1;
