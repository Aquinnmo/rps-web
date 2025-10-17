# DATABASE SCHEMA

## Table: Batches

CREATE TABLE public.batches (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_moves text NOT NULL DEFAULT ''::text,
  v0_moves text NOT NULL DEFAULT ''::text,
  v1_moves text NOT NULL DEFAULT ''::text,
  v2_moves text NOT NULL DEFAULT ''::text,
  v3_moves text NOT NULL DEFAULT ''::text,
  v4_moves text NOT NULL DEFAULT ''::text,
  v5_moves text NOT NULL DEFAULT ''::text,
  CONSTRAINT batches_pkey PRIMARY KEY (id)
);

v0_moves stores moves from the elementary model
v1_moves stores moves from the freshman model
v2_moves stores moves from the sophmore model
v3_moves stores moves from the junior model
v4_moves stores moves from the senior model
v5_moves stores moves from the undergraduate model