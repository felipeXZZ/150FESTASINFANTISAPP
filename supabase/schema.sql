create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  nome text,
  plano text not null default 'basico',          -- basico | completo
  primeiro_acesso_em timestamptz default now()
);

create table modulos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  capa_url text,
  contador text,                                  -- ex: "150 projetos"
  url_drive text not null,
  plano_minimo text not null default 'basico',    -- basico | completo
  ordem int default 0,
  ativo boolean default true
);

create table eventos (
  id bigserial primary key,
  user_id uuid not null references auth.users on delete cascade,
  tipo text not null,      -- abriu_modulo | viu_bloqueado | viu_calculadora | clicou_biblioteca
  ref text,
  criado_em timestamptz default now()
);

alter table profiles enable row level security;
alter table eventos  enable row level security;
alter table modulos  enable row level security;

create policy "own profile" on profiles for all    using (auth.uid() = id);
create policy "own eventos" on eventos  for insert with check (auth.uid() = user_id);
create policy "ler modulos" on modulos  for select using (ativo);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create index eventos_user_idx on eventos (user_id, criado_em desc);
create index modulos_ordem_idx on modulos (ordem) where ativo;
