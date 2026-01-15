Judgment Routers: Infrastructure for Delegated Agency
=====================================================

When you delegate work to an AI agent, you're not just asking it to complete a task. You're granting it temporary authority to act on your behalf. That authority needs boundaries, and those boundaries need to be explicit, inspectable, and enforceable.

Current agent frameworks handle task routing and execution orchestration. They don't handle judgment---the layer where decisions get evaluated against strategic intent, where authority boundaries get enforced, and where humans receive the information they need to trust what happened.

Judgment routers fill this gap.

They sit between high-level human intent and low-level agent execution, translating strategic context into actionable constraints and producing audit trails that explain why decisions were allowed or blocked.

The Core Mechanism
------------------

A judgment router operates on three artifacts:

1.  ****Strategic Context Documents****\
    Human-readable intent that defines priorities, constraints, and authority levels
2.  ****Authority Envelopes****\
    Machine-readable containers that carry context through agent workflows
3.  ****Decision Receipts****\
    Structured explanations of what happened and why it was permitted

Strategic Context Document
--------------------------

This is what a manager or executive actually writes. Natural language with explicit structure.

strategic_context:\
  id:  "q1-2026-customer-retention"\
  active_period:\
  start:  "2026-01-01"\
  end:  "2026-03-31"

  authority_grantor:\
  name:  "Sarah Chen"\
  role:  "Head of Customer Success"

  priorities:\
  customer_retention:\
  weight:  0.9\
  rationale:  "Q1 target is 95% retention rate"\
  cost_efficiency:\
  weight:  0.4\
  rationale:  "Budget flexibility for high-value accounts"\
  response_speed:\
  weight:  0.8\
  rationale:  "Four-hour resolution target for P1 issues"

  authority_boundaries:\
  financial:\
  - action:  "issue_refund"\
  limit:  2000\
  currency:  "USD"\
  escalation_threshold:  5000\
  - action:  "apply_discount"\
  limit:  30\
  unit:  "percent"

  communication:\
  - action:  "send_customer_email"\
  limit:  100\
  unit:  "recipients"\
  escalation_threshold:  500

  legal:\
  - trigger:  "contract_modification"\
  require_approval:  true\
  - trigger:  "liability_language"\
  require_approval:  true

  escalation_contacts:\
  - authority_level:  "manager"\
  name:  "Sarah Chen"\
  threshold:  "exceeds financial limits"\
  - authority_level:  "legal"\
  name:  "Legal Team"\
  threshold:  "contract or liability issues"

* * * * *

Authority Envelope
------------------

This is what agents carry when they execute. Generated from the strategic context and scoped to specific tasks.

{\
  "authority_envelope":  {\
  "envelope_id":  "env_a8f3e91c",\
  "issued_at":  "2026-01-14T10:23:00Z",\
  "issued_by":  "judgment_router_v1",\
  "expires_at":  "2026-01-14T18:23:00Z",

  "source_context":  "q1-2026-customer-retention",\
  "task_scope":  "customer_issue_resolution",

  "granted_authorities":  [\
  {\
  "action":  "issue_refund",\
  "max_amount":  2000,\
  "requires_receipt":  true\
  },\
  {\
  "action":  "apply_discount",\
  "max_percentage":  30,\
  "requires_receipt":  true\
  },\
  {\
  "action":  "send_customer_email",\
  "max_recipients":  100,\
  "requires_receipt":  true\
  }\
  ],

  "active_priorities":  {\
  "customer_retention":  0.9,\
  "cost_efficiency":  0.4,\
  "response_speed":  0.8\
  },

  "mandatory_escalations":  [\
  "contract_modification",\
  "liability_language",\
  "amount > 5000",\
  "recipients > 500"\
  ]\
  }\
}

Decision Receipt
----------------

Generated whenever authority is exercised. Designed for human review and audit.

{\
  "decision_receipt":  {\
  "receipt_id":  "rcpt_b4e2f83a",\
  "timestamp":  "2026-01-14T14:45:12Z",\
  "envelope_id":  "env_a8f3e91c",

  "agent_proposal":  {\
  "action":  "issue_refund",\
  "amount":  1800,\
  "currency":  "USD",\
  "customer_id":  "cust_9284",\
  "reason":  "Product defect reported, customer lifetime value $24K"\
  },

  "judgment_evaluation":  {\
  "authority_check":  "within_bounds",\
  "amount_limit":  2000,\
  "amount_requested":  1800,\
  "within_threshold":  true,

  "priority_alignment":  {\
  "customer_retention":  {\
  "weight":  0.9,\
  "alignment_score":  0.95,\
  "rationale":  "High-value customer, retention critical"\
  },\
  "cost_efficiency":  {\
  "weight":  0.4,\
  "alignment_score":  0.6,\
  "rationale":  "Cost acceptable given customer value"\
  }\
  },

  "conflicts_detected":  null,\
  "escalation_required":  false\
  },

  "decision":  "approved",\
  "executed_at":  "2026-01-14T14:45:15Z",

  "audit_trail":  {\
  "authority_source":  "q1-2026-customer-retention",\
  "granted_by":  "Sarah Chen, Head of Customer Success",\
  "decision_rationale":  "Refund within authority limits and aligned with retention priority"\
  }\
  }\
}

How It Works: The Request Flow
------------------------------

When an agent needs to take action:

1.  ****Preflight Check****\
    Agent submits proposed action and authority envelope to the judgment router.
2.  ****Evaluation****\
    Router checks the action against authority boundaries and priority weights.
3.  ****Resolution****\
    One of three outcomes is returned:
4.  -   ****APPROVED**** -- Action proceeds and a receipt is generated
    -   ****ESCALATE**** -- Human decision required
    -   ****BLOCKED**** -- Hard constraint violated

Evaluation Logic (Pseudocode)
-----------------------------

def evaluate_action(envelope, proposed_action):\
  for boundary in envelope.authority_boundaries:\
  if  violates_hard_constraint(proposed_action, boundary):\
  return  BLOCKED

  if  exceeds_authority(proposed_action, envelope.granted_authorities):\
  return  ESCALATE

 alignment_score =  calculate_alignment(\
 proposed_action,\
 envelope.active_priorities\
  )

  return  APPROVED_WITH_RECEIPT

Decision Packages: When Humans Need to Decide
---------------------------------------------

A structured briefing generated when authority limits are exceeded. Optimized for fast, informed human judgment.

What This Enables
-----------------

Organizations implementing judgment routers gain:

-   Delegatable authority with explicit bounds
-   Explainable, auditable decisions
-   Instant propagation of strategic priorities
-   Human oversight focused on exceptions, not routine actions
-   Trustable autonomy at scale

Start with one workflow---refund approvals, procurement, content moderation---and expand. The mechanism stays consistent; only the schemas evolve.
