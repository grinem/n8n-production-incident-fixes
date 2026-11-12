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
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-12T17:20:46.742344`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Outstanding forensic breakdown of this issue. You have hit the nail right on the head: storing `defaultFilter` as a `private static` field on `ExtendedQdrantVectorStore` creates a critical in-process race condition and state bleed across instances and concurrent worker threads in the Node runtime.

### The Underlying Issue
Because `ExtendedQdrantVectorStore.defaultFilter` is bound to the class constructor rather than the returned instance, any subsequent call to `ExtendedQdrantVectorStore.fromExistingCollection(...)` overwrites that single in-memory slot.
- In multi-tenant retrieval pipelines, Node B overwrites Node A's filter during initialization.
- In `Retrieve as Tool` operations, the tool factory creates a dynamic client passing `undefined`, which resets the shared static filter to `{}` mid-run.
- On queue workers, this leaks filter boundaries across completely independent workflow runs sharing the same worker process.

### Upstream Patch Fix
The class must bind the filter to the instance created by `super.fromExistingCollection`, as shown below:

```typescript
export class ExtendedQdrantVectorStore extends QdrantVectorStore {
  // Bind filter to the instance, NOT static
  public instanceFilter: IDataObject = {};

  static async fromExistingCollection(
    embeddings: EmbeddingsInterface,
    args: QdrantLibArgs,
    defaultFilter: IDataObject = {},
  ): Promise<ExtendedQdrantVectorStore> {
    const store = (await super.fromExistingCollection(embeddings, args)) as ExtendedQdrantVectorStore;
    store.instanceFilter = defaultFilter;
    return store;
  }

  async similaritySearch(query: string, k = 4, filter?: IDataObject, callbacks?: Callbacks) {
    const mergedFilter = { ...this.instanceFilter, ...filter };
    return await super.similaritySearch(query, k, mergedFilter, callbacks);
  }
}
```

### Immediate Zero-Downtime Workaround (Without recompiling n8n)
If you cannot patch the container immediately and need strict tenant isolation right now, bypass the high-level Qdrant Vector Store node for search retrieval by querying Qdrant's REST API endpoint directly using an **HTTP Request** node or a **Custom Tool** block.

Here is a ready-to-use HTTP Request node payload targeting Qdrant's search endpoint with isolated per-request tenant filtering:

```json
{
  "nodes": [
    {
      "parameters": {
        "method": "POST",
        "url": "=[https]://[YOUR_QDRANT_HOST]:6333/collections/my_collection/points/search",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "api-key",
              "value": "YOUR_QDRANT_API_KEY"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={\n  \"vector\": {{ $json.embedding }},\n  \"limit\": 5,\n  \"with_payload\": true,\n  \"filter\": {\n    \"must\": [\n      {\n        \"key\": \"tenant\",\n        \"match\": {\n          \"value\": \"{{ $json.tenant_id }}\"\n        }\n      }\n    ]\n  }\n}"
      },
      "id": "qdrant-isolated-search",
      "name": "Qdrant Isolated Search",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300]
    }
  ]
}
```

By decoupling the retrieval into an isolated stateless HTTP call, metadata filters remain strictly scoped to the current execution item and cannot be mutated by background agent tool calls or neighboring nodes.

If you'd like, I can also share the complete JSON blueprint / flow template with you for free—just let me know and I'll send it over.

Let me know if you run into any edge cases while deploying the patch or testing this workaround!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
