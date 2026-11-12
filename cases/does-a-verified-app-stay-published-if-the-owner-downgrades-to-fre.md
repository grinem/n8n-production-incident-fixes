---
layout: default
title: "Does a verified app stay published if the owner downgrades to Free? (ticket form not working)"
platform: "Make.com"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-10
tags: ["make", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "does-a-verified-app-stay-published-if-the-owner-downgrades-to-fre"
---

# Does a verified app stay published if the owner downgrades to Free? (ticket form not working)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-10T15:40:14.745652`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Here are the definitive answers regarding how verified Custom Apps behave when changing plans, along with a quick workaround for the ticket form issue.

### 1. Does the verified app stay published if you downgrade to Free?
**Yes.** Once an app is approved and published to the public Make directory, its availability does **not** depend on whether the developer's organization is on a paid or Free tier. The app will remain fully listed and accessible to all Make users globally.

### 2. Do customer scenarios keep running?
**Yes, completely unaffected.** Customer scenarios run entirely within each customer’s own Make organization and consume their own plan operations and data transfer limits. The owner account's plan status has zero impact on third-party executions.

### 3. Can you still maintain, update, and submit changes on the Free plan?
**Yes.** The Make Developer Platform (`/apps`) remains fully accessible on a Free account:
- You can still create new development versions, edit JSON/RPC declarations, configure new modules, and adjust OAuth2/API communication settings.
- You can still run the built-in module checkups, test calls, and submit new versions for Make Review approval.
- **The only limitation:** If you run end-to-end integration tests using live scenarios inside your Leadinfo developer organization, you will be constrained to the Free tier quota (1,000 operations/month and standard Free execution limits). As long as you only use that account for testing individual calls or light testing, the Free plan is more than sufficient.

---

### Fixing the Support Ticket Form (reCAPTCHA spinner issue)
The reCAPTCHA loop on the external ticket form is typically triggered by Chrome blocking third-party tracking cookies or ad/privacy extensions (such as uBlock Origin, Privacy Badger, or Brave Shields) preventing Google’s reCAPTCHA script from returning a valid response token.

To submit your ticket immediately without getting blocked:
1. **Bypass the public form via the Console:** While logged into your Make workspace (`eu1.make.com`, `eu2.make.com`, or `us1.make.com`), click the **`?` (Help)** icon in the bottom-left sidebar, then click **Submit a ticket / Contact Support**. Submitting while authenticated directly in the Make platform uses your active session token and bypasses the external reCAPTCHA check.
2. **Alternative:** Open a clean **Incognito / Private Window** in Chrome (or Firefox) with all extensions disabled, navigate directly to the ticket form, and log in.

Feel free to ping back here if you run into any specific permission prompt or notice any unexpected behavior in your dev console after downgrading!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
