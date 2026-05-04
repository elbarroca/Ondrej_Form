"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { MOCK_TEAM_MEMBERS, MOCK_PENDING_INVITATIONS } from "@/lib/auth/mockData";
import type { TeamMember, PendingInvitation, UserRole } from "@/lib/auth/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  approver: "Approver",
  member: "Member",
  receiver: "Receiver",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  approver: "bg-blue-100 text-blue-700 border-blue-200",
  member: "bg-muted text-muted-foreground",
  receiver: "bg-green-100 text-green-700 border-green-200",
};

export default function TeamPage() {
  const { user, isAdmin } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>(MOCK_PENDING_INVITATIONS);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("member");
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("member");

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your organization team</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <p className="text-sm font-medium">Access denied</p>
            <p className="mt-1 text-xs text-muted-foreground">Only admins can manage the team</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) return;
    const newInvite: PendingInvitation = {
      id: `inv${Date.now()}`,
      email: inviteEmail.trim(),
      role: inviteRole,
      invitedAt: new Date().toISOString().split("T")[0],
    };
    setPendingInvitations(prev => [...prev, newInvite]);
    setInviteEmail("");
    setInviteRole("member");
    setShowInviteDialog(false);
  };

  const handleRevokeInvite = (id: string) => {
    setPendingInvitations(prev => prev.filter(i => i.id !== id));
  };

  const handleChangeRole = () => {
    if (!selectedMember) return;
    setMembers(prev =>
      prev.map(m => m.id === selectedMember.id ? { ...m, role: newRole } : m)
    );
    setShowRoleDialog(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your organization team members</p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-3">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3">
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarImage src={member.id} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={ROLE_COLORS[member.role]}>{ROLE_LABELS[member.role]}</Badge>
                {member.id !== user?.id && (
                  <div className="flex gap-1">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setSelectedMember(member);
                        setNewRole(member.role);
                        setShowRoleDialog(true);
                      }}
                    >
                      Change role
                    </Button>
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations ({pendingInvitations.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-3">
            {pendingInvitations.map(invite => (
              <div key={invite.id} className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3">
                <div>
                  <p className="text-sm font-medium">{invite.email}</p>
                  <p className="text-xs text-muted-foreground">Invited {invite.invitedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={ROLE_COLORS[invite.role]}>{ROLE_LABELS[invite.role]}</Badge>
                  <Button size="xs" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleRevokeInvite(invite.id)}>
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="field">
              <Label>Email</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
              />
            </div>
            <div className="field">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={v => setInviteRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="approver">Approver</SelectItem>
                  <SelectItem value="receiver">Receiver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
            <Button onClick={handleSendInvite} disabled={!inviteEmail.trim()}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
          </DialogHeader>
          <div className="field py-2">
            <Label>New Role</Label>
            <Select value={newRole} onValueChange={v => setNewRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="approver">Approver</SelectItem>
                <SelectItem value="receiver">Receiver</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>Cancel</Button>
            <Button onClick={handleChangeRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
