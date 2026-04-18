-- Create tables
CREATE TABLE athlete_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  short_title TEXT,
  hero_description TEXT,
  full_bio TEXT,
  main_image_url TEXT,
  secondary_image_url TEXT,
  team_name TEXT,
  belt TEXT,
  city TEXT,
  state TEXT,
  category TEXT,
  stats_championships INTEGER DEFAULT 0,
  stats_medals INTEGER DEFAULT 0,
  stats_titles INTEGER DEFAULT 0,
  stats_years INTEGER DEFAULT 0,
  whatsapp_number TEXT,
  contact_email TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT,
  event_date TEXT,
  category TEXT,
  weight_class TEXT,
  medal TEXT,
  result TEXT,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT,
  category TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  external_link TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial mock data for athlete_profile
INSERT INTO athlete_profile (
  full_name, short_title, full_bio, main_image_url, secondary_image_url,
  team_name, belt, city, state, category, stats_championships, stats_medals, stats_titles, stats_years,
  whatsapp_number, contact_email, instagram_url
) VALUES (
  'Lucas Silva',
  'Atleta de Jiu-Jitsu | Competidor | Representante de Pernambuco',
  'Nascido e criado no tatame, dedico minha vida ao Jiu-Jitsu. Minha jornada é marcada por disciplina, resiliência e a busca incessante pela evolução. Represento minha equipe e meu estado com orgulho em cada competição, sempre buscando o lugar mais alto do pódio.',
  'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1564415315949-27bdc40b0530?q=80&w=2070&auto=format&fit=crop',
  'Equipe Nova União',
  'Faixa Preta',
  'Recife',
  'PE',
  'Adulto',
  45, 38, 12, 10,
  '5581999999999',
  'contato@lucassilvajj.com',
  'https://instagram.com'
);

-- Insert initial achievements
INSERT INTO achievements (title, location, event_date, category, weight_class, medal, result, description, image_url, display_order, is_featured) VALUES
('Campeonato Mundial IBJJF', 'Long Beach, CA', '2023', 'Adulto', 'Meio-Pesado', 'gold', 'Campeão', 'Conquista do título mundial após 5 lutas duríssimas.', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070&auto=format&fit=crop', 1, true),
('Pan Americano', 'Kissimmee, FL', '2022', 'Adulto', 'Meio-Pesado', 'silver', 'Vice-Campeão', '', null, 2, true),
('Brasileiro CBJJ', 'Barueri, SP', '2021', 'Adulto', 'Meio-Pesado', 'gold', 'Campeão', '', null, 3, true);

-- Insert initial sponsors
INSERT INTO sponsors (name, description, logo_url, external_link, display_order) VALUES
('A2 Academia', 'Centro de treinamento oficial e preparação física.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', 'https://instagram.com', 1),
('Bolsa Atleta Pernambuco', 'Programa de incentivo ao esporte do Governo de Pernambuco.', 'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop', null, 2);

-- Insert initial gallery
INSERT INTO gallery (caption, category, image_url, display_order) VALUES
('Final do Mundial', 'competicao', 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2070&auto=format&fit=crop', 1),
('Treino duro', 'treino', 'https://images.unsplash.com/photo-1564415315949-27bdc40b0530?q=80&w=2070&auto=format&fit=crop', 2),
('Pódio Brasileiro', 'podio', 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop', 3),
('Preparação física', 'bastidores', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop', 4);

-- Set up Row Level Security (RLS)
ALTER TABLE athlete_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on athlete_profile" ON athlete_profile FOR SELECT USING (true);
CREATE POLICY "Allow public read access on achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Allow public read access on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access on sponsors" ON sponsors FOR SELECT USING (true);

-- Allow authenticated users to modify
CREATE POLICY "Allow authenticated full access on athlete_profile" ON athlete_profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on achievements" ON achievements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on sponsors" ON sponsors FOR ALL USING (auth.role() = 'authenticated');

-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('athlete', 'athlete', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('achievements', 'achievements', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('sponsors', 'sponsors', true);

-- Allow public read access to buckets
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('athlete', 'achievements', 'gallery', 'sponsors'));

-- Allow authenticated users to upload to buckets
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
