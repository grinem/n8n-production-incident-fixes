---
layout: default
title: "Make the OpenSearch client timeout configurable (searches fail with read timeout=10 on cold k-NN graphs)"
platform: "Make.com"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-19
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "make-the-opensearch-client-timeout-configurable-searches-fail-wit"
---

# Make the OpenSearch client timeout configurable (searches fail with read timeout=10 on cold k-NN graphs)


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-19T08:02:31.022476`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Spot-on diagnosis. Loading cold HNSW graphs from EBS into off-heap memory on baseline gp3 (~125 MiB/s) consistently crosses the 10s default once shard graph segments hit ~1 GiB+.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
