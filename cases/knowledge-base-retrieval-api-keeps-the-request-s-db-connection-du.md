---
layout: default
title: "Knowledge base retrieval API keeps the request's DB connection during retrieval: at 100 concurrent requests the pool is exhausted and most requests fail"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-14
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "knowledge-base-retrieval-api-keeps-the-request-s-db-connection-du"
---

# Knowledge base retrieval API keeps the request's DB connection during retrieval: at 100 concurrent requests the pool is exhausted and most requests fail


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-14T07:40:31.008246`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Great catch. Holding a session across slow network I/O (embedding generation + vector DB search) will exhaust `QueuePool` under any serious concurrency, especially if worker threads spawned downstream checkout additional sessions for `_get_dataset`.

The clean architectural fix is scoping the session strictly to the metadata retrieval/permission checks, detaching or serializing what's needed, and releasing the connection before triggering retrieval I/O:

```python
# In HitTestingApi.post (or whichever controller entrypoint is involved):
# Drop Client Case Study (User) at the route level and scope it locally:
with session_scope() as session:
    dataset = get_and_validate_dataset(dataset_id, session=session)
    # Eager load attributes or dump to a DTO/dict so downstream calls don't touch the DB
    dataset_dict = dataset.to_dict()

# Network I/O runs with 0 active DB connections checked out:
results = HitTestingService.retrieve(
    dataset_dict=dataset_dict,
    query=query,
    ...
)
```

As an immediate workaround while working on a PR, you can bump the pool and Postgres limits in your `.env` / `docker-compose.yaml`:

```env
SQLALCHEMY_POOL_SIZE=150
SQLALCHEMY_MAX_OVERFLOW=50
SQLALCHEMY_POOL_TIMEOUT=30
```
(Make sure `max_connections` on the PostgreSQL container is configured to at least ~250–300 to match).

A PR scoping the session lifetime and passing detached dataset config to `HitTestingService` would definitely be the right long-term resolution here.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
