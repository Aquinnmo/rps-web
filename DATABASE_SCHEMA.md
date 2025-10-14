# DATABASE SCHEMA

## Table: Batches

CREATE TABLE public.batches (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_moves text NOT NULL DEFAULT ''::text,
  v0_moves text NOT NULL DEFAULT ''::text,
  v1_moves text NOT NULL DEFAULT ''::text,
  v2_moves text NOT NULL DEFAULT ''::text,
  CONSTRAINT batches_pkey PRIMARY KEY (id)
);