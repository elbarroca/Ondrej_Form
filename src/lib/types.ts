export type ReceiptCategory =
  | "travel"
  | "lodging"
  | "meals"
  | "conferences"
  | "supplies"
  | "translation"
  | "other";

export const RECEIPT_CATEGORIES: ReceiptCategory[] = [
  "travel",
  "lodging",
  "meals",
  "conferences",
  "supplies",
  "translation",
  "other",
];

export type ReportStatus = "draft" | "submitted" | "approved" | "rejected";

export type Report = {
  id: string;
  org_id: string;
  submitter_id: string;
  approver_id?: string;
  title: string;
  reference: string;
  currency: CurrencyCode;
  date_from?: string;
  date_to?: string;
  status: ReportStatus;
  total_minor: number;
  comment?: string;
  submitted_at?: string;
  decided_at?: string;
  created_at: string;
  updated_at: string;
};

export type ReceiptRecord = {
  id: string;
  report_id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: "image/png" | "image/jpeg" | "image/heic" | "application/pdf";
  category: ReceiptCategory;
  amount_minor: number;
  currency: CurrencyCode;
  fx_rate?: number;
  amount_minor_in_report_currency: number;
  date?: string;
  vendor?: string;
  notes?: string;
  uploaded_at: string;
  deleted_at?: string;
};

export type ActivityEvent = {
  id: string;
  report_id: string;
  actor_id: string;
  type:
    | "created"
    | "receipt_added"
    | "receipt_removed"
    | "submitted"
    | "approved"
    | "rejected"
    | "comment"
    | "downloaded";
  payload?: Record<string, unknown>;
  created_at: string;
};

export type CurrencyCode =
  | "EUR"
  | "USD"
  | "CAD"
  | "GBP"
  | "NOK"
  | "SEK"
  | "DKK"
  | "ISK"
  | "CHF"
  | "PLN"
  | "CZK"
  | "HUF"
  | "RON"
  | "BGN";

export type UserRole = "admin" | "approver" | "member" | "receiver";

export type UserRecord = {
  id: string;
  org_id: string;
  email: string;
  full_name: string;
  department?: string;
  role: UserRole;
  iban?: string;
  bic?: string;
  tax_id?: string;
  default_currency?: CurrencyCode;
  avatar_url?: string;
  created_at: string;
};

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
  categoryDescriptions?: Partial<Record<ReceiptCategory, string>>;
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
