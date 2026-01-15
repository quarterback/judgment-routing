# Judgment Routing and Decision Engineering

This repository is an early scaffold for thinking about how authority, judgment, and accountability are engineered into systems that delegate decisions to AI agents.

It exists to name a missing layer in current AI and automation architectures and to make that layer discussable, inspectable, and evolvable.

## The Problem

Organizations increasingly use AI systems to evaluate eligibility, recommend actions, and automate decisions that materially affect people's lives.

In government, enterprise, and regulated domains, these decisions were historically made by humans operating inside visible approval chains: supervisors, legal review, signing authority, escalation paths. Those processes were slow and imperfect, but they were traceable. You could reconstruct who decided what, under which mandate, and why.

As automation scales, judgment becomes invisible.

Current AI architectures focus on task execution, orchestration, and access control. They leave unaddressed:

* how authority is delegated
* where discretion begins and ends
* when escalation is required
* how decisions are authorized
* how accountability is preserved over time

This gap creates administrative debt, governance risk, and institutional fragility.

## Two Core Concepts

### Decision Engineering

Decision Engineering is the practice of explicitly designing how decisions are made, authorized, escalated, and audited inside institutions.

Organizations have always engineered decisions through forms, policies, approval chains, and signing authority. What has changed is that those mechanisms can no longer be implicit or human mediated by default.

Decision Engineering treats judgment as infrastructure.

### Judgment Router

A Judgment Router is infrastructure that sits between an agent's proposal and the execution of an action.

The agent analyzes inputs and proposes an action. The judgment layer evaluates that proposal against explicit authority boundaries, policy constraints, and escalation rules. The outcome is one of three states: approved, escalated, or blocked. Every decision produces a traceable record explaining what happened and why.

Judgment routers make delegated judgment legible, constrained, and auditable.

## Scope

This repository provides conceptual scaffolding. Schemas, examples, and pseudocode are illustrative. They are designed to make authority, escalation, and responsibility visible so they can be debated, refined, and improved.

Expect iteration.

## Structure

* `/concepts/` Conceptual notes defining decision engineering, judgment routing, and related primitives.

Future additions may include example schemas, reference flows, and design patterns as needed to clarify underlying ideas.

## Why This Exists

As AI systems become part of the architecture of everyday life, we need shared language for interrogating how decisions are authorized and who is responsible when they are wrong.

Here is the curated list of links and the specific "Proof of Work" labels for each, so you can drop them into your README or the "The Paper Trail" section of your post:

### **Prototypes & Visual Frameworks**
I've been writing and workshopping on this topic for the past year. Here's some of the iteration:

* **[AI Risk Readiness Dashboard](https://pop-karate-81037755.figma.site/)** – A visual prototype for evaluating institutional readiness and risk signals before deployment.
* **[Mandate Mapping & Logic Flows](https://gut-spec-29713822.figma.site)** – Speculative UI for how policy intent is mapped into agentic boundaries.
* **[The Authority Queue Interface](https://chat-fang-60036973.figma.site)** – A draft of the Triage Dashboard showing how "Judgment Gaps" are surfaced to human operators.
* **[Decision Receipt Schema Visualizer](https://mono-right-67494032.figma.site)** – A conceptual look at the forensic audit trail produced by the Judgment Router.

### **Open Source Repositories**

* **[Tardigrade (Resilience Pattern)](https://github.com/Digital-Corps-PDX/tardigrade)** – A repo exploring "graceful degradation" for systems, ensuring they revert to human-legible states during AI failure.
* **[AI-Enablement (Archived)](https://github.com/Digital-Corps-PDX/AI-enablement)** – Early work on government-specific AI implementation standards and constraints.

### **The "Why" (Strategic Deep-Dives)**

* **[Context Engineering for LLMs](https://blog.ronbronson.com/context-engineering-for-llms-starts-with-systems-not-prompts)** – Why we need to engineer systems and institutional data, not just write better prompts.
* **[Context is the Terrain](https://blog.ronbronson.com/context-is-not-just-a-map-its-the-terrain)** – A look at why AI fails when it doesn't understand the administrative landscape it's operating in.
* **[Service Design for AI](https://blog.ronbronson.com/service-design-for-ai-why-human-experience-hx-matters)** – Establishing the need for "Human Experience" (HX) as the primary metric for automated government services.
