export type UserRole = "admin" | "approver" | "member" | "receiver";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Agreement {
  id: string;
  title: string;
  description: string;
  currency: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  total: number;
  createdAt: string;
  submitterId: string;
  submitterName: string;
  approverId: string;
  approverName: string;
  receivables: Receivable[];
  activities: Activity[];
}

export interface Receivable {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface Activity {
  id: string;
  type: "created" | "submitted" | "approved" | "rejected" | "received";
  timestamp: string;
  userId: string;
  userName: string;
  note?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedAt: string;
}
