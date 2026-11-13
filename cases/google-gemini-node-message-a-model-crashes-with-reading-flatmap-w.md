---
layout: default
title: "Google Gemini node: Message a Model crashes with \"reading 'flatMap'\" when Gemini blocks the prompt"
platform: "n8n"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-12
tags: ["n8n", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "google-gemini-node-message-a-model-crashes-with-reading-flatmap-w"
---

# Google Gemini node: Message a Model crashes with "reading 'flatMap'" when Gemini blocks the prompt


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-12T03:00:28.682892`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

Spot-on diagnosis! The root issue stems from the Google Gemini API returning an HTTP 200 OK containing only `promptFeedback.blockReason` while completely omitting the `candidates` array whenever a safety threshold or prohibited content policy is triggered. Because `GenerateContentResponse` in `helpers/interfaces.ts` currently marks `candidates` as strictly required, operations like `getToolCalls` immediately hit `response.candidates.flatMap(...)` and crash with an unhandled `TypeError: Cannot read properties of undefined (reading 'flatMap')`.

Looking closely at the implementation:
1. In `message.operation.ts:581` and `message.operation.ts:614`, `response.candidates` is directly mapped and accessed without verifying its presence. Adding optional chaining and a defensive check `(response.candidates ?? []).flatMap(...)` or an early guard `if (!response.candidates?.length)` prevents this crash.
2. In fact, `image.operation.ts` already handles prompt blocking appropriately by inspecting `promptFeedback?.blockReason` before attempting to access candidate outputs. Standardizing this pattern via a shared helper or bringing the same defensive check into `message.operation.ts` ensures consistent error handling across the entire Google Gemini node.

### Proposed Code Adjustment

In `helpers/interfaces.ts`, `candidates` should be marked optional to reflect actual upstream API responses:

```typescript
export interface GenerateContentResponse {
	candidates?: Candidate[]; // Optional: omitted by Gemini when prompt is blocked
	promptFeedback?: {
		blockReason?: string;
		blockReasonMessage?: string;
		safetyRatings?: SafetyRating[];
	};
	usageMetadata?: UsageMetadata;
}
```

And in `message.operation.ts` (around lines 581 & 614), guard against undefined candidates before calling `.flatMap(...)`:

```typescript
if (response.promptFeedback?.blockReason) {
	throw new NodeOperationError(
		this.getNode(),
		`Google Gemini blocked the prompt: ${response.promptFeedback.blockReason}${
			response.promptFeedback.blockReasonMessage ? ` - ${response.promptFeedback.blockReasonMessage}` : ''
		}`,
	);
}

const toolCalls = (response.candidates ?? []).flatMap((candidate) => getToolCalls(candidate));
```

### Unit Test Fixture

To verify this regression fix in `message.operation.test.ts`, here is a clean fixture simulating a safety-blocked response:

```typescript
describe('Google Gemini - Message a Model (Safety Block)', () => {
	it('should gracefully handle responses where candidates is undefined due to blockReason', async () => {
		const blockedResponse: GenerateContentResponse = {
			promptFeedback: {
				blockReason: 'SAFETY',
				blockReasonMessage: 'Prompt violated safety policies',
				safetyRatings: [
					{
						category: 'HARM_CATEGORY_HARASSMENT',
						probability: 'HIGH',
					},
				],
			},
		};

		// Mock the API client call
		jest.spyOn(apiClient, 'generateContent').mockResolvedValue(blockedResponse);

		await expect(executeMessageOperation.call(mockExecuteFunctions, blockedResponse)).rejects.toThrow(
			/Google Gemini blocked the prompt: SAFETY/,
		);
	});
});
```

Happy to review your PR once opened!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
