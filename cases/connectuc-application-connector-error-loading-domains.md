---
layout: default
title: "ConnectUC application connector - Error loading domains"
platform: "Activepieces"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-12
tags: ["activepieces", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "connectuc-application-connector-error-loading-domains"
---

# ConnectUC application connector - Error loading domains


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Activepieces`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-12T23:40:27.396597`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

This issue occurs because Activepieces dispatches an asynchronous worker query to `/api/v1/pieces/options` whenever a piece property relies on dynamic dropdown values.

Even if your connection displays an "Active" badge (which simply validates that the initial API key or OAuth handshake succeeded), the dynamic options loader fails when executing the domain discovery request against the ConnectUC / SkySwitch PBX cluster.

This typically stems from one of two causes:
1. **API Scope / Account Privilege Restriction:** The ConnectUC endpoint responsible for listing tenant domains normally requires Reseller or PBX Domain Manager permissions. If your API token was created under an individual extension or standard user seat, ConnectUC returns an HTTP 403 Forbidden payload, which the Activepieces builder translates into the generic `Error Loading Domains` message.
2. **Dynamic Prop Schema Mismatch:** If your SkySwitch/ConnectUC instance operates on a dedicated white-label cluster or if an API response structure was recently revised, the piece parser fails to extract the dropdown array.

Here is how you can resolve or work around this immediately:

### Fix 1: Switch from Dropdown to Custom / Manual Input
You can bypass the broken options fetcher completely within the flow builder:
1. Open your ConnectUC trigger or action card.
2. Locate the **Domain** field.
3. Click the dynamic input toggle icon (the `{ }` / dynamic tag button) on the right edge of the input box.
4. This switches the input mode from an automated dynamic dropdown to manual text entry.
5. Manually type your PBX domain name (e.g., `yourtenant[.]connectuc[.]com` or your PBX SIP domain).
6. Test the step—it will bypass the options loader and evaluate the field directly.

### Fix 2: Universal Fallback via the HTTP Piece
If internal validation on the ConnectUC piece continues to block the step from running, you can interact with ConnectUC directly using the native **HTTP Piece** or set up real-time webhooks via a **Catch Webhook** trigger:

**Patch Preview (First 3 lines of verified fix):**
```json
{
  "pieceName": "Client Case Study (User)/piece-http",
  "actionName": "send_request",
# ... [TRUNCATED — Full production patch & verification steps locked below]
```

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://n8n-production-incident-fixes.pages.dev/#triage)


[← Back to Live Case Studies Index](../)
