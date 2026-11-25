-- =============================================================
-- Mentoria Regis-dência — schema de candidaturas
-- Rode este script no SQL Editor do Supabase.
-- =============================================================

create extension if not exists pgcrypto;

-- Candidaturas vindas do formulário público
create table if not exists public.candidaturas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  nome text not null check (char_length(nome) between 3 and 120),
  whatsapp text not null check (char_length(regexp_replace(whatsapp, '[^0-9]', '', 'g')) between 8 and 15),
  email text,
  situacao text not null,
  situacao_outra text,
  provas jsonb not null default '[]',
  dificuldade text not null check (char_length(dificuldade) between 3 and 1200),
  codigo text,                 -- ref manual / cupom
  ref text,
  cupom text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  lgpd boolean not null default false,

  status text not null default 'novo'
    check (status in ('novo','contato_iniciado','em_atendimento','matriculado','nao_convertido')),
  obs text,

  dedup_key text unique,
  email_channel jsonb,         -- { status, attempts, lastAttempt, detail }
  telegram_channel jsonb
);

create index if not exists idx_candidaturas_status on public.candidaturas (status);
create index if not exists idx_candidaturas_created on public.candidaturas (created_at desc);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_candidaturas_updated_at on public.candidaturas;
create trigger trg_candidaturas_updated_at
  before update on public.candidaturas
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- RLS: a API pública usa a service role (server) que ignora RLS.
-- O painel admin autenticado (Supabase Auth) só lê/atualiza.
-- O cliente público (anon key) NÃO consegue nada em candidaturas.
-- ------------------------------------------------------------
alter table public.candidaturas enable row level security;

-- Painel admin autenticado: leitura e atualização
create policy candidaturas_admin_read
  on public.candidaturas for select
  using (auth.role() = 'authenticated');

create policy candidaturas_admin_update
  on public.candidaturas for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Bloqueio explícito do anon (defensive, mesmo sem policy permitida)
create policy candidaturas_anon_blocked
  on public.candidaturas for select
  using (false);

-- ------------------------------------------------------------
-- Opcional (recomendado): log de auditoria de mudanças de status
-- ------------------------------------------------------------
create table if not exists public.candidaturas_historico (
  id bigint generated always as identity primary key,
  candidatura_id uuid not null references public.candidaturas(id) on delete cascade,
  de_status text,
  para_status text not null,
  obs text,
  at timestamptz not null default now()
);

create or replace function public.log_status_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status then
    insert into public.candidaturas_historico (candidatura_id, de_status, para_status, obs)
    values (new.id, old.status, new.status, new.obs);
  end if;
  return new;
end $$;

drop trigger if exists trg_candidaturas_log_status on public.candidaturas;
create trigger trg_candidaturas_log_status
  after update on public.candidaturas
  for each row execute function public.log_status_change();
