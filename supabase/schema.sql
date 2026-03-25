create extension if not exists "uuid-ossp";

create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  total_points integer not null default 0,
  completed_stages integer not null default 0,
  progress_percent integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists stages (
  id uuid primary key default uuid_generate_v4(),
  stage_number integer unique not null,
  name text not null,
  required_previous_stage integer
);

create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  stage_number integer not null,
  task_number integer unique not null,
  name text not null,
  default_points integer not null default 100
);

create table if not exists progress (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  stage_number integer not null,
  completed boolean not null default false,
  unique (team_id, stage_number)
);

create table if not exists task_progress (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  stage_number integer not null,
  task_number integer not null,
  completed boolean not null default false,
  points_earned integer not null default 0,
  unique (team_id, task_number)
);

create table if not exists videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  youtube_url text unique not null
);

create table if not exists app_meta (
  key text primary key,
  value text not null
);
