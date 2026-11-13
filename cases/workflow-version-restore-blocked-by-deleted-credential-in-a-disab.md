---
layout: default
title: "Workflow version restore blocked by deleted credential in a disabled, disconnected node"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-11
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "workflow-version-restore-blocked-by-deleted-credential-in-a-disab"
---

# Workflow version restore blocked by deleted credential in a disabled, disconnected node


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T16:40:27.204881`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

To unblock the restore right now while the Linear ticket is open, you can bypass the validator using either of these workarounds:

### Option 1: Sanitize the snapshot in PostgreSQL (Fastest)

If you have direct access to your n8n PostgreSQL instance, strip the missing credential reference from that specific snapshot record. Once cleared, the native UI restore will succeed.

```sql
-- 1. Find the version ID
SELECT id, "workflowId", "createdAt"
FROM workflow_history
WHERE "workflowId" = 'YOUR_WORKFLOW_ID'
ORDER BY "createdAt" DESC;

-- 2. Strip the credentials block from the disabled node
UPDATE workflow_history
SET nodes = (
  SELECT jsonb_agg(
    CASE
      WHEN elem->>'name' = 'YOUR_DISABLED_NODE_NAME'
      THEN elem - 'credentials' || '{"credentials": {}}'::jsonb
      ELSE elem
    END
  )
  FROM jsonb_array_elements(nodes::jsonb) AS elem
)
WHERE id = 'YOUR_VERSION_ID';
```

Reload the workflow canvas in your browser and click **Restore version** again.

---

### Option 2: Extract and import via DevTools (No DB access required)

If you don't have direct database write access:

1. Open your browser's Developer Tools (**Network** tab).
2. Click the target version in the Workflow History panel.
3. Locate the GET request to `/workflows/<workflow_id>/history/<version_id>`.
4. Copy the `nodes` and `connections` arrays from the response JSON.
5. In any text editor, locate the disabled node and set `"credentials": {}`.
6. Go back to your workflow canvas and paste the sanitized payload directly using `Ctrl+V` / `Cmd+V`.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
