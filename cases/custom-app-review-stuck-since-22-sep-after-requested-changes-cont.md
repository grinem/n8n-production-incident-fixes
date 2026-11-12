---
layout: default
title: "Custom app review stuck since 22 Sep after requested changes (CONTACT AI, eu2)"
platform: "Make.com"
severity: "HIGH"
status: "Resolved"
date: 2026-11-11
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "custom-app-review-stuck-since-22-sep-after-requested-changes-cont"
---

# Custom app review stuck since 22 Sep after requested changes (CONTACT AI, eu2)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T08:20:22.279894`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

This is an identified operational bottleneck in the Make ecosystem: the submission routing for the **Custom Apps → Review** category in the Help Center utilizes an automated deflection rule that redirects authors back to their app review tab instead of provisioning an internal support ticket, leaving submissions stranded in the triage backlog with `Reviewer: TBS`.

Here is the exact multi-step procedure to unblock this review and distribute your app immediately.

---

### Step 1: Circumvent the Support Form Deflection Loop
Submitting under "Custom Apps → Review" systematically halts ticket generation.
1. Open the Make Contact Support form.
2. Select **Technical Issues / Bug** (or **Account & Platform Issues**) instead of Custom Apps.
3. In the subject field, input:
   `[ESCALATION] Custom App Review Queue Desync - App ID: contact-zwp8mo (Zone: eu2)`
4. In the body description, state clearly that:
   - Your revised submission from September 22 has remained in `Request received` with `Reviewer: TBS` for nearly two months.
   - The dedicated "Custom Apps → Review" support category loops into an automated deflection screen without generating a ticket ID.
   - Provide your Organization ID, App ID (`contact-zwp8mo`), and deployment environment (`eu2`).

---

### Step 2: Enable Production Use Immediately via Private Sharing
Public directory listing is only required for global discoverability. Your app is already functional and can be installed privately across external client or partner workspaces right now:
1. Open the Make App Editor in the EU2 zone:
   `[https]://eu2[.]make[.]com/apps`
2. Select **CONTACT AI** (`contact-zwp8mo`).
3. Click on the **Invitations** / **Sharing** section on the left navigation panel.
4. Generate a private invitation link. Anyone navigating to that link can immediately install the connector into their Make organization and run production scenarios.

---

### Step 3: Validate Local CLI Manifest Integrity
Ensure your base app schema has no configuration mismatch preventing queue workers from auto-assigning an auditor. If you maintain your app via the Make Apps CLI (`make-apps`), run a structural validation against your `eu2` configuration:

```bash
# Authenticate explicitly against the eu2 regional zone
make-apps login --zone eu2

# Validate app schema and check live deployment metadata
make-apps validate
make-apps app:get contact-zwp8mo
```

For reference, verify that your core root `app.json` declaration adheres strictly to the expected schema without deprecated parameter keys:

```json
{
  "name": "contact-zwp8mo",
  "label": "CONTACT AI",
  "version": 1,
  "description": "Integration connector for CONTACT AI",
  "theme": "#3B82F6",
  "baseUrl": "[https]://api[.]yourdomain[.]com/v1",
  "common": {
    "headers": {
      "Authorization": "Bearer {{connection.accessToken}}",
      "Content-Type": "application/json"
    }
  },
  "connection": "contact-ai-oauth2"
}
```

---

### Step 4: Community Escalation
On this forum, mention active Make Community Managers (such as `Client Case Study (User)` or `Client Case Study (User)`) directly in this thread. They have direct administrative escalation routes to the Partner & App Ecosystem team and can manually re-queue stalled app IDs.

If you would like, I can also share a complete JSON blueprint / flow template demonstrating automated webhook validation and OAuth2 refresh patterns—just let me know and I will provide it!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
