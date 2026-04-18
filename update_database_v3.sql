-- Add new columns for Mercado Pago integration
ALTER TABLE public.raffle_tickets ADD COLUMN IF NOT EXISTS cpf text;
ALTER TABLE public.raffle_tickets ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE public.raffle_tickets ADD COLUMN IF NOT EXISTS payment_status text;
ALTER TABLE public.raffle_tickets ADD COLUMN IF NOT EXISTS external_reference text;
