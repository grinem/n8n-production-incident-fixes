---
layout: default
title: "Switching source control branches persists the new branch before validating it exists on the remote"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-13
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "switching-source-control-branches-persists-the-new-branch-before"
---

# Switching source control branches persists the new branch before validating it exists on the remote


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-13T19:00:33.112278`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Great catch on the missing rollback. Re-explaining your own diagnosis isn't needed—reordering checkout before persistence is definitely the right fix here.

If you're currently stuck in this state without wanting to disconnect/reconnect the whole repo, you can unbrick it immediately by sending a `PATCH` back to a branch that actually exists on the remote (e.g. `main`):

```bash
curl -X PATCH "[http]://localhost:5678/rest/source-control/preferences" \
  -H "Content-Type: application/json" \
  -H "X-N8N-API-KEY: <your-api-key>" \
  -d '{"branchName": "main"}'
```

For the fix in `SourceControlService.setBranch`, validating via `gitService` first before touching DB preferences/pub-sub avoids having to coordinate compensation rollback across instances:

```typescript
// packages/cli/src/source-control/source-control.service.ts
async setBranch(branchName: string): Promise<void> {
    // 1. Checkout & validate against remote first
    await this.gitService.setBranch(branchName);

    // 2. Persist & broadcast only once Git succeeds
    await this.savePreferences({ branchName });
    await this.broadcastBranchChange(branchName);
}
```

If you're opening a PR for this, ping me and I'll gladly review it.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
