export interface StrategicContext {
  id: string;
  context_id: string;
  active_start: string;
  active_end: string;
  grantor_name: string;
  grantor_role: string;
  priorities: Record<string, {
    weight: number;
    rationale: string;
  }>;
  authority_boundaries: {
    financial?: Array<{
      action: string;
      limit: number;
      currency?: string;
      unit?: string;
      escalation_threshold?: number;
    }>;
    communication?: Array<{
      action: string;
      limit: number;
      unit: string;
      escalation_threshold?: number;
    }>;
    legal?: Array<{
      trigger: string;
      require_approval: boolean;
    }>;
  };
  escalation_contacts: Array<{
    authority_level: string;
    name: string;
    threshold: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface AuthorityEnvelope {
  id: string;
  envelope_id: string;
  strategic_context_id: string;
  issued_at: string;
  expires_at: string;
  task_scope: string;
  granted_authorities: Array<{
    action: string;
    max_amount?: number;
    max_percentage?: number;
    max_recipients?: number;
    requires_receipt: boolean;
  }>;
  active_priorities: Record<string, number>;
  mandatory_escalations: string[];
  status: 'active' | 'expired' | 'revoked';
  created_at: string;
}

export interface DecisionReceipt {
  id: string;
  receipt_id: string;
  envelope_id: string;
  timestamp: string;
  agent_proposal: {
    action: string;
    amount?: number;
    currency?: string;
    customer_id?: string;
    reason: string;
    [key: string]: unknown;
  };
  judgment_evaluation: {
    authority_check: 'within_bounds' | 'exceeds_bounds' | 'blocked';
    amount_limit?: number;
    amount_requested?: number;
    within_threshold: boolean;
    priority_alignment: Record<string, {
      weight: number;
      alignment_score: number;
      rationale: string;
    }>;
    conflicts_detected: string | null;
    escalation_required: boolean;
  };
  decision: 'approved' | 'escalate' | 'blocked';
  executed_at: string | null;
  audit_trail: {
    authority_source: string;
    granted_by: string;
    decision_rationale: string;
  };
  created_at: string;
}
