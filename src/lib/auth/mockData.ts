import type { Agreement, Receivable, TeamMember, PendingInvitation, User, Activity } from './types';

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: "u1", name: "Alice Johnson", email: "alice@example.com", role: "admin", joinedAt: "2024-01-15" },
  { id: "u2", name: "Bob Smith", email: "bob@example.com", role: "approver", joinedAt: "2024-02-20" },
  { id: "u3", name: "Carol Davis", email: "carol@example.com", role: "member", joinedAt: "2024-03-10" },
  { id: "u4", name: "Dan Wilson", email: "dan@example.com", role: "receiver", joinedAt: "2024-04-05" },
];

export const MOCK_PENDING_INVITATIONS: PendingInvitation[] = [
  { id: "inv1", email: "newuser@example.com", role: "member", invitedAt: "2024-05-01" },
  { id: "inv2", email: "another@example.com", role: "approver", invitedAt: "2024-05-02" },
];

export const MOCK_RECEIVABLES: Record<string, Receivable[]> = {
  "a1": [
    { id: "r1", category: "Flights", description: "Oslo roundtrip", amount: 4200, date: "2026-04-10" },
    { id: "r2", category: "Lodging", description: "2 nights at Oslo Plaza", amount: 3800, date: "2026-04-10" },
    { id: "r3", category: "Meals", description: "Dinner with client", amount: 400, date: "2026-04-11" },
  ],
  "a2": [
    { id: "r4", category: "Transport", description: "Taxi to venue", amount: 180, date: "2026-04-15" },
  ],
  "a3": [
    { id: "r5", category: "Flights", description: "Copenhagen roundtrip", amount: 3100, date: "2026-03-20" },
    { id: "r6", category: "Materials", description: "Conference materials", amount: 600, date: "2026-03-21" },
  ],
};

export const MOCK_ACTIVITIES: Record<string, Agreement["activities"]> = {
  "a1": [
    { id: "act1", type: "created", timestamp: "2026-04-08T10:00:00Z", userId: "u3", userName: "Carol Davis" },
    { id: "act2", type: "submitted", timestamp: "2026-04-12T14:30:00Z", userId: "u3", userName: "Carol Davis" },
  ],
  "a2": [
    { id: "act3", type: "created", timestamp: "2026-04-14T09:00:00Z", userId: "u3", userName: "Carol Davis" },
  ],
  "a3": [
    { id: "act4", type: "created", timestamp: "2026-03-18T11:00:00Z", userId: "u3", userName: "Carol Davis" },
    { id: "act5", type: "submitted", timestamp: "2026-03-22T16:00:00Z", userId: "u3", userName: "Carol Davis" },
    { id: "act6", type: "approved", timestamp: "2026-03-25T10:00:00Z", userId: "u2", userName: "Bob Smith", note: "Approved. All receipts verified." },
  ],
};

export const MOCK_AGREEMENTS: Agreement[] = [
  {
    id: "a1",
    title: "Oslo Innovation Week 2026",
    description: "Travel and accommodation for OIW 2026",
    currency: "NOK",
    status: "submitted",
    total: 8400,
    createdAt: "2026-04-08",
    submitterId: "u3",
    submitterName: "Carol Davis",
    approverId: "u2",
    approverName: "Bob Smith",
    receivables: MOCK_RECEIVABLES["a1"],
    activities: MOCK_ACTIVITIES["a1"],
  },
  {
    id: "a2",
    title: "Stockholm Tech Summit",
    description: "Tech summit attendance and expenses",
    currency: "SEK",
    status: "draft",
    total: 180,
    createdAt: "2026-04-14",
    submitterId: "u3",
    submitterName: "Carol Davis",
    approverId: "u2",
    approverName: "Bob Smith",
    receivables: MOCK_RECEIVABLES["a2"],
    activities: MOCK_ACTIVITIES["a2"],
  },
  {
    id: "a3",
    title: "Copenhagen Public Sector Forum",
    description: "Annual public sector conference",
    currency: "DKK",
    status: "approved",
    total: 6700,
    createdAt: "2026-03-18",
    submitterId: "u3",
    submitterName: "Carol Davis",
    approverId: "u2",
    approverName: "Bob Smith",
    receivables: MOCK_RECEIVABLES["a3"],
    activities: MOCK_ACTIVITIES["a3"],
  },
  {
    id: "a4",
    title: "Helsinki Design Week",
    description: "Design workshops and materials",
    currency: "EUR",
    status: "draft",
    total: 0,
    createdAt: "2026-04-20",
    submitterId: "u3",
    submitterName: "Carol Davis",
    approverId: "u1",
    approverName: "Alice Johnson",
    receivables: [],
    activities: [
      { id: "act7", type: "created", timestamp: "2026-04-20T08:00:00Z", userId: "u3", userName: "Carol Davis" },
    ],
  },
  {
    id: "a5",
    title: "Reykjavik Winter Conference",
    description: "Northern Europe tech conference",
    currency: "ISK",
    status: "rejected",
    total: 12500,
    createdAt: "2026-03-01",
    submitterId: "u3",
    submitterName: "Carol Davis",
    approverId: "u2",
    approverName: "Bob Smith",
    receivables: [
      { id: "r7", category: "Flights", description: "Reykjavik roundtrip", amount: 8500, date: "2026-02-15" },
      { id: "r8", category: "Lodging", description: "3 nights", amount: 4000, date: "2026-02-15" },
    ],
    activities: [
      { id: "act8", type: "created", timestamp: "2026-03-01T09:00:00Z", userId: "u3", userName: "Carol Davis" },
      { id: "act9", type: "submitted", timestamp: "2026-03-05T11:00:00Z", userId: "u3", userName: "Carol Davis" },
      { id: "act10", type: "rejected", timestamp: "2026-03-08T14:00:00Z", userId: "u2", userName: "Bob Smith", note: "Exceeds budget limit for this quarter." },
    ],
  },
];

let agreementsStore: Agreement[] = [...MOCK_AGREEMENTS];

export function getAgreements(): Agreement[] {
  return agreementsStore;
}

export function getAgreementById(id: string): Agreement | undefined {
  return agreementsStore.find(a => a.id === id);
}

export function createAgreement(data: Pick<Agreement, "title" | "description" | "currency" | "approverId" | "approverName">): Agreement {
  const newAgreement: Agreement = {
    id: `a${Date.now()}`,
    title: data.title,
    description: data.description,
    currency: data.currency,
    status: "draft",
    total: 0,
    createdAt: new Date().toISOString().split("T")[0],
    submitterId: "u3",
    submitterName: "Carol Davis",
    approverId: data.approverId,
    approverName: data.approverName,
    receivables: [],
    activities: [
      {
        id: `act${Date.now()}`,
        type: "created",
        timestamp: new Date().toISOString(),
        userId: "u3",
        userName: "Carol Davis",
      },
    ],
  };
  agreementsStore = [newAgreement, ...agreementsStore];
  return newAgreement;
}

export function updateAgreementStatus(id: string, status: Agreement["status"], note?: string): Agreement | undefined {
  const agreement = agreementsStore.find(a => a.id === id);
  if (!agreement) return undefined;

  agreement.status = status;
  agreement.activities.push({
    id: `act${Date.now()}`,
    type: status as Activity["type"],
    timestamp: new Date().toISOString(),
    userId: "u2",
    userName: "Bob Smith",
    note,
  });

  if (status === "approved" || status === "rejected") {
    agreement.total = agreement.receivables.reduce((s, r) => s + r.amount, 0);
  }

  return agreement;
}

export function addReceivable(agreementId: string, receivable: Omit<Receivable, "id">): Receivable | undefined {
  const agreement = agreementsStore.find(a => a.id === agreementId);
  if (!agreement) return undefined;

  const newReceivable: Receivable = {
    id: `r${Date.now()}`,
    ...receivable,
  };
  agreement.receivables.push(newReceivable);
  agreement.total = agreement.receivables.reduce((s, r) => s + r.amount, 0);
  return newReceivable;
}

export function submitAgreement(id: string): Agreement | undefined {
  return updateAgreementStatus(id, "submitted");
}

export function approveAgreement(id: string, note?: string): Agreement | undefined {
  return updateAgreementStatus(id, "approved", note);
}

export function rejectAgreement(id: string, note?: string): Agreement | undefined {
  return updateAgreementStatus(id, "rejected", note);
}

export function getPendingApprovals(): Agreement[] {
  return agreementsStore.filter(a => a.status === "submitted");
}

export function getApprovedAgreements(): Agreement[] {
  return agreementsStore.filter(a => a.status === "approved");
}

export function getRejectedAgreements(): Agreement[] {
  return agreementsStore.filter(a => a.status === "rejected");
}

export const MOCK_APPROVER_OPTIONS: User[] = [
  { id: "u1", name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: "u2", name: "Bob Smith", email: "bob@example.com", role: "approver" },
];
