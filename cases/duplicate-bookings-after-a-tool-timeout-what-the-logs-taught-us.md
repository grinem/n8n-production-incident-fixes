---
layout: default
title: "Duplicate bookings after a tool timeout - what the logs taught us"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-09
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "duplicate-bookings-after-a-tool-timeout-what-the-logs-taught-us"
---

# Duplicate bookings after a tool timeout - what the logs taught us


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-09T21:28:11.669049`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

### SECTION 0: RESUME DU PROBLEME EN FRANCAIS

Le créateur du flux utilise un agent IA n8n en production pour orchestrer la réservation automatisée de rendez-vous pour un cabinet dentaire. Lors d'un appel d'outil (tool call) vers l'API backend, la requête a dépassé le délai d'expiration réseau (HTTP socket timeout), laissant la transaction dans un état non déterministe. Bien que l'agent conversationnel ait annoncé au patient que sa réservation était confirmée en interprétant mal l'absence de retour, un mécanisme de relance automatique (retry) en arrière-plan a réémis la même requête sans clé d'idempotence, entraînant la création d'un second rendez-vous identique en base de données.

---

### SECTION 1: ROOT CAUSE ANALYSIS

This failure is a classic **Distributed State Ambiguity (Two Generals' Problem)** combined with **Non-Idempotent Mutation over HTTP**:

1. **Protocol & Transport Layer Timeout (HTTP / TCP Socket Severing):**
   When the n8n HTTP Request / Tool node initiates an appointment creation (`POST /appointments`), a synchronous TCP connection is established. If the database lock, SMS gateway, or backend processing takes longer than the client-side timeout window (typically 30–60s in default Node.js/Axios runtimes), the client closes the socket with an `ETIMEDOUT` or `ESOCKETTIMEDOUT`. However, the backend server—having already received the packet—continues execution to completion and persists the record to the database.

2. **LLM Tool-Calling Context Misinterpretation:**
   In n8n’s LangChain-based AI Agent node, when a tool execution fails without strict structured return types, the raw runtime exception or timeout message is fed back into the agent context. Without an enforced system prompt constraint, the LLM hallucinates confirmation (optimistic completion bias), communicating to the patient: *"You’re all booked"*.

3. **Blind Retry without Idempotency (`POST` Semantic Breach):**
   `POST` requests are inherently non-idempotent per RFC 7231 §4.2.2. When the n8n workflow or backend queue triggers a blind retry on failure, it resends the same payload without an `Idempotency-Key` or a client-generated unique transaction identifier. The API processes this as a brand-new booking request, yielding two confirmed records for the same customer slot.

---

### SECTION 2: TECHNICAL FIX PROTOCOL (80% ACTIONABLE)

To prevent ambiguous timeouts from producing duplicate mutations in n8n, implement **deterministic idempotency hashing**, **explicit tool error boundaries**, and **atomic deduplication**:

#### Step 1: Pre-Tool Deterministic Idempotency Key Generation
Before the HTTP call or inside the Custom Code Tool, compute a SHA-256 hash derived from the immutable transaction parameters (e.g., `patient_id` + `slot_start_iso` + `clinic_id`).

In a **Code Node** preceding the HTTP Request (or directly within the tool code):

```javascript
const crypto = require('crypto');

const patientId = $json.patient_id;
const slotStart = $json.appointment_time; // ISO8601 string
const clinicId = $json.clinic_id || 'main';

// Derive unique key: identical requests produce the identical hash
const rawSeed = `${patientId}_${clinicId}_${slotStart}`;
const idempotencyKey = crypto.createHash('sha256').update(rawSeed).digest('hex');

return {
  json: {
    ...$json,
    idempotency_key: idempotencyKey
  }
};
```

#### Step 2: Configure the HTTP Request Node / Tool Node
Ensure the HTTP request strictly passes the idempotency header and sets explicit timeout bounds.

* **Method:** `POST`
* **URL:** `https://api.yourclinic.com/v1/appointments`
* **Headers:**
  * `Content-Type`: `application/json`
  * `Idempotency-Key`: `{{ $json.idempotency_key }}`
* **Timeout Settings:**
  * Go to **Node Options** > **Timeout** > Set to `15000` (15s instead of hanging indefinitely).
* **Error Handling:**
  * Toggle **Continue On Fail (Never Error)** to `true`.

#### Step 3: Parse and Structure the Output for the AI Agent
Do not return raw errors to the LLM. Intercept the HTTP node response with an evaluation node:

```javascript
// Output Evaluator Node
const response = $input.item.json;

if (response.error || response.status >= 400 || response.code === 'ETIMEDOUT') {
  return {
    json: {
      status: "UNKNOWN_STATE_TIMEOUT",
      success: false,
      escalate_to_human: true,
      message_to_agent: "TRANSACTION STATE UNCERTAIN: Tool timed out. DO NOT confirm booking to the patient. Tell the user their request is being verified by clinic staff."
    }
  };
}

return {
  json: {

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
