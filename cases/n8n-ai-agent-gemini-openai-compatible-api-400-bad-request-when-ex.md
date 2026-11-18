---
layout: default
title: "N8n AI Agent + Gemini OpenAI-compatible API: 400 Bad Request when executing Gmail tools"
platform: "n8n"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-18
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "n8n-ai-agent-gemini-openai-compatible-api-400-bad-request-when-ex"
---

# N8n AI Agent + Gemini OpenAI-compatible API: 400 Bad Request when executing Gmail tools


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-18T21:40:28.833170+01:00`)**  
> **Author (`signallayerops`) verified on [the live thread](https://community.n8n.io/t/n8n-ai-agent-gemini-openai-compatible-api-400-bad-request-when-executing-gmail-tools/329414)**:  
> *"One isolation step before swapping nodes: put a trivial tool on the same agent (an HTTP Request tool that returns a fixed two-field JSON) and ask it the same thing. If the second request goes through, the shim is fine and the problem is what the Gmail tool puts back into the history. Gmail Get and Get Many return headers and full base64 bodies. That tool result is replayed on the next request, and a large or oddly shaped tool result is one of the things that turns into a bare 400 on the OpenAI-compatible endpoint. I’d shrink the tool output first: subject, from, date, snippet, and the message id. Then test the tool cycle again before changing the model node. If it still fails with the small tool, then it is the tool-call echo, and the native Google Gemini Chat Model node is the right move."*


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-18T08:42:29.037141`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

two things are tripping this up:

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


[← Back to Live Case Studies Index](../)
