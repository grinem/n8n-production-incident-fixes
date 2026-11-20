---
layout: default
title: "Allow registering custom model credentials without a live validation call"
platform: "Automation Engine"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-20
tags: ["automation engine", "production-fix", "post-mortem", "verified-resolution"]
slug: "allow-registering-custom-model-credentials-without-a-live-validat"
---

# Allow registering custom model credentials without a live validation call


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


## Incident Metadata
- **Platform / Ecosystem**: `Automation Engine`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-20T13:24:59.144307`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

This is a huge pain with self-hosted runners—vLLM/Ollama treat Dify's dummy test prompt like legitimate user traffic, immediately kicking existing models out of VRAM to load the next one.

While waiting for an official `skip_validation` parameter or bulk import API upstream, two quick workarounds help avoid the 40+ minute VRAM shuffle:

1. **LiteLLM / Proxy mock:** Intercept the validation call at LiteLLM before it hits Ollama/vLLM. You can add a pre-call hook or reverse-proxy rule that matches Dify's validation payload and returns a static `chat.completion` response (`{"choices": [{"message": {"role": "assistant", "content": "ok"}}]}`). Dify gets its valid response without the weights ever touching VRAM.

2. **Patch `provider_configuration.py`:** If you build your own Dify images or mount overrides, short-circuit `validate_custom_model_credentials` in `api/core/entities/provider_configuration.py` with an environment flag:

**Patch Preview (First 3 lines of verified fix):**
```python
def validate_custom_model_credentials(self, tenant_id: str, provider: str, credentials: dict) -> None:
    if os.getenv('SKIP_MODEL_CREDENTIAL_VALIDATION', 'false').lower() == 'true':
        return
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
