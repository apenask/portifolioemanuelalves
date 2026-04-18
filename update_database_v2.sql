-- 1. Adicionar novas colunas na tabela de rifas
ALTER TABLE public.raffles ADD COLUMN IF NOT EXISTS pix_receiver_name text;
ALTER TABLE public.raffles ADD COLUMN IF NOT EXISTS pix_key text;

-- 2. Adicionar colunas para agrupar compras e cidade
ALTER TABLE public.raffle_tickets ADD COLUMN IF NOT EXISTS purchase_id uuid;
ALTER TABLE public.raffle_tickets ADD COLUMN IF NOT EXISTS city text;

-- 3. Garantir que as políticas de DELETE existam para todas as tabelas (Correção do bug de exclusão)
-- Se as políticas já existirem, o Postgres pode dar um aviso, mas continuará.

DO $$ 
BEGIN
    -- athlete_profile
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on athlete_profile') THEN
        CREATE POLICY "Allow authenticated delete on athlete_profile" ON public.athlete_profile FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
    
    -- athlete_stats
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on athlete_stats') THEN
        CREATE POLICY "Allow authenticated delete on athlete_stats" ON public.athlete_stats FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- timeline_items
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on timeline_items') THEN
        CREATE POLICY "Allow authenticated delete on timeline_items" ON public.timeline_items FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- achievements
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on achievements') THEN
        CREATE POLICY "Allow authenticated delete on achievements" ON public.achievements FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- gallery_categories
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on gallery_categories') THEN
        CREATE POLICY "Allow authenticated delete on gallery_categories" ON public.gallery_categories FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- gallery
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on gallery') THEN
        CREATE POLICY "Allow authenticated delete on gallery" ON public.gallery FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- sponsors
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on sponsors') THEN
        CREATE POLICY "Allow authenticated delete on sponsors" ON public.sponsors FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- support_section
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on support_section') THEN
        CREATE POLICY "Allow authenticated delete on support_section" ON public.support_section FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- raffles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on raffles') THEN
        CREATE POLICY "Allow authenticated delete on raffles" ON public.raffles FOR DELETE USING (auth.role() = 'authenticated');
    END IF;

    -- raffle_tickets
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated delete on raffle_tickets') THEN
        CREATE POLICY "Allow authenticated delete on raffle_tickets" ON public.raffle_tickets FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END $$;
