/*
  # Judgment Router Schema

  1. New Tables
    - `strategic_contexts`
      - `id` (uuid, primary key)
      - `context_id` (text, unique identifier like "q1-2026-customer-retention")
      - `active_start` (timestamptz, when context becomes active)
      - `active_end` (timestamptz, when context expires)
      - `grantor_name` (text, person granting authority)
      - `grantor_role` (text, their role)
      - `priorities` (jsonb, priority weights and rationale)
      - `authority_boundaries` (jsonb, financial, communication, legal limits)
      - `escalation_contacts` (jsonb, who to escalate to)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `authority_envelopes`
      - `id` (uuid, primary key)
      - `envelope_id` (text, unique identifier)
      - `strategic_context_id` (uuid, foreign key)
      - `issued_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `task_scope` (text)
      - `granted_authorities` (jsonb, array of allowed actions)
      - `active_priorities` (jsonb, priority weights)
      - `mandatory_escalations` (jsonb, array of escalation triggers)
      - `status` (text, 'active', 'expired', 'revoked')
      - `created_at` (timestamptz)

    - `decision_receipts`
      - `id` (uuid, primary key)
      - `receipt_id` (text, unique identifier)
      - `envelope_id` (text, foreign key reference)
      - `timestamp` (timestamptz)
      - `agent_proposal` (jsonb, what the agent wanted to do)
      - `judgment_evaluation` (jsonb, evaluation results)
      - `decision` (text, 'approved', 'escalate', 'blocked')
      - `executed_at` (timestamptz, when action was executed)
      - `audit_trail` (jsonb, authority source and rationale)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read all records
    - Add policies for authenticated users to create records
*/

CREATE TABLE IF NOT EXISTS strategic_contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_id text UNIQUE NOT NULL,
  active_start timestamptz NOT NULL,
  active_end timestamptz NOT NULL,
  grantor_name text NOT NULL,
  grantor_role text NOT NULL,
  priorities jsonb NOT NULL DEFAULT '{}',
  authority_boundaries jsonb NOT NULL DEFAULT '{}',
  escalation_contacts jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS authority_envelopes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  envelope_id text UNIQUE NOT NULL,
  strategic_context_id uuid REFERENCES strategic_contexts(id) ON DELETE CASCADE,
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  task_scope text NOT NULL,
  granted_authorities jsonb NOT NULL DEFAULT '[]',
  active_priorities jsonb NOT NULL DEFAULT '{}',
  mandatory_escalations jsonb NOT NULL DEFAULT '[]',
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS decision_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id text UNIQUE NOT NULL,
  envelope_id text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  agent_proposal jsonb NOT NULL,
  judgment_evaluation jsonb NOT NULL,
  decision text NOT NULL CHECK (decision IN ('approved', 'escalate', 'blocked')),
  executed_at timestamptz,
  audit_trail jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE strategic_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE authority_envelopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view strategic contexts"
  ON strategic_contexts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create strategic contexts"
  ON strategic_contexts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update strategic contexts"
  ON strategic_contexts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view authority envelopes"
  ON authority_envelopes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create authority envelopes"
  ON authority_envelopes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update authority envelopes"
  ON authority_envelopes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view decision receipts"
  ON decision_receipts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create decision receipts"
  ON decision_receipts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_strategic_contexts_context_id ON strategic_contexts(context_id);
CREATE INDEX IF NOT EXISTS idx_authority_envelopes_envelope_id ON authority_envelopes(envelope_id);
CREATE INDEX IF NOT EXISTS idx_authority_envelopes_context_id ON authority_envelopes(strategic_context_id);
CREATE INDEX IF NOT EXISTS idx_decision_receipts_receipt_id ON decision_receipts(receipt_id);
CREATE INDEX IF NOT EXISTS idx_decision_receipts_envelope_id ON decision_receipts(envelope_id);
