# Judgment Router

Infrastructure that routes AI decisions by authority.

## Quickstart

```bash
git clone https://github.com/quarterback/judgment-router
cd judgment-router  
pip install -r requirements.txt
streamlit run demo/app.py
```

## Core Primitives

### Four Signals (1-5 scale)

UNCERTAINTY: Data gaps or conflicting inputs  
STAKES: Budget impact or downstream risk  
AUTHORITY: Exceeds delegation scope  
NOVELTY: Familiar pattern or first-of-kind  

### Decision Receipt

Every action produces a Decision Receipt linking authority to outcome:

```json
{
  "receipt_id": "rcpt_abc123", 
  "authority_source": "sarah_chen_q1_delegation",
  "signals": {
    "uncertainty": 1,
    "stakes": 2, 
    "authority": 1,
    "novelty": 1
  },
  "routing": "FAST_PATH",
  "action": "approved_vendor_payment_450"
}
```

## Structure

```
.
├── src/judgment_router.py     # Core routing logic
├── schemas/decision_receipt.json  # JSON schema
├── examples/
│   ├── vendor_approval.py     # $450 invoice
│   └── permit_edgecase.py     # Immigration status
└── demo/app.py                # Streamlit dashboard
```

## Examples

**Vendor Approval ($450 invoice)**  
Signals: uncertainty=1, stakes=2, authority=1, novelty=1  
Routing: FAST_PATH → auto-approved  

**Permit Edge Case (immigration status)**  
Signals: uncertainty=4, stakes=3, authority=2, novelty=5  
Routing: HUMAN → queued for review  

## Judgment Router

Middleware that evaluates agent proposals against authority boundaries. Agent proposes action. Router scores signals. Outcome determines execution path.

FAST PATH: All signals ≤2  
SLOW PATH: Signals 3-4  
HUMAN: Any signal=5 or total≥14  
SPECIALIST: Domain mismatch  

## Contributing

1. Fork repository
2. Run `make test` 
3. Submit pull request
4. Preserve Decision Receipt schema

## License

MIT License
