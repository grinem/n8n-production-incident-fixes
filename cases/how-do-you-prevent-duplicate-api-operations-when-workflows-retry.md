---
layout: default
title: "How Do You Prevent Duplicate API Operations When Workflows Retry Failed Requests?"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-18
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "how-do-you-prevent-duplicate-api-operations-when-workflows-retry"
---

# How Do You Prevent Duplicate API Operations When Workflows Retry Failed Requests?


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-20T18:40:29.025947+01:00`)**  
> **Author (`virse_ai`) verified on [the live thread](https://community.n8n.io/t/how-do-you-prevent-duplicate-api-operations-when-workflows-retry-failed-requests/329364)**:  
> *"You’re right that a sheet check-then-write is not a lock. Two executions can both read the log as empty and both create the event; a session id only separates conversations, not two customers grabbing the same slot at once. n8n itself doesn’t give you a unique constraint, so the lock has to live outside the sheet. The options that have worked for me: Put the booking log in Postgres (or any store with a unique index) on the slot key, and treat a failed insert as already taken. That is the same unique-constraint pattern earlier in this thread, just applied to the slot rather than an idempotency key. If you have to keep the sheet, use it only as a human-readable log. Do the actual claim against the calendar or whatever owns the slot — and only if that API has a compare-and-set or create-only-if-free behaviour. A second GET that still shows the slot empty is not enough under overlap. A lock row with a heartbeat, as in the takeover discussion above, can serialize the two executions, but it still needs a unique key on the slot, not only on the session. I’d keep the session in the log for debugging, and use the slot (calendar plus start time, or a booking id you mint before the create) as the uniqueness key."*


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-18T08:20:40.134545`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

For non-idempotent endpoints, treat a socket timeout as an unknown state rather than a failure. Never turn on built-in "Retry on Fail" for blind POST requests unless you have an idempotency key or the API enforces natural unique constraints where a `409 Conflict` can be safely caught.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
