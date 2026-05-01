export type ReceiptCategory =
  | "Flights"
  | "Meals"
  | "Transport"
  | "Lodging"
  | "Materials"
  | "Other";

export const RECEIPT_CATEGORIES: ReceiptCategory[] = [
  "Flights",
  "Meals",
  "Transport",
  "Lodging",
  "Materials",
  "Other",
];

export interface Identity {
  fullName: string;
  address: string;
  postalCode: string;
  place: string;
  country: string;
  phone: string;
  email: string;
  bankAccount: string;
  iban: string;
  bicSwift: string;
  signaturePng: string;
}

export interface Trip {
  id: string;
  catalogId?: string;
  eventName: string;
  location: string;
  startDate: string;
  endDate: string;
  outputCurrency: string;
  recipientEmail: string;
  organizationName: string;
  rulesText?: string;
  maxAmount?: number;
  coverHeader?: string;
  comments?: string;
  submittedAt?: number;
  createdAt: number;
}

export interface CatalogEvent {
  id: string;
  eventName: string;
  organizationName: string;
  location: string;
  startDate: string;
  endDate: string;
  outputCurrency: string;
  recipientEmail: string;
  rulesText?: string;
  maxAmount?: number;
  reimbursementDeadline?: string;
  description?: string;
}

export interface Receipt {
  id: string;
  tripId: string;
  imageBlob: Blob;
  imageType: string;
  originalAmount: number;
  originalCurrency: string;
  date: string;
  category: ReceiptCategory;
  description: string;
  convertedAmount: number;
  fxRate: number;
  fxFetchedAt: number;
  createdAt: number;
}

export const CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "NOK",
  "SEK",
  "DKK",
  "ISK",
  "CHF",
  "PLN",
  "CZK",
  "HUF",
  "JPY",
  "CAD",
  "AUD",
  "BRL",
] as const;
