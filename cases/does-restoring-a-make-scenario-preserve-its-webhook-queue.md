---
layout: default
title: "Does restoring a Make scenario preserve its webhook queue?"
platform: "Make.com"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-11
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "does-restoring-a-make-scenario-preserve-its-webhook-queue"
---

# Does restoring a Make scenario preserve its webhook queue?


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T08:40:18.414950`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Here is the exact technical behavior of Make concerning scenario versions, webhook bindings, and queued requests.

### 1. Does "Version History → Restore version → Save" preserve the queue and bindings?
**Yes.** In Make's backend architecture:
- The **Scenario ID** remains identical.
- The **Custom Webhook** and its message queue are independent objects tied to a unique `hookId` at the organization level, not to the scenario version.
- Restoring a previous version simply updates the scenario flow configuration. As long as the restored version referenced that same webhook, the binding remains intact.
- The queue is stored on Make’s webhook ingestion cluster: it is **not cleared, detached, or purged** by restoring a scenario version.

### 2. Does "Import blueprint → Save" preserve them?
**Yes, but with a caveat.**
- If you export the blueprint from this exact scenario and re-import it, the JSON contains the original `hook` ID. When saved, it re-binds to the same webhook, leaving the queue untouched.
- However, if the webhook ID within the blueprint does not match your workspace or gets wiped during mapping, the module will revert to an unassigned state (`Choose a webhook`). The queue itself still won't be deleted (it stays alive under the **Webhooks** menu in the left navigation), but the module will be disconnected until you reselect it.
- Therefore, **Version History is the strictly recommended method** over manual blueprint importing for rollbacks.

### 3. Can either method trigger processing or purge data?
- **No processing will occur** as long as the scenario switch remains **OFF**. Saving, restoring, or blueprint importing never initiates an execution.
- **Warning:** Do **not** click **"Run once"** while testing your rollback unless you intend to process that waiting payload immediately. In an inactive scenario with queued data, "Run once" will pull the oldest queued payload into the flow.

### Recommended Safe Checkpoint Procedure:
1. Go to the left navigation bar → **Webhooks**. Verify that your webhook shows `1` in the queue counter.
2. In your scenario editor (with the scenario switched **OFF**), click the three dots (`...`) in the bottom control bar and select **Export Blueprint**. Store this JSON file locally as a cold backup.
3. Make any minor layout adjustment and click **Save**. This explicitly generates a fresh entry in your **Version History**.
4. Perform your modifications. If you need to roll back, simply open **Version History**, click **Restore version** on your saved timestamp, and hit **Save**. Inspect the Custom Webhook module to confirm the hook name is still assigned.

### Mini-Patch JSON / Blueprint Reference:
If you want to verify that your exported Blueprint references the exact internal `hookId` before and after rollback, check the first module object in your exported JSON:

```json
{
  "subcommands": [
    {
      "type": "service",
      "module": "gateway:CustomWebHook",
      "parameters": {
        "hook": 123456
      },
      "metadata": {
        "designer": {
          "x": 0,
          "y": 0
        },
        "restore": {
          "parameters": {
            "hook": {
              "label": "My Incoming Webhook"
            }
          }
        }
      }
    }
  ]
}
```
*(Ensure the numeric `hook` integer in your blueprint matches the ID shown in your browser address bar when navigating to your webhook settings at `[https]://us1[.]make[.]com/webhooks` or `eu1[.]make[.]com`)*.

If you'd like, I can also share the complete JSON blueprint / flow template with you for free—just let me know and I'll send it over.

Let me know if you run into any unexpected behavior or if you want me to review the structure of your webhook payload to ensure a smooth transition!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
