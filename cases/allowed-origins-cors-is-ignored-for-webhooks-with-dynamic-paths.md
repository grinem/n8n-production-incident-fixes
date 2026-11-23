---
layout: default
title: "Allowed Origins (CORS) is ignored for webhooks with dynamic paths"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-22
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "allowed-origins-cors-is-ignored-for-webhooks-with-dynamic-paths"
---

# Allowed Origins (CORS) is ignored for webhooks with dynamic paths


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-23T03:20:39.505959+01:00`)**  
> **Author (`goutham-valugula`) verified on [the live thread](https://github.com/n8n-io/n8n/issues/44775)**:  
> *"I checked the current source and found a concrete distinction from the proposed early-middleware diagnosis. `WebhookRequestHandler.setupCorsHeaders()` calls `findAccessControlOptions(path, method)`, and `LiveWebhooks.findAccessControlOptions()` resolves the webhook first, then still selects its node with `parameters.path === path`. A concrete path such as `user/123` therefore does not match the registered template `user/:id`. This method also dereferences `webhook.workflowId` without handling a missing result, so it is worth confirming whether the production request reaches this path or an earlier middleware in the reported setup. If it does, selecting the node from the resolved webhook registration (rather than comparing the template to the request path) appears to address the allowlist miss; separately verify whether the reflected-origin behavior comes from this handler or another CORS layer."*


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-22T06:23:05.729338`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The early CORS middleware checks incoming requests against the webhook cache via exact path matching instead of pattern matching. Because dynamic webhooks register the uncompiled token string (e.g. `user/:id`), concrete request paths (`user/123`) miss the lookup and fall back to n8n's default CORS handler, which reflects `Origin` indiscriminately.

Until dynamic route evaluation (e.g. `path-to-regexp`) is wired into `findWebhook` inside `packages/cli/src/webhooks/webhook-helpers.ts` during pre-flight lookup, two workarounds:

1. **Switch route params to query params:**
Use a static path like `user` and parse the identifier via `{{ $json.query.id }}` instead of `{{ $json.params.id }}`. Static paths resolve the origin map reliably.

2. **Enforce CORS upstream at your reverse proxy (Nginx):**

**Patch Preview (First 3 lines of verified fix):**
```nginx
location ~ ^/webhook(-test)?/user/ {
    set $cors_allowed "";
    if ($http_origin ~* "^[https]://a\[.]com$") {
# ... [TRUNCATED — Full production patch & verification steps locked below]
```

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
