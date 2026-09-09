-- ========================================================
-- Supabase Schema Migration: Lokers! MVP (Consolidated)
-- ========================================================

-- Drop types if they exist to allow re-running easily
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS job_source CASCADE;
DROP TYPE IF EXISTS alert_frequency CASCADE;
DROP TYPE IF EXISTS plan_id CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS scraping_status CASCADE;

-- 1. Custom Types
CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'admin');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship', 'remote');
CREATE TYPE job_source AS ENUM ('linkedin', 'indeed', 'glints', 'jobstreet', 'manual', 'employer');
CREATE TYPE alert_frequency AS ENUM ('daily', 'weekly');
CREATE TYPE plan_id AS ENUM ('free', 'job_seeker_premium', 'employer_basic', 'employer_pro');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due');
CREATE TYPE scraping_status AS ENUM ('success', 'failed', 'partial');

-- 2. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'job_seeker',
    headline TEXT,
    summary TEXT,
    location TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Privacy Policy pada Profiles (Hanya Pemilik & Admin yang dapat akses PII)
CREATE POLICY "Public profiles basic read" 
ON public.profiles FOR SELECT 
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 3. Jobs Table
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source job_source NOT NULL DEFAULT 'manual',
    source_id TEXT,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_logo_url TEXT,
    location TEXT NOT NULL,
    job_type job_type NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency TEXT DEFAULT 'IDR',
    description TEXT NOT NULL,
    requirements TEXT,
    posted_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    apply_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_job_source UNIQUE (source, source_id)
);

-- Tambah Full-Text Search (FTS) Indexing untuk Lowongan
ALTER TABLE public.jobs ADD COLUMN fts tsvector 
GENERATED ALWAYS AS (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(company_name, '') || ' ' || coalesce(description, ''))
) STORED;

CREATE INDEX idx_jobs_fts ON public.jobs USING gin(fts);
CREATE INDEX idx_jobs_search_filter ON public.jobs (is_active, job_type, posted_date DESC);
CREATE INDEX idx_jobs_location ON public.jobs USING gin (to_tsvector('simple', location));

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone."
    ON public.jobs FOR SELECT
    USING (is_active = true OR auth.uid() = created_by OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Employers and Admins can insert jobs."
    ON public.jobs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND (role = 'employer' OR role = 'admin')
        )
    );

CREATE POLICY "Employers and Admins can update jobs."
    ON public.jobs FOR UPDATE
    USING (auth.uid() = created_by OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 4. CVs Table
CREATE TABLE public.cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    data JSONB NOT NULL DEFAULT '{}',
    raw_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own CVs." ON public.cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own CVs." ON public.cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own CVs." ON public.cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own CVs." ON public.cvs FOR DELETE USING (auth.uid() = user_id);

-- 5. Cover Letters Table
CREATE TABLE public.cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    cv_id UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own cover letters." ON public.cover_letters FOR ALL USING (auth.uid() = user_id);

-- 6. Bookmarks Table
CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own bookmarks." ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- 7. Job Alerts Table
CREATE TABLE public.job_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    location TEXT,
    job_type job_type,
    frequency alert_frequency NOT NULL DEFAULT 'weekly',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own job alerts." ON public.job_alerts FOR ALL USING (auth.uid() = user_id);

-- 8. Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id plan_id NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    payment_provider TEXT,
    provider_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions." ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 9. Scraping Logs Table
CREATE TABLE public.scraping_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    status scraping_status NOT NULL,
    jobs_found INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ
);

ALTER TABLE public.scraping_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view scraping logs." ON public.scraping_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 10. Triggers and Functions
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  extracted_name TEXT;
BEGIN
  -- Fallback untuk nama pengguna jika metadata kosong
  extracted_name := COALESCE(
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'name', 
    split_part(new.email, '@', 1)
  );

  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.email, 
    extracted_name, 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role'), 'job_seeker')::user_role
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert free subscription by default
  INSERT INTO public.subscriptions (user_id, plan_id, status, current_period_end)
  VALUES (new.id, 'free'::plan_id, 'active'::subscription_status, NOW() + INTERVAL '100 years')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_cvs_updated_at ON public.cvs;
CREATE TRIGGER update_cvs_updated_at BEFORE UPDATE ON public.cvs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_cover_letters_updated_at ON public.cover_letters;
CREATE TRIGGER update_cover_letters_updated_at BEFORE UPDATE ON public.cover_letters FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_job_alerts_updated_at ON public.job_alerts;
CREATE TRIGGER update_job_alerts_updated_at BEFORE UPDATE ON public.job_alerts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
