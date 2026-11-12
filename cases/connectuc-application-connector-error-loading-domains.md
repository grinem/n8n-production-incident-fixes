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
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Activepieces`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-12T23:40:27.396597`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

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

```json
{
  "pieceName": "Client Case Study (User)/piece-http",
  "actionName": "send_request",
  "input": {
    "method": "GET",
    "url": "[https]://api[.]connectuc[.]com/v1/domains",
    "headers": {
      "Authorization": "Bearer {{connections['connectuc_connection'].token}}",
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    "queryParams": {},
    "failsafe": false
  }
}
```

*(Note: Replace `[https]://api[.]connectuc[.]com` with your cluster's exact API base URL and insert your bearer credentials).*

### Fix 3: Validate Reseller / Domain Management Scopes
Check your ConnectUC / SkySwitch administrative console to confirm that the API credentials belong to an account with global domain query permissions. If you are restricted to a single sub-tenant or office group, your administrator will need to elevate the API user role to allow domain enumeration.

If you'd like, I can also share the complete JSON blueprint / flow template with you for free—just let me know and I'll send it over.

Feel free to paste the exact response object from your browser network tab if you inspect the `/api/v1/pieces/options` request and see a specific error code!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
