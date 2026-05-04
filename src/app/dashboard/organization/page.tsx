"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BuildingIcon, CreditCardIcon, UploadIcon } from "lucide-react";

const PLAN_DETAILS = {
  free: { label: "Free", desc: "3 reports per month", color: "neutral" as const },
  payg: { label: "Pay as you go", desc: "€2.50 per submitted report", color: "brand" as const },
  org: { label: "Organization", desc: "Custom volume pricing", color: "brand" as const },
};

export default function OrganizationPage() {
  const [plan] = useState("payg");
  const [orgName, setOrgName] = useState("Bergen kommune");

  const currentPlan = PLAN_DETAILS[plan as keyof typeof PLAN_DETAILS];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.02em]">Organization</h1>
        <p className="mt-1.5 text-sm text-mute">Manage your organization settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
        {/* Side nav */}
        <div className="flex flex-col gap-0.5">
          {["General", "Plan & billing", "Branding", "Audit log"].map((item) => (
            <button
              key={item}
              type="button"
              className="text-left rounded-lg px-3 py-2 text-[13.5px] text-mute hover:text-ink hover:bg-ink/4 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* General */}
          <div className="rounded-[14px] border border-line bg-white p-6">
            <h3 className="text-[15px] font-semibold mb-1">General</h3>
            <p className="text-[13px] text-mute mb-4">Basic organization information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              <Input
                id="org-name"
                label="Organization name"
                value={orgName}
                onChange={(e) => setOrgName((e.target as HTMLInputElement).value)}
              />
              <Input
                id="org-code"
                label="Short code"
                value="BK"
                disabled
                hint="Used for report references (REI-BK-2026-0042)"
              />
              <Input id="billing-email" label="Billing email" value="finance@bergen.kommune.no" />
              <Input id="vat" label="VAT number" placeholder="Optional" />
            </div>
            <div className="mt-4">
              <Button variant="primary" size="sm">Save changes</Button>
            </div>
          </div>

          {/* Plan */}
          <div className="rounded-[14px] border border-line bg-white p-6">
            <h3 className="text-[15px] font-semibold mb-1">Plan & billing</h3>
            <p className="text-[13px] text-mute mb-4">Current plan and billing information</p>
            <div className="rounded-[14px] border border-line p-5 flex items-start justify-between gap-4 bg-paper/50 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={currentPlan.color}>{currentPlan.label}</Badge>
                </div>
                <p className="text-[13.5px] text-mute">{currentPlan.desc}</p>
              </div>
              <Button variant="ghost" size="sm">Change plan</Button>
            </div>
            <div className="rounded-[14px] border border-line p-5">
              <div className="flex items-center gap-2 mb-3">
                <CreditCardIcon className="size-4 text-mute" />
                <span className="text-sm font-semibold">Current period</span>
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-mute">Reports submitted</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Unit price</span>
                  <span className="font-medium">€2.50</span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 mt-2">
                  <span className="font-semibold">Estimated total</span>
                  <span className="font-semibold">€30.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="rounded-[14px] border border-line bg-white p-6">
            <h3 className="text-[15px] font-semibold mb-1">Branding</h3>
            <p className="text-[13px] text-mute mb-4">Customize your organization logo</p>
            <div className="flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-[14px] bg-gradient-to-br from-amber to-red text-white text-lg font-bold">BK</div>
              <div>
                <Button variant="ghost" size="sm" leftIcon={<UploadIcon className="size-3.5" />}>Upload logo</Button>
                <p className="mt-1 text-[12px] text-mute">PNG or SVG, max 500KB</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
