-- =====================================================================
-- SmartBar — schema inicial (Supabase / PostgreSQL)
--
-- Princípios
--   1. O banco é a ÚNICA fonte de verdade do inventário.
--   2. O estoque só é abatido em smartbar_authorize_transaction(), de forma
--      atômica, no instante em que o pagamento (Pix) ou a identidade (RFID)
--      é validado. Nada de abater estoque no front.
--   3. Hóspede é anônimo: NÃO tem acesso direto às tabelas. Todo acesso do
--      Web App do Hóspede passa por rotas de servidor (service_role).
--   4. Equipe do hotel acessa via Supabase Auth + RLS (hotel_members).
-- =====================================================================

-- gen_random_uuid() é nativo (PG13+); nenhuma extensão necessária.

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
create type public.payment_method     as enum ('pix', 'room_charge');
create type public.transaction_status as enum ('pending', 'authorized', 'failed', 'expired', 'cancelled');
create type public.stay_status        as enum ('active', 'checked_out');
create type public.member_role        as enum ('owner', 'manager', 'reception', 'housekeeping');
create type public.plan_tier          as enum ('basic', 'plus', 'premium');

-- ---------------------------------------------------------------------
-- hotels
-- ---------------------------------------------------------------------
create table public.hotels (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name         text not null,
  timezone     text not null default 'America/Sao_Paulo',
  plan         public.plan_tier not null default 'plus',
  -- Whitelabel (plano Premium): { "primary": "#1B3A6B", "accent": "#F39200", "logo_url": "..." }
  brand        jsonb not null default '{}'::jsonb,
  -- Conta do gateway Pix (Asaas / Mercado Pago) do hotel para split
  pix_provider text,
  pix_account  text,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- rooms  (1 quarto = 1 QR Code = 1 módulo de trava ESP32)
-- ---------------------------------------------------------------------
create table public.rooms (
  id                  uuid primary key default gen_random_uuid(),
  hotel_id            uuid not null references public.hotels(id) on delete cascade,
  number              text not null,
  floor               int,
  qr_token            text not null unique,      -- vai na URL do QR: /h/{slug}/q/{qr_token}
  device_id           text unique,               -- identificador do ESP32
  device_online       boolean not null default false,
  device_last_seen_at timestamptz,
  lock_state          text not null default 'locked' check (lock_state in ('locked', 'unlocked')),
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  unique (hotel_id, number)
);
create index rooms_hotel_idx on public.rooms(hotel_id);

-- ---------------------------------------------------------------------
-- products  (catálogo do hotel)
-- ---------------------------------------------------------------------
create table public.products (
  id          uuid primary key default gen_random_uuid(),
  hotel_id    uuid not null references public.hotels(id) on delete cascade,
  sku         text,
  name        text not null,
  description text,
  category    text not null default 'snack',     -- bebida | snack | ...
  price_cents int  not null check (price_cents > 0),
  cost_cents  int  check (cost_cents >= 0),
  icon_key    text not null default 'package',   -- ícone da vitrine (lucide)
  image_url   text,
  is_active   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
create index products_hotel_idx on public.products(hotel_id);

-- ---------------------------------------------------------------------
-- inventory  (estoque POR QUARTO)
-- ---------------------------------------------------------------------
create table public.inventory (
  room_id    uuid not null references public.rooms(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity   int not null default 0 check (quantity >= 0),   -- nunca negativo
  par_level  int not null default 4 check (par_level >= 0),  -- quanto o quarto deve ter ao ser reposto
  min_level  int not null default 1 check (min_level >= 0),  -- a partir daqui pede reposição
  updated_at timestamptz not null default now(),
  primary key (room_id, product_id)
);
create index inventory_product_idx on public.inventory(product_id);

-- ---------------------------------------------------------------------
-- stays  (estadia do hóspede — base do "lançar na conta" e do check-out)
-- ---------------------------------------------------------------------
create table public.stays (
  id           uuid primary key default gen_random_uuid(),
  hotel_id     uuid not null references public.hotels(id) on delete cascade,
  room_id      uuid not null references public.rooms(id) on delete cascade,
  guest_name   text not null,
  rfid_uid     text,                              -- UID do cartão-chave RFID
  status       public.stay_status not null default 'active',
  check_in_at  timestamptz not null default now(),
  check_out_at timestamptz
);
create unique index stays_one_active_per_room on public.stays(room_id) where status = 'active';
create index stays_rfid_idx on public.stays(rfid_uid) where status = 'active';

-- ---------------------------------------------------------------------
-- transactions + transaction_items
-- ---------------------------------------------------------------------
create table public.transactions (
  id             uuid primary key default gen_random_uuid(),
  hotel_id       uuid not null references public.hotels(id) on delete cascade,
  room_id        uuid not null references public.rooms(id) on delete cascade,
  stay_id        uuid references public.stays(id) on delete set null,
  -- Token público (não adivinhável) que o hóspede usa para acompanhar o pedido
  public_token   uuid not null unique default gen_random_uuid(),
  method         public.payment_method not null,
  status         public.transaction_status not null default 'pending',
  total_cents    int not null check (total_cents > 0),
  pix_external_id text,
  pix_copy_paste  text,
  expires_at     timestamptz not null default (now() + interval '10 minutes'),
  authorized_at  timestamptz,
  authorized_by  text check (authorized_by in ('pix_webhook', 'rfid')),
  failure_reason text,
  created_at     timestamptz not null default now()
);
create index transactions_hotel_created_idx on public.transactions(hotel_id, created_at desc);
create index transactions_room_idx on public.transactions(room_id, created_at desc);
create index transactions_pending_room_idx on public.transactions(room_id) where status = 'pending';

create table public.transaction_items (
  id               uuid primary key default gen_random_uuid(),
  transaction_id   uuid not null references public.transactions(id) on delete cascade,
  product_id       uuid not null references public.products(id),
  product_name     text not null,           -- snapshot: preço/nome no momento da compra
  unit_price_cents int  not null check (unit_price_cents > 0),
  quantity         int  not null check (quantity > 0)
);
create index transaction_items_tx_idx on public.transaction_items(transaction_id);

-- ---------------------------------------------------------------------
-- restock_events  (auditoria da Governança)
-- ---------------------------------------------------------------------
create table public.restock_events (
  id              uuid primary key default gen_random_uuid(),
  hotel_id        uuid not null references public.hotels(id) on delete cascade,
  room_id         uuid not null references public.rooms(id) on delete cascade,
  product_id      uuid not null references public.products(id) on delete cascade,
  quantity_before int not null,
  quantity_after  int not null,
  confirmed_by    uuid references auth.users(id),
  confirmed_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- hotel_members  (quem da equipe acessa qual hotel)
-- ---------------------------------------------------------------------
create table public.hotel_members (
  user_id  uuid not null references auth.users(id) on delete cascade,
  hotel_id uuid not null references public.hotels(id) on delete cascade,
  role     public.member_role not null default 'reception',
  primary key (user_id, hotel_id)
);

-- =====================================================================
-- Funções auxiliares de acesso
-- =====================================================================
create or replace function public.smartbar_is_member(p_hotel_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.hotel_members m
    where m.hotel_id = p_hotel_id and m.user_id = auth.uid()
  );
$$;

-- =====================================================================
-- RPC: autorizar transação (ATÔMICA) — abate estoque e libera a trava
--
-- Chamada por:
--   • webhook do Pix (authorized_by = 'pix_webhook')
--   • endpoint do ESP32 após ler o cartão RFID (authorized_by = 'rfid')
-- Idempotente: webhooks repetidos não abatem estoque duas vezes.
-- =====================================================================
create or replace function public.smartbar_authorize_transaction(
  p_transaction_id uuid,
  p_authorized_by  text
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_tx   public.transactions%rowtype;
  v_item record;
  v_qty  int;
begin
  select * into v_tx from public.transactions where id = p_transaction_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'status', 'not_found');
  end if;

  -- Idempotência
  if v_tx.status = 'authorized' then
    return jsonb_build_object('ok', true, 'status', 'authorized', 'already', true);
  end if;
  if v_tx.status <> 'pending' then
    return jsonb_build_object('ok', false, 'status', v_tx.status::text);
  end if;

  -- Pix pode chegar depois do prazo; room_charge não pode.
  if v_tx.expires_at < now() and v_tx.method = 'room_charge' then
    update public.transactions set status = 'expired' where id = v_tx.id;
    perform realtime.send(jsonb_build_object('status', 'expired'), 'status', 'tx:' || v_tx.public_token, false);
    return jsonb_build_object('ok', false, 'status', 'expired');
  end if;

  -- 1) Confere TODOS os itens (com lock de linha) antes de abater qualquer um
  for v_item in select product_id, quantity from public.transaction_items where transaction_id = v_tx.id loop
    select quantity into v_qty from public.inventory
      where room_id = v_tx.room_id and product_id = v_item.product_id for update;
    if v_qty is null or v_qty < v_item.quantity then
      update public.transactions
        set status = 'failed', failure_reason = 'out_of_stock'
        where id = v_tx.id;
      perform realtime.send(jsonb_build_object('status', 'failed', 'reason', 'out_of_stock'), 'status', 'tx:' || v_tx.public_token, false);
      return jsonb_build_object('ok', false, 'status', 'failed', 'reason', 'out_of_stock');
    end if;
  end loop;

  -- 2) Abate o estoque
  update public.inventory i
     set quantity = i.quantity - ti.quantity, updated_at = now()
    from public.transaction_items ti
   where ti.transaction_id = v_tx.id
     and i.room_id = v_tx.room_id
     and i.product_id = ti.product_id;

  -- 3) Autoriza e registra o comando de destravar
  update public.transactions
     set status = 'authorized', authorized_at = now(), authorized_by = p_authorized_by
   where id = v_tx.id;

  update public.rooms set lock_state = 'unlocked' where id = v_tx.room_id;

  -- 4) Avisa o Web App do hóspede (canal de broadcast público, token não adivinhável)
  perform realtime.send(
    jsonb_build_object('status', 'authorized', 'unlock_seconds', 15),
    'status', 'tx:' || v_tx.public_token, false
  );

  return jsonb_build_object('ok', true, 'status', 'authorized', 'room_id', v_tx.room_id);
end;
$$;

revoke all on function public.smartbar_authorize_transaction(uuid, text) from public, anon, authenticated;
grant execute on function public.smartbar_authorize_transaction(uuid, text) to service_role;

-- =====================================================================
-- RPC: confirmar reposição (Governança)
--   p_product_id NULL = repõe todos os itens abaixo do mínimo do quarto.
--   Respeita RLS: só executa se o usuário for membro do hotel do quarto.
-- =====================================================================
create or replace function public.smartbar_confirm_restock(
  p_room_id    uuid,
  p_product_id uuid default null
)
returns int
language plpgsql security definer set search_path = public
as $$
declare
  v_hotel uuid;
  v_count int := 0;
  v_row   record;
begin
  select hotel_id into v_hotel from public.rooms where id = p_room_id;
  if v_hotel is null or not public.smartbar_is_member(v_hotel) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  for v_row in
    select product_id, quantity, par_level from public.inventory
     where room_id = p_room_id
       and quantity <= min_level
       and (p_product_id is null or product_id = p_product_id)
     for update
  loop
    insert into public.restock_events (hotel_id, room_id, product_id, quantity_before, quantity_after, confirmed_by)
    values (v_hotel, p_room_id, v_row.product_id, v_row.quantity, v_row.par_level, auth.uid());

    update public.inventory
       set quantity = v_row.par_level, updated_at = now()
     where room_id = p_room_id and product_id = v_row.product_id;

    v_count := v_count + 1;
  end loop;

  -- Quarto reabastecido → trava volta a ficar trancada
  update public.rooms set lock_state = 'locked' where id = p_room_id;
  return v_count;
end;
$$;

revoke all on function public.smartbar_confirm_restock(uuid, uuid) from public, anon;
grant execute on function public.smartbar_confirm_restock(uuid, uuid) to authenticated;

-- =====================================================================
-- View: necessidades de reposição (Painel de Governança)
-- =====================================================================
create or replace view public.room_restock_needs
with (security_invoker = on) as
select
  r.hotel_id,
  r.id            as room_id,
  r.number        as room_number,
  r.floor,
  p.id            as product_id,
  p.name          as product_name,
  p.icon_key,
  i.quantity,
  i.min_level,
  i.par_level,
  (i.par_level - i.quantity) as missing
from public.inventory i
join public.rooms    r on r.id = i.room_id
join public.products p on p.id = i.product_id
where i.quantity <= i.min_level and r.is_active and p.is_active;

-- =====================================================================
-- Row Level Security
--   Sem policy para anon => hóspede não lê/escreve nada direto.
--   O servidor usa service_role (ignora RLS) para o fluxo do hóspede.
-- =====================================================================
alter table public.hotels            enable row level security;
alter table public.rooms             enable row level security;
alter table public.products          enable row level security;
alter table public.inventory         enable row level security;
alter table public.stays             enable row level security;
alter table public.transactions      enable row level security;
alter table public.transaction_items enable row level security;
alter table public.restock_events    enable row level security;
alter table public.hotel_members     enable row level security;

create policy hotels_member_read on public.hotels
  for select to authenticated using (public.smartbar_is_member(id));

create policy rooms_member_read on public.rooms
  for select to authenticated using (public.smartbar_is_member(hotel_id));

create policy products_member_all on public.products
  for all to authenticated
  using (public.smartbar_is_member(hotel_id))
  with check (public.smartbar_is_member(hotel_id));

create policy inventory_member_read on public.inventory
  for select to authenticated
  using (exists (select 1 from public.rooms r where r.id = room_id and public.smartbar_is_member(r.hotel_id)));

create policy stays_member_read on public.stays
  for select to authenticated using (public.smartbar_is_member(hotel_id));

create policy transactions_member_read on public.transactions
  for select to authenticated using (public.smartbar_is_member(hotel_id));

create policy transaction_items_member_read on public.transaction_items
  for select to authenticated
  using (exists (select 1 from public.transactions t where t.id = transaction_id and public.smartbar_is_member(t.hotel_id)));

create policy restock_events_member_read on public.restock_events
  for select to authenticated using (public.smartbar_is_member(hotel_id));

create policy members_read_self on public.hotel_members
  for select to authenticated using (user_id = auth.uid());

-- =====================================================================
-- Realtime: o painel admin escuta estas tabelas (respeitando RLS)
-- =====================================================================
alter publication supabase_realtime add table public.transactions;
alter publication supabase_realtime add table public.inventory;
