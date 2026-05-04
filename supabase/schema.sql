-- Reimburse SaaS Database Schema
-- Run this in your Supabase SQL editor

-- Organizations
create table public.orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('submitter', 'approver')) default 'submitter',
  org_id uuid references public.orgs(id) on delete set null,
  created_at timestamptz default now()
);

-- Reports (expense reports)
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.orgs(id) on delete cascade,
  submitter_id uuid references auth.users(id) on delete cascade,
  approver_id uuid references auth.users(id) on delete set null,
  title text not null,
  status text not null check (status in ('draft', 'submitted', 'approved', 'rejected')) default 'draft',
  total_amount numeric(12, 2) default 0,
  currency text not null default 'NOK',
  output_currency text not null default 'NOK',
  submitted_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz default now()
);

-- Report items (receipts/line items)
create table public.report_items (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete cascade,
  category text not null,
  original_amount numeric(12, 2) not null,
  original_currency text not null default 'NOK',
  converted_amount numeric(12, 2),
  fx_rate numeric(18, 8),
  description text,
  receipt_url text,
  receipt_image_url text,
  date date not null default current_date,
  created_at timestamptz default now()
);

-- Identities (user profile data for PDF)
create table public.identities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  full_name text,
  address text,
  postal_code text,
  place text,
  country text,
  phone text,
  email text,
  bank_name text,
  bank_account text,
  iban text,
  bic_swift text,
  signature_url text,
  updated_at timestamptz default now()
);

-- Indexes
create index idx_reports_submitter on public.reports(submitter_id);
create index idx_reports_approver on public.reports(approver_id);
create index idx_reports_org on public.reports(org_id);
create index idx_reports_status on public.reports(status);
create index idx_report_items_report on public.report_items(report_id);

-- Row Level Security
alter table public.orgs enable row level security;
alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.report_items enable row level security;
alter table public.identities enable row level security;

-- Profiles: users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Reports: submitters can CRUD their own drafts, approvers can read all in org
create policy "Submitters can view own reports"
  on public.reports for select
  using (auth.uid() = submitter_id);

create policy "Submitters can insert own reports"
  on public.reports for insert
  with check (auth.uid() = submitter_id);

create policy "Submitters can update own draft reports"
  on public.reports for update
  using (auth.uid() = submitter_id and status = 'draft');

create policy "Approvers can view org reports"
  on public.reports for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'approver'
      and profiles.org_id = reports.org_id
    )
  );

create policy "Approvers can update submitted reports"
  on public.reports for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role = 'approver'
      and profiles.org_id = reports.org_id
    )
  );

-- Report items: owner report access
create policy "View report items"
  on public.report_items for select
  using (
    exists (
      select 1 from public.reports
      where reports.id = report_items.report_id
      and (reports.submitter_id = auth.uid()
        or exists (
          select 1 from public.profiles
          where profiles.id = auth.uid()
          and profiles.role = 'approver'
          and profiles.org_id = reports.org_id
        )
      )
    )
  );

create policy "Insert report items"
  on public.report_items for insert
  with check (
    exists (
      select 1 from public.reports
      where reports.id = report_items.report_id
      and reports.submitter_id = auth.uid()
      and reports.status = 'draft'
    )
  );

create policy "Update report items"
  on public.report_items for update
  using (
    exists (
      select 1 from public.reports
      where reports.id = report_items.report_id
      and reports.submitter_id = auth.uid()
      and reports.status = 'draft'
    )
  );

create policy "Delete report items"
  on public.report_items for delete
  using (
    exists (
      select 1 from public.reports
      where reports.id = report_items.report_id
      and reports.submitter_id = auth.uid()
      and reports.status = 'draft'
    )
  );

-- Identities
create policy "Users can view own identity"
  on public.identities for select
  using (auth.uid() = user_id);

create policy "Users can insert own identity"
  on public.identities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own identity"
  on public.identities for update
  using (auth.uid() = user_id);
