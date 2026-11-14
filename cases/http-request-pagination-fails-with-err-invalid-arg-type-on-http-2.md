---
layout: default
title: "HTTP Request pagination fails with ERR_INVALID_ARG_TYPE on HTTP 204 responses"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-14
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "http-request-pagination-fails-with-err-invalid-arg-type-on-http-2"
---

# HTTP Request pagination fails with ERR_INVALID_ARG_TYPE on HTTP 204 responses


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-14T14:20:33.391165`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

The stack trace points to internal payload normalization inside the node pagination pipeline: n8n attempts to buffer or hash the incoming page data prior to evaluating `isPaginationComplete`.

On a `204 No Content` response, `response.data` remains `undefined`, triggering Node's native `Buffer.from()` / crypto guard error before your completion expression can ever be parsed.

Until patched upstream in the HTTP Request node pagination handler (which needs an early guard `if (response.statusCode === 204 || response.data === undefined) response.data = '';`), the only reliable workaround is to disable native pagination on this node and build an explicit canvas loop:

1. In the HTTP Request node, disable native pagination and keep **Include Response Headers and Status** enabled.
2. Follow it with an **If** node checking for terminal response:
   `{{ $json.statusCode === 204 || !$json.body?._links?.next?.href }}`
3. Direct `false` back into the request node using `{{ $json.body._links.next.href }}` and `true` to your downstream processing.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
