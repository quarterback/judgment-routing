# Judgment Routing 

### Overview
Judgment Routing is a stateful middleware pattern for agentic architectures, designed to bridge the gap between **agentic intelligence** (reasoning) and **institutional authority** (execution).

As AI agents scale, organizations face what you might think of as a 90/10 problem: most autonomous actions are routine, while a small fraction represent edge cases with outsized institutional risk. Judgment routing enables management by exception, ensuring that high-stakes or ambiguous decisions are routed appropriately rather than silently executed.

### Core Primitives

#### 1. Decision Engineering
The discipline of codifying policy intent, risk tolerances, and delegation scopes into machine-readable mandates.

#### 2. The Judgment Router
A stateful gateway that intercepts agent-proposed actions, scores them against institutional policy, and determines the path of execution.

#### 3. The Decision Receipt
A JSON-based provenance record that captures the logic, scoring signals, and authority chain for every executed action.

### The Scoring Matrix (1-5)
These scores are not intended to “decide” outcomes, but to route decisions to the appropriate execution, escalation, or review path.

The Router evaluates proposed actions across four primary signals:
- **UNCERTAINTY:** Data ambiguity or conflicting requirement logic.
- **STAKES:** Fiscal impact, downstream risk, or stakeholder count.
- **AUTHORITY:** Required sign-off level vs. current agent delegation.
- **NOVELTY:** Pattern recognition vs. first-of-kind scenarios.

### Sample Decision Receipt
```json
{
  "receipt_id": "jr-2026-001",
  "status": "AUTHORIZED",
  "routing_outcome": "FAST_PATH",
  "signals": {
    "uncertainty": 1,
    "stakes": 2,
    "authority": 2,
    "novelty": 1
  },
  "metadata": {
    "agent_id": "procurement-agent-04",
    "policy_ref": "MOU-FINANCE-2026-v1",
    "human_owner": "Director_Signature_Key_0x82"
  }
}
