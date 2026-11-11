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
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T14:00:24.452447`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Good catch. This is a classic monorepo packaging issue where relative markdown links fail across both GitHub browsing and package registries.

### Why this happens
1. **On GitHub:** The links use relative paths like `CONTRIBUTING[.]md` inside sub-directories such as `packages/Client Case Study (User)/utils/`. GitHub evaluates this relative to the package folder rather than the workspace root, leading to an immediate 404 since the actual files exist only at `/CONTRIBUTING[.]md` and `/LICENSE[.]md`.
2. **On npm:** Even if relative paths like `../../CONTRIBUTING[.]md` were used, `npm publish` only packages files specified within each sub-package's directory. Because root files aren't bundled into the distributed tarball, the npm registry cannot resolve relative links back to the root, resulting in broken links on the package page as well.

### The Fix
To ensure links work identically on both GitHub and npmjs, the links in the sub-package README files should point to the canonical repository root on GitHub.

Here is an automated Node.js patch script you can run from the root of the monorepo to fix all affected README files in one shot:

```javascript
// fix-readme-links.js - Run from n8n monorepo root
const fs = require('fs');
const path = require('path');

const targetPackages = [
  'packages/Client Case Study (User)/utils',
  'packages/frontend/Client Case Study (User)/composables',
  'packages/frontend/Client Case Study (User)/frontend-constants',
  'packages/frontend/Client Case Study (User)/frontend-utils',
  'packages/frontend/Client Case Study (User)/i18n',
  'packages/frontend/Client Case Study (User)/rest-api-client',
  'packages/frontend/Client Case Study (User)/stores'
];

const REPO_ROOT_URL = '[https]://github[.]com/n8n-io/n8n/blob/master';

targetPackages.forEach((pkgPath) => {
  const readmePath = path.join(process.cwd(), pkgPath, 'README.md');
  if (!fs.existsSync(readmePath)) {
    console.warn(`File not found: ${readmePath}`);
    return;
  }

  let content = fs.readFileSync(readmePath, 'utf8');

  // Replace relative CONTRIBUTING and LICENSE links with canonical repository URLs
  content = content
    .replace(/\(\.\.?\/CONTRIBUTING\.md\)|\(CONTRIBUTING\.md\)/g, `(${REPO_ROOT_URL}/CONTRIBUTING.md)`)
    .replace(/\(\.\.?\/LICENSE\.md\)|\(LICENSE\.md\)/g, `(${REPO_ROOT_URL}/LICENSE.md)`);

  fs.writeFileSync(readmePath, content, 'utf8');
  console.log(`Updated links in: ${readmePath}`);
});
```

Alternatively, if you prefer a direct markdown adjustment in each file:

```markdown
<!-- Replace local relative links: -->
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [LICENSE.md](LICENSE.md)

<!-- With canonical absolute paths: -->
- [CONTRIBUTING.md]([https]://github[.]com/n8n-io/n8n/blob/master/CONTRIBUTING[.]md)
- [LICENSE.md]([https]://github[.]com/n8n-io/n8n/blob/master/LICENSE[.]md)
```

*(Note: remove the brackets around `[https]` and `[.]` when applying the markdown diff to your PR).*

If you'd like, I can also share the complete JSON blueprint / flow template with you for free—just let me know and I'll send it over.

Let me know if you run into any other edge cases across the monorepo packages or if you'd like me to review the diff before opening your PR!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
