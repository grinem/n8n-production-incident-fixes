---
layout: default
title: "[Feature]: Platform Secret Managers: AWS provider should accept IAM role auth (default credential chain) instead of only static access keys"
platform: "Activepieces"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-11
tags: ["activepieces", "production-fix", "post-mortem", "verified-resolution"]
slug: "platform-secret-managers-aws-provider-should-accept-iam-role-auth"
---

# [Feature]: Platform Secret Managers: AWS provider should accept IAM role auth (default credential chain) instead of only static access keys


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Activepieces`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T17:41:10.063471`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Completely agree. In EKS (IRSA) or ECS/EC2 environments, enforcing static IAM keys conflicts directly with least-privilege security policies.

The issue stems from two spots in the codebase:
1. `packages/core/shared/src/lib/ee/secret-managers/dto.ts`: `AWSProviderConfigSchema` treats `accessKeyId` and `secretAccessKey` as required.
2. `packages/server/api/src/app/ee/secret-managers/secret-manager-providers/aws-provider.ts`: `getSecretsManagerClient()` explicitly injects `credentials: { accessKeyId, secretAccessKey }`, which bypasses the AWS SDK v3 Default Credential Provider Chain.

Making these keys optional in the schema and omitting `credentials` when empty allows the SDK to automatically resolve ambient credentials via `AWS_ROLE_ARN` / `AWS_WEB_IDENTITY_TOKEN_FILE` or IMDSv2 while staying backward-compatible:

**1. `packages/core/shared/src/lib/ee/secret-managers/dto.ts`**
```typescript
import { Static, Type } from 'Client Case Study (User)/typebox';

export const AWSProviderConfigSchema = Type.Object({
    region: Type.String({ minLength: 1 }),
    accessKeyId: Type.Optional(Type.String()),
    secretAccessKey: Type.Optional(Type.String()),
});

export type AWSProviderConfig = Static<typeof AWSProviderConfigSchema>;
```

**2. `packages/server/api/src/app/ee/secret-managers/secret-manager-providers/aws-provider.ts`**
```typescript
import { SecretsManagerClient } from 'Client Case Study (User)/client-secrets-manager';
import { AWSProviderConfig } from 'Client Case Study (User)/shared';

export const getSecretsManagerClient = (config: AWSProviderConfig): SecretsManagerClient => {
    const hasStaticCredentials = Boolean(
        config.accessKeyId?.trim() && config.secretAccessKey?.trim()
    );

    return new SecretsManagerClient({
        region: config.region,
        ...(hasStaticCredentials && {
            credentials: {
                accessKeyId: config.accessKeyId!.trim(),
                secretAccessKey: config.secretAccessKey!.trim(),
            },
        }),
    });
};
```

**3. `packages/core/shared/src/lib/ee/secret-managers/index.ts`**
Set `required: false` on `accessKeyId` and `secretAccessKey`, with a UI hint indicating they can be left blank to rely on the ambient IAM role (IRSA / ECS task role / EC2 instance profile).

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
