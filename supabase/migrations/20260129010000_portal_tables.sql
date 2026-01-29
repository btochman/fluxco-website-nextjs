-- Portal Tables Migration for FluxCo Co-founder Project Management
-- Note: Using "portal_projects" to avoid conflict with existing "projects" table (transformer quotes)

-- Fluxer allowlist (co-founders only)
CREATE TABLE IF NOT EXISTS public.fluxer_allowlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Team members (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Portal Projects (phases) - renamed to avoid conflict
CREATE TABLE IF NOT EXISTS public.portal_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  status TEXT DEFAULT 'active',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Portal Tasks
CREATE TABLE IF NOT EXISTS public.portal_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.portal_projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog',
  priority TEXT DEFAULT 'medium',
  owner_id UUID REFERENCES public.team_members(id),
  position INTEGER DEFAULT 0,
  start_date DATE,
  due_date DATE,
  estimated_hours NUMERIC,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Task dependencies
CREATE TABLE IF NOT EXISTS public.portal_task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.portal_tasks(id) ON DELETE CASCADE NOT NULL,
  blocked_by_id UUID REFERENCES public.portal_tasks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(task_id, blocked_by_id)
);

-- Task comments
CREATE TABLE IF NOT EXISTS public.portal_task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.portal_tasks(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.team_members(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all portal tables
ALTER TABLE public.fluxer_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_task_comments ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is a fluxer (co-founder)
CREATE OR REPLACE FUNCTION public.is_fluxer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.fluxer_allowlist
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  OR (SELECT email FROM auth.users WHERE id = auth.uid()) LIKE '%@fluxco.com'
$$;

-- RLS Policies for fluxer_allowlist
CREATE POLICY "Fluxers can view allowlist"
  ON public.fluxer_allowlist FOR SELECT
  USING (public.is_fluxer());

-- RLS Policies for team_members
CREATE POLICY "Fluxers can view all team members"
  ON public.team_members FOR SELECT
  USING (public.is_fluxer());

CREATE POLICY "Fluxers can insert team members"
  ON public.team_members FOR INSERT
  WITH CHECK (public.is_fluxer());

CREATE POLICY "Fluxers can update team members"
  ON public.team_members FOR UPDATE
  USING (public.is_fluxer());

-- RLS Policies for portal_projects
CREATE POLICY "Fluxers can view all portal projects"
  ON public.portal_projects FOR SELECT
  USING (public.is_fluxer());

CREATE POLICY "Fluxers can insert portal projects"
  ON public.portal_projects FOR INSERT
  WITH CHECK (public.is_fluxer());

CREATE POLICY "Fluxers can update portal projects"
  ON public.portal_projects FOR UPDATE
  USING (public.is_fluxer());

CREATE POLICY "Fluxers can delete portal projects"
  ON public.portal_projects FOR DELETE
  USING (public.is_fluxer());

-- RLS Policies for portal_tasks
CREATE POLICY "Fluxers can view all portal tasks"
  ON public.portal_tasks FOR SELECT
  USING (public.is_fluxer());

CREATE POLICY "Fluxers can insert portal tasks"
  ON public.portal_tasks FOR INSERT
  WITH CHECK (public.is_fluxer());

CREATE POLICY "Fluxers can update portal tasks"
  ON public.portal_tasks FOR UPDATE
  USING (public.is_fluxer());

CREATE POLICY "Fluxers can delete portal tasks"
  ON public.portal_tasks FOR DELETE
  USING (public.is_fluxer());

-- RLS Policies for portal_task_dependencies
CREATE POLICY "Fluxers can manage task dependencies"
  ON public.portal_task_dependencies FOR ALL
  USING (public.is_fluxer());

-- RLS Policies for portal_task_comments
CREATE POLICY "Fluxers can view all task comments"
  ON public.portal_task_comments FOR SELECT
  USING (public.is_fluxer());

CREATE POLICY "Fluxers can insert task comments"
  ON public.portal_task_comments FOR INSERT
  WITH CHECK (public.is_fluxer());

CREATE POLICY "Fluxers can update own task comments"
  ON public.portal_task_comments FOR UPDATE
  USING (public.is_fluxer() AND author_id = (SELECT id FROM public.team_members WHERE user_id = auth.uid()));

CREATE POLICY "Fluxers can delete own task comments"
  ON public.portal_task_comments FOR DELETE
  USING (public.is_fluxer() AND author_id = (SELECT id FROM public.team_members WHERE user_id = auth.uid()));

-- Seed initial data: Add Brian to fluxer allowlist
INSERT INTO public.fluxer_allowlist (email, name) VALUES
  ('brian@fluxco.com', 'Brian Tochman')
ON CONFLICT (email) DO NOTHING;

-- Seed initial portal projects (phases)
INSERT INTO public.portal_projects (name, description, color, position) VALUES
  ('Phase 1 - Foundation', 'Company setup, legal, banking, initial hires', '#3b82f6', 1),
  ('Phase 2 - Product Development', 'Core product, manufacturing, inventory systems', '#10b981', 2),
  ('Phase 3 - Go to Market', 'Sales, marketing, customer acquisition', '#f59e0b', 3)
ON CONFLICT DO NOTHING;
