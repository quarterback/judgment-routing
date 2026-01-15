# Judgment Routing

This repository exists because we're building AI systems that make consequential decisions about people's lives, and we have no shared infrastructure for making those decisions legible, bounded, or accountable.

## The Problem

Organizations are deploying AI agents to handle everything from benefits enrollment to procurement approvals. These systems work great until they encounter an edge case, an ambiguous policy interpretation, or a decision that exceeds their granted authority. When that happens, most systems either fail silently, hallucinate compliance, or execute anyway and hope nobody notices.

This creates two problems:

First, the 90/10 problem. Ninety percent of decisions are routine and agents can handle them fine. The other ten percent carry outsized institutional risk. Without explicit routing logic, you can't separate the two.

Second, the authority problem. When a paper form moved through Jan to Bill to Steve, you knew who held signing authority at each step. When an AI processes a request, that chain disappears. You're left trying to reconstruct decisions months later with no trail.

## What This Is

Judgment Routing is a middleware pattern that sits between an agent's proposal and the execution of that action. The agent does analysis and recommends an action. The judgment layer evaluates that recommendation against explicit policy constraints and authority boundaries. Based on that evaluation, the action either executes immediately, gets routed for verification, or escalates to a human with signing authority.

Every decision produces a receipt that explains what happened and why.

## Core Concepts

**Decision Engineering** is the practice of making authority chains, policy constraints, and escalation rules explicit rather than implicit. When Jan reviewed forms and passed edge cases to Steve, that was decision engineering. It was visible and traceable. We need the same clarity when AI systems process requests, only now it has to be documented.

**The Judgment Router** is infrastructure that evaluates proposed actions against institutional mandate. It determines whether an action falls within approved parameters, requires additional verification, or needs human review.

**Decision Receipts** are structured records that link every action back to the authority that permitted it. They preserve institutional memory and create audit trails.

## How It Works

The router evaluates proposed actions across four signals:

**UNCERTAINTY** measures data ambiguity or conflicting requirements  
**STAKES** measures fiscal impact, downstream risk, or stakeholder count  
**AUTHORITY** compares required sign off level against current delegation  
**NOVELTY** distinguishes familiar patterns from first of their kind scenarios

Based on these signals, actions route through one of four paths:

**FAST PATH** for low risk decisions that execute immediately  
**SLOW PATH** for ambiguous cases requiring verification  
**HUMAN ESCALATION** for high stakes decisions or authority gaps  
**SPECIALIST REFERRAL** for domain mismatches requiring expert review

## Sample Decision Receipt

```json
{
  "receipt_id": "jr-2026-001",
  "timestamp": "2026-01-15T09:42:01Z",
  "status": "AUTHORIZED",
  "routing_outcome": "FAST_PATH",
  "signals": {
    "uncertainty": 1,
    "stakes": 2,
    "authority": 1,
    "novelty": 1
  },
  "metadata": {
    "agent_id": "benefits-processor-04",
    "policy_imprint": "HR1-COMPLIANCE-V2",
    "authority_key": "Director_Signature_Key_0x82",
    "rationale": "Applicant meets all eligibility criteria. Income verified via IRS API."
  }
}
```
## How You Can Help

I'm putting this into the world to get more people engaging with these ideas. Here's how you can contribute:

**Share related work.** If you know of projects exploring similar territory, research on delegation and authority in AI systems, or existing implementations that solve pieces of this problem, open an issue or share links.

**Contribute implementation patterns.** If you've built systems that handle escalation, authority boundaries, or decision auditing in production environments, your patterns would be valuable here. Real world experience matters more than theoretical completeness.

**Refine the schemas.** The Decision Receipt format and scoring signals are starting points. If you work in regulated domains or have experience with compliance systems, feedback on what's missing or what needs adjustment would help.

**Build examples.** Concrete use cases make abstract concepts real. If you want to sketch out how judgment routing would work for benefits eligibility, procurement approval, content moderation, or other domains, that would strengthen the repository.

**Challenge the framing.** If you think this misses something important, misconstrues existing work, or solves the wrong problem, that's valuable feedback too. Open an issue or reach out at bronsonr@umich.edu

## Status

This is an early scaffold. The schemas and examples are illustrative, designed to make authority and accountability visible so they can be refined. I've been thinking about these problems for the past year through various prototypes and frameworks. This repository consolidates that work into something other people can build with.

## Related Work

I've been testing concepts that led here:

* [Authority Queue & Triage Dashboard](https://chat-fang-60036973.figma.site)
* [AI Risk Readiness Dashboard](https://pop-karate-81037755.figma.site/)
* [Decision Receipt Schema Visualizer](https://mono-right-67494032.figma.site)

Other projects exploring adjacent territory:

* [Tardigrade](https://github.com/Digital-Corps-PDX/tardigrade): Resilience patterns for graceful degradation in agentic systems
* [AI Enablement](https://github.com/Digital-Corps-PDX/AI-enablement): Early frameworks for government AI implementation standards (deprecated)
