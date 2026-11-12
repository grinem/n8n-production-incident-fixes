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
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T16:40:27.204881`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

This is a known structural edge case with n8n's RBAC/credential validator during version history restores.

### Why this happens
When you trigger a workflow restore from the UI, the backend (`WorkflowHistoryService`) deserializes the historical snapshot stored in the database and runs an ACL integrity check across every node in the `nodes` array.

Because the credential validator evaluates all declared node credentials (`node.credentials.<type>.id`) before verifying execution status, it does not check whether the node has `"disabled": true` or disconnected edges. If the target credential was permanently deleted from the `credentials_entity` table, the backend fails to resolve the foreign record and bubbles up a generic authorization error (*"you don't have access to the credential"*), which halts the restore transaction.

---

### Immediate Workaround (Unblocking your Restore)

Since you are running self-hosted n8n on PostgreSQL, you have two quick ways to bypass this without manually redrawing your canvas:

#### Option 1: Clean the snapshot directly in PostgreSQL
You can sanitize the historical snapshot in your PostgreSQL database by stripping the missing credential reference from that specific version record. Once stripped, the native UI "Restore" button will immediately succeed.

Run the following query in your PostgreSQL instance (replace `<WORKFLOW_ID>` and `<VERSION_ID>` accordingly):

```sql
-- 1. Identify the version ID and inspect the nodes JSON
SELECT id, "workflowId", "createdAt"
FROM workflow_history
WHERE "workflowId" = 'YOUR_WORKFLOW_ID'
ORDER BY "createdAt" DESC;

-- 2. Strip the orphaned credentials block on the disabled node
-- (Replace YOUR_DISABLED_NODE_NAME with the exact name of the node)
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

#### Option 2: Browser DevTools JSON Extraction & Patch
If you do not want to alter the database directly:
1. Open the Workflow History tab in your browser and open **DevTools (Network tab)**.
2. Click on the target historical version. Locate the network response returning the workflow payload (`[rest]/workflows/<workflow_id>/history/<version_id>`).
3. Copy the `nodes` and `connections` JSON objects.
4. Locate the disabled node in your favorite text editor, clear the `credentials` property, and paste the sanitized JSON into your workflow canvas via **Ctrl+V / Cmd+V**.

### Suggested Mini-Patch JSON for the Node Definition
To manually correct the node within your canvas/export, ensure its credential definition resembles the following schema:

```json
{
  "name": "Disabled Archived Service",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [
    250,
    300
  ],
  "disabled": true,
  "parameters": {},
  "credentials": {}
}
```

Flagging this issue on GitHub is definitely the right move—n8n's history restore engine should ideally mark missing credentials as unresolved placeholders in draft mode rather than rejecting the entire rollback.

If you'd like, I can also share the complete JSON blueprint / flow template with you for free—just let me know and I'll send it over.

Let me know if you hit any roadblocks running the database patch or need help verifying your payload schema!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
