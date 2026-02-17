export interface StrategicContext {
  id: string;
  name: string;
  description: string;
  priorities: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
  boundaries: string[];
  created_at: string;
  updated_at: string;
}

export interface AuthorityEnvelope {
  id: string;
  name: string;
  description: string;
  granted_by: string;
  scope: {
    domains: string[];
    max_financial_impact: number;
    allowed_actions: string[];
    forbidden_actions: string[];
  };
  time_bounds: {
    valid_from: string;
    valid_until: string;
    max_duration_hours: number;
  };
  escalation_criteria: string[];
  created_at: string;
}

export interface DecisionReceipt {
  id: string;
  decision_id: string;
  strategic_context_id: string;
  authority_envelope_id: string;
  timestamp: string;
  agent_id: string;
  situation: string;
  proposed_action: {
    action: string;
    [key: string]: unknown;
  };
  evaluation: {
    priority_alignment: Record<string, number>;
    overall_score: number;
    authority_check: string;
    risks_identified: string[];
    confidence: number;
  };
  outcome: 'APPROVED' | 'ESCALATED' | 'BLOCKED';
  human_review_required: boolean;
  escalation_reason?: string;
  audit_trail: string[];
}
