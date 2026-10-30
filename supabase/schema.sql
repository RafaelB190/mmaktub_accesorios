-- ============================================================
--  Maktub Accesorios · esquema para Supabase
--  Ejecutá este archivo completo en el SQL Editor de Supabase.
--  No requiere cambios: las tablas, permisos y el bucket quedan listos.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Productos ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price integer not null check (price >= 0),
  compare_at_price integer check (
    compare_at_price is null or compare_at_price > price
  ),
  category text not null check (
    category in ('collares', 'pulseras', 'combitos', 'aritos', 'mimos')
  ),
  images text[] not null default '{}',
  stock integer not null default 1 check (stock >= 0),
  featured boolean not null default false,
  active boolean not null default true,
  materials text,
  created_at timestamptz not null default now()
);

create index if not exists products_active_idx
  on public.products (active, created_at desc);
create index if not exists products_category_idx
  on public.products (category);

-- ---------- Eventos ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  location text not null,
  address text,
  maps_url text,
  image text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx
  on public.events (starts_at);

-- ---------- Pedidos ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  email text not null,
  phone text not null,
  shipping_method text not null check (shipping_method in ('envio', 'retiro')),
  address text,
  city text,
  notes text,
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  subtotal integer not null check (subtotal >= 0),
  shipping_cost integer not null default 0 check (shipping_cost >= 0),
  total integer not null check (total >= 0),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'cancelled', 'refunded')
  ),
  payment_id text,
  preference_id text,
  stock_decremented boolean not null default false
);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);
create index if not exists orders_status_idx
  on public.orders (status);

-- ---------- Seguridad ----------
-- La web accede solo desde el servidor con la service role key (que ignora RLS).
-- Dejamos RLS activo y sin políticas públicas: nadie puede leer datos con la
-- anon key aunque la conozca.
alter table public.products enable row level security;
alter table public.events enable row level security;
alter table public.orders enable row level security;

-- ---------- Descuento de stock atómico ----------
create or replace function public.decrement_stock(
  p_product_id uuid,
  p_quantity integer
)
returns void
language sql
security definer
set search_path = public
as $$
  update public.products
  set stock = greatest(0, stock - greatest(0, p_quantity))
  where id = p_product_id;
$$;

revoke all on function public.decrement_stock(uuid, integer) from public;
revoke all on function public.decrement_stock(uuid, integer) from anon;
revoke all on function public.decrement_stock(uuid, integer) from authenticated;
grant execute on function public.decrement_stock(uuid, integer) to service_role;

-- ---------- Storage para imágenes ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Maktub media public read" on storage.objects;
create policy "Maktub media public read"
  on storage.objects
  for select
  using (bucket_id = 'media');

-- La subida se hace desde el servidor con la service role key, por eso no
-- creamos políticas de escritura públicas.
