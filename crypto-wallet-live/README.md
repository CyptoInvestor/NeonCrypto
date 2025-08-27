
# Crypto Wallet — Live (Supabase-backed, httpOnly sessions)

This project is a production-ready live website scaffold using **Next.js** and **Supabase**.

## Features
- Supabase Auth handles registration, email verification, password reset (configure SMTP in Supabase).
- After a successful sign-in, the client sends the Supabase access token to `/api/auth/session` which sets an httpOnly cookie `sb_access_token` (secure, httpOnly).
- Server API routes read `sb_access_token` cookie and call Supabase Admin (`service_role` key) to identify user and manage wallets.
- Wallets are stored in a Postgres table `wallets` with JSON columns for BTC/ETH/USDT.
- No trading, no prices, no order history — only wallet management UI (set address / receive / send balances).

## Supabase DB setup
1. Create a Supabase project.
2. In SQL editor run the migration:
```sql
create extension if not exists "uuid-ossp";

create table wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  btc jsonb not null default '{"balance":0.0,"address":""}',
  eth jsonb not null default '{"balance":0.0,"address":""}',
  usdt jsonb not null default '{"balance":0.0,"address":""}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create a wallet row automatically when a user signs up (optional trigger)
create function public.create_wallet_for_new_user() returns trigger as $$
begin
  insert into wallets (user_id, btc, eth, usdt) values (new.id, '{"balance":0,"address":""}', '{"balance":0,"address":""}', '{"balance":0,"address":""}');
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_wallet_for_new_user();
```

## Environment variables (Vercel / local)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_URL (same as NEXT_PUBLIC_SUPABASE_URL)
- SUPABASE_SERVICE_ROLE_KEY (service_role key, keep secret)

## Deployment (Vercel)
1. Push repo to GitHub.
2. Import project into Vercel.
3. Set the env vars above in Vercel project settings.
4. Deploy.

## Security notes
- Keep `SUPABASE_SERVICE_ROLE_KEY` only in server-side envs (Vercel secrets).
- Use RLS policies to restrict direct DB access if enabling client-side DB queries.
- Using httpOnly cookies for sessions reduces XSS risk. Consider CSRF protections if you add non-idempotent endpoints consumed by browsers.
