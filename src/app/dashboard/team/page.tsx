"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { MOCK_TEAM_MEMBERS, MOCK_PENDING_INVITATIONS } from "@/lib/auth/mockData";
import type { TeamMember, PendingInvitation, UserRole } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Drawer } from "@/components/ui/drawer";
import { UsersIcon, PlusIcon, XIcon, MailIcon } from "lucide-react";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  approver: "Approver",
  member: "Member",
  receiver: "Receiver",
};

const ROLE_BADGE_VARIANT: Record<UserRole, "brand" | "neutral"> = {
  admin: "brand",
  approver: "brand",
  member: "neutral",
  receiver: "neutral",
};

export default function TeamPage() {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>(MOCK_PENDING_INVITATIONS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("member");

  if (!isAdmin) {
    return (
      <div className="space-y-7">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em]">Team</h1>
          <p className="mt-1.5 text-sm text-mute">Team members and invitations</p>
        </div>
        <div className="rounded-[14px] border border-line bg-white">
          <EmptyState icon={<UsersIcon className="size-12" />} headline="Access denied" helper="You do not have permission to manage the team" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em]">Team</h1>
          <p className="mt-1.5 text-sm text-mute">{members.length} members · {pendingInvitations.length} pending invitations</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<PlusIcon className="size-3.5" />} onClick={() => setShowInvite(true)}>
          Invite member
        </Button>
      </div>

      <div className="rounded-[14px] border border-line bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <h3 className="text-[14.5px] font-semibold">Members</h3>
        </div>
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3.5 border-b border-line-soft last:border-b-0" style={{ padding: "var(--row-pad, 14px) 20px" }}>
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/12 text-brand text-xs font-semibold">
              {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold">{m.name}</p>
              <p className="text-[12px] text-mute">{m.email}</p>
            </div>
            <Badge variant={ROLE_BADGE_VARIANT[m.role]}>{ROLE_LABELS[m.role]}</Badge>
            <span className="text-[12px] text-mute">{m.joinedAt}</span>
            <Button variant="ghost" size="sm">•••</Button>
          </div>
        ))}
      </div>

      {pendingInvitations.length > 0 && (
        <div className="rounded-[14px] border border-line bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h3 className="text-[14.5px] font-semibold">Pending invitations</h3>
          </div>
          {pendingInvitations.map((inv) => (
            <div key={inv.id} className="flex items-center gap-3.5 border-b border-line-soft last:border-b-0" style={{ padding: "var(--row-pad, 14px) 20px" }}>
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-paper text-mute text-xs font-semibold border border-line">
                <MailIcon className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">{inv.email}</p>
                <p className="text-[12px] text-mute">Invited {inv.invitedAt}</p>
              </div>
              <Badge variant={ROLE_BADGE_VARIANT[inv.role]}>{ROLE_LABELS[inv.role]}</Badge>
              <Button variant="ghost" size="sm" className="text-red hover:text-red">
                <XIcon className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Drawer open={showInvite} onClose={() => setShowInvite(false)} title="Invite a team member">
        <div className="space-y-4">
          <Input id="invite-email" label="Email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail((e.target as HTMLInputElement).value)} placeholder="colleague@agency.gov.no" required />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium">Role</label>
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as UserRole)} className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-[14px] focus:border-brand focus:ring-[3px] focus:ring-brand/15 outline-none">
              {(["admin", "approver", "member", "receiver"] as UserRole[]).map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <Button variant="primary" className="w-full" onClick={() => {
            if (inviteEmail.trim()) {
              setPendingInvitations([...pendingInvitations, { id: `inv${Date.now()}`, email: inviteEmail.trim(), role: inviteRole, invitedAt: new Date().toISOString().slice(0, 10) }])
              setShowInvite(false)
              setInviteEmail("")
              setInviteRole("member")
            }
          }}>Send invitation</Button>
        </div>
      </Drawer>
    </div>
  );
}
