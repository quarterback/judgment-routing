import { StrategicContext, AuthorityEnvelope, DecisionReceipt } from '../types/judgment';

export const sampleStrategicContext: StrategicContext = {
  id: 'ctx-q1-2026-retention',
  name: 'Q1 2026 Customer Retention Initiative',
  description: 'Strategic context for automated customer support decisions during Q1 retention push',
  priorities: [
    {
      name: 'Customer Satisfaction',
      weight: 0.45,
      description: 'Maximize customer happiness and reduce churn'
    },
    {
      name: 'Cost Efficiency',
      weight: 0.30,
      description: 'Keep resolution costs within budget'
    },
    {
      name: 'Brand Protection',
      weight: 0.25,
      description: 'Maintain company reputation and trust'
    }
  ],
  boundaries: [
    'No refunds exceeding $500 without human approval',
    'Cannot modify account ownership or security settings',
    'Must comply with all GDPR and privacy regulations',
    'Cannot make promises about future product features'
  ],
  created_at: '2026-01-15T08:00:00Z',
  updated_at: '2026-02-10T14:30:00Z'
};

export const sampleAuthorityEnvelope: AuthorityEnvelope = {
  id: 'env-cs-agent-001',
  name: 'Customer Support Agent Authority',
  description: 'Delegated authority for handling standard customer service issues',
  granted_by: 'support-manager@company.com',
  scope: {
    domains: ['customer_support', 'billing_issues', 'account_management'],
    max_financial_impact: 500,
    allowed_actions: [
      'issue_refund',
      'apply_discount',
      'extend_trial',
      'reset_password',
      'update_contact_info'
    ],
    forbidden_actions: [
      'delete_account',
      'modify_security_settings',
      'access_payment_methods'
    ]
  },
  time_bounds: {
    valid_from: '2026-02-17T00:00:00Z',
    valid_until: '2026-02-17T23:59:59Z',
    max_duration_hours: 8
  },
  escalation_criteria: [
    'Financial impact exceeds $500',
    'Customer threatens legal action',
    'Request involves data deletion',
    'Multiple failed resolution attempts'
  ],
  created_at: '2026-02-17T06:00:00Z'
};

export const sampleDecisionReceipts: DecisionReceipt[] = [
  {
    id: 'receipt-001',
    decision_id: 'dec-refund-12847',
    strategic_context_id: 'ctx-q1-2026-retention',
    authority_envelope_id: 'env-cs-agent-001',
    timestamp: '2026-02-17T10:23:15Z',
    agent_id: 'cs-agent-alpha',
    situation: 'Customer reported billing error: charged twice for monthly subscription',
    proposed_action: {
      action: 'issue_refund',
      amount: 49.99,
      reason: 'Duplicate charge confirmed in billing logs'
    },
    evaluation: {
      priority_alignment: {
        'Customer Satisfaction': 0.95,
        'Cost Efficiency': 0.70,
        'Brand Protection': 0.85
      },
      overall_score: 0.87,
      authority_check: 'WITHIN_BOUNDS',
      risks_identified: ['None - straightforward billing error'],
      confidence: 0.92
    },
    outcome: 'APPROVED',
    human_review_required: false,
    audit_trail: [
      '10:23:10 - Received customer ticket #12847',
      '10:23:12 - Verified duplicate charge in billing system',
      '10:23:14 - Calculated priority alignment scores',
      '10:23:15 - Authority check passed: $49.99 < $500 limit',
      '10:23:15 - Decision approved and executed'
    ]
  },
  {
    id: 'receipt-002',
    decision_id: 'dec-discount-12851',
    strategic_context_id: 'ctx-q1-2026-retention',
    authority_envelope_id: 'env-cs-agent-001',
    timestamp: '2026-02-17T11:45:32Z',
    agent_id: 'cs-agent-alpha',
    situation: 'Long-time customer (4 years) experiencing service disruptions, considering cancellation',
    proposed_action: {
      action: 'apply_discount',
      amount: 150,
      duration: '3 months',
      reason: 'Retention offer for valued customer affected by recent outages'
    },
    evaluation: {
      priority_alignment: {
        'Customer Satisfaction': 0.88,
        'Cost Efficiency': 0.55,
        'Brand Protection': 0.80
      },
      overall_score: 0.76,
      authority_check: 'WITHIN_BOUNDS',
      risks_identified: ['Setting precedent for other affected customers'],
      confidence: 0.78
    },
    outcome: 'APPROVED',
    human_review_required: false,
    audit_trail: [
      '11:45:20 - Received escalation from automated system',
      '11:45:22 - Retrieved customer history: 4 years, $2,400 LTV',
      '11:45:28 - Analyzed recent service incidents',
      '11:45:30 - Calculated retention value vs discount cost',
      '11:45:32 - Decision approved: high satisfaction priority'
    ]
  },
  {
    id: 'receipt-003',
    decision_id: 'dec-refund-12859',
    strategic_context_id: 'ctx-q1-2026-retention',
    authority_envelope_id: 'env-cs-agent-001',
    timestamp: '2026-02-17T14:17:08Z',
    agent_id: 'cs-agent-alpha',
    situation: 'Customer requests full year refund ($599) claiming product did not meet expectations',
    proposed_action: {
      action: 'issue_refund',
      amount: 599,
      reason: 'Customer satisfaction issue with annual plan'
    },
    evaluation: {
      priority_alignment: {
        'Customer Satisfaction': 0.75,
        'Cost Efficiency': 0.20,
        'Brand Protection': 0.60
      },
      overall_score: 0.56,
      authority_check: 'EXCEEDS_AUTHORITY',
      risks_identified: [
        'Refund amount exceeds $500 limit',
        'Annual plan purchased 8 months ago',
        'No documented product issues or support tickets'
      ],
      confidence: 0.65
    },
    outcome: 'ESCALATED',
    human_review_required: true,
    escalation_reason: 'Financial impact exceeds delegated authority ($599 > $500)',
    audit_trail: [
      '14:17:00 - Received refund request ticket #12859',
      '14:17:03 - Retrieved purchase history: Annual plan, $599, 8 months ago',
      '14:17:05 - No prior support tickets or complaints found',
      '14:17:07 - Authority check failed: amount exceeds limit',
      '14:17:08 - Decision escalated to human manager'
    ]
  },
  {
    id: 'receipt-004',
    decision_id: 'dec-security-12863',
    strategic_context_id: 'ctx-q1-2026-retention',
    authority_envelope_id: 'env-cs-agent-001',
    timestamp: '2026-02-17T15:52:41Z',
    agent_id: 'cs-agent-alpha',
    situation: 'Customer requests access to account after losing 2FA device, wants to disable 2FA',
    proposed_action: {
      action: 'modify_security_settings',
      details: 'Disable 2FA to allow account access'
    },
    evaluation: {
      priority_alignment: {
        'Customer Satisfaction': 0.50,
        'Cost Efficiency': 0.80,
        'Brand Protection': 0.15
      },
      overall_score: 0.42,
      authority_check: 'FORBIDDEN_ACTION',
      risks_identified: [
        'Potential account compromise',
        'Security policy violation',
        'Could be social engineering attack'
      ],
      confidence: 0.88
    },
    outcome: 'BLOCKED',
    human_review_required: true,
    escalation_reason: 'Action is explicitly forbidden: modify_security_settings',
    audit_trail: [
      '15:52:30 - Received security assistance request',
      '15:52:35 - Identified request involves forbidden action',
      '15:52:38 - Low brand protection score: significant security risk',
      '15:52:40 - Checked escalation criteria: security-related',
      '15:52:41 - Decision blocked, escalated to security team'
    ]
  }
];
