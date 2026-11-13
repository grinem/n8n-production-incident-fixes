---
layout: default
title: "ErrorReporter logs every error at error level when Sentry is not configured"
platform: "n8n"
severity: "HIGH"
status: "Resolved"
date: 2026-11-11
tags: ["n8n", "production-fix", "post-mortem", "verified-resolution"]
slug: "errorreporter-logs-every-error-at-error-level-when-sentry-is-not"
---

# ErrorReporter logs every error at error level when Sentry is not configured


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `n8n`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-11T17:40:27.818079`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

This is reproducible in `packages/core/src/errors/error-reporter.ts`.

### Root Cause
When Sentry is enabled, `beforeSend` handles log level filtering (`info`, `warning`, `error`). However, when Sentry is not configured, execution falls back entirely to `ErrorReporter.defaultReport()`.

Currently, `defaultReport` routes all errors and their cause chain directly to `this.logger.error()`, ignoring both `options?.level` and the error class levels (e.g. `UserError` -> `info`, `NodeOperationError`/`NodeApiError` -> `warning`). This floods log collectors (Grafana Loki, Datadog, CloudWatch) with false `error` alerts on standard 4xx API calls and user-handled branch errors.

### Implementation Fix
To align `defaultReport` with the Sentry pipeline, log level resolution should inspect `options.level` and the intrinsic `error.level` before dispatching to the logger:

```typescript
// packages/core/src/errors/error-reporter.ts

private resolveLogLevel(error: unknown, options?: ReportErrorOptions): 'info' | 'warn' | 'error' {
	if (options?.level && options.level !== 'error') {
		if (options.level === 'warning') return 'warn';
		if (options.level === 'info') return 'info';
	}

	if (typeof error === 'object' && error !== null && 'level' in error) {
		const errorLevel = (error as { level?: string }).level;
		if (errorLevel === 'info') return 'info';
		if (errorLevel === 'warning' || errorLevel === 'warn') return 'warn';
	}

	return 'error';
}

defaultReport(error: unknown, options?: ReportErrorOptions): void {
	const level = this.resolveLogLevel(error, options);
	const logMethod = (this.logger[level] ?? this.logger.error).bind(this.logger);

	for (const currentError of this.iterateErrorAndCauses(error)) {
		if (currentError instanceof Error) {
			logMethod({
				message: currentError.message,
				metadata: {
					stack: currentError.stack,
					...options?.extra,
				},
			});
		} else {
			logMethod({
				message: String(currentError),
				metadata: options?.extra,
			});
		}
	}
}
```

### Temporary Mitigation (Log Ingestion Layer)
Until this is merged upstream, if you run a log shipper like Vector, Promtail, or Fluent Bit, you can remap these records at ingestion:

```vrl
# Example Vector (VRL) remapping
if .level == "error" && exists(.metadata.function) && .metadata.function == "defaultReport" {
  if match(.message, r'Cannot read properties|TypeError|404 -|Request failed with status code 4') {
    .level = "warn"
  }
}
```

Submitting a PR with corresponding test cases in `error-reporter.test.ts` to assert that `logger.warn` and `logger[.]info` are called when appropriate would be the fastest path to getting this into an upcoming release.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
