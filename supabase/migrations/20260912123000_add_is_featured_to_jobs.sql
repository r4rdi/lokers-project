-- Migration to add is_featured column to jobs table
ALTER TABLE public.jobs ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;

-- Add an index to speed up sorting by is_featured
CREATE INDEX idx_jobs_is_featured ON public.jobs (is_featured DESC, posted_date DESC);
