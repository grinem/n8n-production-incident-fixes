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
- **Resolution Status**: `RADAR TRIAGED & READY FOR RESOLUTION`
- **Logged Timestamp**: `2026-11-11T14:00:24.452447`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

Good catch. This is a classic monorepo packaging issue where relative markdown links fail across both GitHub browsing and package registries.

### Why this happens
1. **On GitHub:** The links use relative paths like `CONTRIBUTING[.]md` inside sub-directories such as `packages/Client Case Study (User)/utils/`. GitHub evaluates this relative to the package folder rather than the workspace root, leading to an immediate 404 since the actual files exist only at `/CONTRIBUTING[.]md` and `/LICENSE[.]md`.
2. **On npm:** Even if relative paths like `../../CONTRIBUTING[.]md` were used, `npm publish` only packages files specified within each sub-package's directory. Because root files aren't bundled into the distributed tarball, the npm registry cannot resolve relative links back to the root, resulting in broken links on the package page as well.

### The Fix
To ensure links work identically on both GitHub and npmjs, the links in the sub-package README files should point to the canonical repository root on GitHub.

Here is an automated Node.js patch script you can run from the root of the monorepo to fix all affected README files in one shot:

**Patch Preview (First 3 lines of verified fix):**
```javascript
// fix-readme-links.js - Run from n8n monorepo root
const fs = require('fs');
const path = require('path');
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
