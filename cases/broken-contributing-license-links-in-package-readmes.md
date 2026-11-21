---
layout: default
title: "Broken CONTRIBUTING/LICENSE links in package READMEs"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-11
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "broken-contributing-license-links-in-package-readmes"
---

# Broken CONTRIBUTING/LICENSE links in package READMEs


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T14:00:24.452447`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Relative links like `CONTRIBUTING.md` inside subdirectories like `packages/Client Case Study (User)/utils/` resolve relative to the package folder instead of th...

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
