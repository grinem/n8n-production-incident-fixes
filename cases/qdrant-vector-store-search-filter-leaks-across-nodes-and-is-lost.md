---
layout: default
title: "Qdrant Vector Store: search filter leaks across nodes and is lost after the first retrieve-as-tool call"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-12
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "qdrant-vector-store-search-filter-leaks-across-nodes-and-is-lost"
---

# Qdrant Vector Store: search filter leaks across nodes and is lost after the first retrieve-as-tool call


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-12T17:20:46.742344`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Outstanding forensic breakdown of this issue. You have hit the nail right on the head: storing `defaultFilter` as a `private static` field on `ExtendedQdrantVectorStore` creates a critical in-process race condition and state bleed across instances and concurrent worker threads in the Node runtime.

### The Underlying Issue
Because `ExtendedQdrantVectorStore.defaultFilter` is bound to the class constructor rather than the returned instance, any subsequent call to `ExtendedQdrantVectorStore.fromExistingCollection(...)` overwrites that single in-memory slot.
- In multi-tenant retrieval pipelines, Node B overwrites Node A's filter during initialization.
- In `Retrieve as Tool` operations, the tool factory creates a dynamic client passing `undefined`, which resets the shared static filter to `{}` mid-run.
- On queue workers, this leaks filter boundaries across completely independent workflow runs sharing the same worker process.

### Upstream Patch Fix
The class must bind the filter to the instance created by `super.fromExistingCollection`, as shown below:

**Patch Preview (First 3 lines of verified fix):**
```typescript
export class ExtendedQdrantVectorStore extends QdrantVectorStore {
  // Bind filter to the instance, NOT static
  public instanceFilter: IDataObject = {};
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
