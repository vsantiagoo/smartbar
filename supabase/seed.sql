-- =====================================================================
-- SmartBar — dados de demonstração (Hotel Aurora Paulista, 12 quartos)
-- Catálogo e preços baseados no Plano de Negócios (hotel de 50 quartos).
-- Rode depois da migration:  supabase db reset   (ou cole no SQL Editor)
-- =====================================================================

insert into public.hotels (id, slug, name, plan, brand)
values (
  '11111111-1111-4111-8111-111111111111', 'hotel-aurora', 'Hotel Aurora Paulista', 'plus',
  '{"primary": "#1B3A6B", "accent": "#F39200"}'
);

-- Produtos ------------------------------------------------------------
insert into public.products (hotel_id, sku, name, description, category, price_cents, cost_cents, icon_key, sort_order) values
  ('11111111-1111-4111-8111-111111111111', 'AGU-SG', 'Água mineral sem gás', '500 ml',            'bebida', 600,  120, 'glass-water', 1),
  ('11111111-1111-4111-8111-111111111111', 'AGU-CG', 'Água mineral com gás', '500 ml',            'bebida', 600,  120, 'glass-water', 2),
  ('11111111-1111-4111-8111-111111111111', 'REF-CO', 'Refrigerante coca cola original','Lata 350 ml','bebida', 900,  310, 'cup-soda',    3),
  ('11111111-1111-4111-8111-111111111111', 'REF-ZE', 'Refrigerante coca cola zero','Lata 350 ml',   'bebida', 900,  310, 'cup-soda',    4),
  ('11111111-1111-4111-8111-111111111111', 'SUC-UV', 'Suco de uva',          'Lata 290 ml',       'bebida', 950,  340, 'grape',       5),
  ('11111111-1111-4111-8111-111111111111', 'AMD-50', 'Amendoim torrado',     'Pacote 50 g',       'snack',  800,  220, 'nut',         6),
  ('11111111-1111-4111-8111-111111111111', 'BAR-CE', 'Barra de cereal',      'Castanhas e mel',   'snack',  500,  150, 'wheat',       8),
  ('11111111-1111-4111-8111-111111111111', 'BAT-PT', 'Batata chips',         '35 g',              'snack',  1400, 480, 'popcorn',     9);

-- Quartos (QR: /h/hotel-aurora/q/aurora-101) ---------------------------
insert into public.rooms (hotel_id, number, floor, qr_token, device_id, device_online, device_last_seen_at)
select '11111111-1111-4111-8111-111111111111', n::text, (n / 100), 'aurora-' || n, 'esp32-aurora-' || n, (n % 7 <> 0), now()
from unnest(array[101,102,103,104,201,202,203,204,301,302,303,304]) as n;

-- Estoque por quarto (par_level conforme o Plano de Negócios) ----------
insert into public.inventory (room_id, product_id, quantity, par_level, min_level)
select r.id, p.id,
       case when abs(hashtext(r.number || p.sku)) % 20 < 13 then par.v                       -- maioria em dia
            when abs(hashtext(r.number || p.sku)) % 20 < 19 then greatest(par.v - (case when par.v >= 2 then 1 else 0 end), 0)
            else 0 end,                                                                -- poucos esgotados
       par.v,
       case when par.v >= 3 then 1 else 0 end
from public.rooms r
join public.products p on p.hotel_id = r.hotel_id
cross join lateral (
  select case p.sku
    when 'AGU-SG' then 2 when 'AGU-CG' then 2
    when 'REF-CO' then 2 when 'REF-ZE' then 2
    when 'SUC-UV' then 3
    when 'AMD-50' then 2
    when 'BAR-CE' then 2 when 'BAT-PT' then 1
  end as v
) par;

-- Estadias ativas com cartão RFID -------------------------------------
insert into public.stays (hotel_id, room_id, guest_name, rfid_uid)
select r.hotel_id, r.id, g.name, g.uid
from public.rooms r
join (values
  ('101', 'Mariana Souza',     'A1B2C3D4'),
  ('102', 'Carlos Ferreira',   'B2C3D4E5'),
  ('103', 'Beatriz Lima',      'C3D4E5F6'),
  ('201', 'Rafael Nogueira',   'D4E5F6A7'),
  ('202', 'Helena Duarte',     'E5F6A7B8'),
  ('301', 'Pedro Albuquerque', 'F6A7B8C9'),
  ('302', 'Juliana Prado',     'A7B8C9D0')
) as g(number, name, uid) on g.number = r.number
where r.hotel_id = '11111111-1111-4111-8111-111111111111';

-- Acesso da equipe --------------------------------------------------
-- 1) Crie o usuário em Authentication > Users (e-mail + senha).
-- 2) Vincule ao hotel (troque o e-mail):
--
-- insert into public.hotel_members (user_id, hotel_id, role)
-- select id, '11111111-1111-4111-8111-111111111111', 'owner'
-- from auth.users where email = 'recepcao@hotelaurora.com.br';
