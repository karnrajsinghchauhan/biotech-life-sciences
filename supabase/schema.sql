-- ============================================================
-- BIOTECH LIFE SCIENCES — database schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
--
-- SECURITY MODEL
--   · Public (anon) may READ published catalogue/batch data only.
--   · Public may NOT read enquiries — those contain personal data.
--   · Inserts of enquiries go through the server using the service
--     role, so the anon key cannot be used to spam or read the table.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- catalogue ----------
create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  sku           text unique not null,
  code          text,                         -- vial code, e.g. RT10
  name          text not null,
  alt_name      text,
  compound_type text not null,
  category      text not null,
  overview      text,
  purity        text,
  form          text,
  storage       text,
  stability     text,
  solubility    text,
  image_url     text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists products_category_idx on products (category);

create table if not exists product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  size_label text not null,                   -- "10 mg", "5 IU"
  price_inr  integer,                         -- null until pricing is set
  in_stock   boolean not null default true,
  created_at timestamptz not null default now(),
  unique (product_id, size_label)
);
create index if not exists variants_product_idx on product_variants (product_id);

-- ---------- batch documentation ----------
create table if not exists batches (
  id                 uuid primary key default gen_random_uuid(),
  product_id         uuid not null references products (id) on delete cascade,
  batch_number       text not null unique,
  manufacturing_date date,
  testing_date       date,
  laboratory_name    text,
  -- accreditation is a checkable claim: leave null unless the certificate is held
  lab_accreditation  text,
  lab_accred_number  text,
  report_number      text,
  status             text not null default 'released'
                     check (status in ('released', 'superseded', 'withdrawn')),
  is_published       boolean not null default false,
  created_at         timestamptz not null default now()
);
create index if not exists batches_number_idx on batches (lower(batch_number));

-- One row per tested parameter. A parameter that was NOT tested simply has
-- result_value null, and the UI prints "Not reported". Never invent a value.
create table if not exists batch_results (
  id           uuid primary key default gen_random_uuid(),
  batch_id     uuid not null references batches (id) on delete cascade,
  parameter    text not null,                 -- 'Purity', 'Identity', ...
  result_value text,                          -- null => not reported
  method       text,                          -- 'RP-HPLC, 220 nm'
  created_at   timestamptz not null default now()
);
create index if not exists batch_results_batch_idx on batch_results (batch_id);

create table if not exists coa_documents (
  id         uuid primary key default gen_random_uuid(),
  batch_id   uuid not null references batches (id) on delete cascade,
  file_url   text not null,
  file_name  text,
  created_at timestamptz not null default now()
);

-- ---------- enquiries (personal data) ----------
create table if not exists inquiries (
  id           uuid primary key default gen_random_uuid(),
  type         text not null default 'contact'
               check (type in ('contact', 'wholesale', 'custom_request')),
  name         text not null,
  email        text not null,
  company      text,
  country      text,
  product      text,
  quantity     text,
  message      text,
  order_ref    text,
  source_ip    text,                          -- coarse, for rate limiting only
  synced_to_sheets boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists inquiries_created_idx on inquiries (created_at desc);
create index if not exists inquiries_sync_idx on inquiries (synced_to_sheets) where synced_to_sheets = false;

create table if not exists newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table products               enable row level security;
alter table product_variants       enable row level security;
alter table batches                enable row level security;
alter table batch_results          enable row level security;
alter table coa_documents          enable row level security;
alter table inquiries              enable row level security;
alter table newsletter_subscribers enable row level security;

-- Public may read published catalogue data.
drop policy if exists "public reads published products" on products;
create policy "public reads published products"
  on products for select to anon, authenticated
  using (is_published);

drop policy if exists "public reads variants" on product_variants;
create policy "public reads variants"
  on product_variants for select to anon, authenticated
  using (exists (select 1 from products p where p.id = product_id and p.is_published));

-- Public may read only PUBLISHED batches, so an unpublished draft can never
-- be surfaced by the verification tool.
drop policy if exists "public reads published batches" on batches;
create policy "public reads published batches"
  on batches for select to anon, authenticated
  using (is_published);

drop policy if exists "public reads results of published batches" on batch_results;
create policy "public reads results of published batches"
  on batch_results for select to anon, authenticated
  using (exists (select 1 from batches b where b.id = batch_id and b.is_published));

drop policy if exists "public reads coas of published batches" on coa_documents;
create policy "public reads coas of published batches"
  on coa_documents for select to anon, authenticated
  using (exists (select 1 from batches b where b.id = batch_id and b.is_published));

-- Enquiries: NO anon policy at all. With RLS enabled and no policy, the anon
-- key can neither read nor write. Inserts happen server-side via the service
-- role, which bypasses RLS. This prevents both scraping and direct spam.
-- (Deliberately no policy created for `inquiries`.)

-- Newsletter: same posture — server-side insert only.
-- (Deliberately no anon policy for `newsletter_subscribers`.)

-- ---------- convenience view for batch verification ----------
create or replace view public_batch_lookup as
select
  b.batch_number,
  b.testing_date,
  b.manufacturing_date,
  b.laboratory_name,
  b.lab_accreditation,
  b.report_number,
  b.status,
  p.name  as product_name,
  p.sku   as product_sku,
  p.slug  as product_slug
from batches b
join products p on p.id = b.product_id
where b.is_published;
