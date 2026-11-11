# 🛠️ n8n & Low-Code Production Incident Fixes (Live Knowledge Base)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Showcase-brightgreen?style=flat-square&logo=github)](https://grinem.github.io/n8n-production-incident-fixes/)
[![Incidents Resolved](https://img.shields.io/badge/Incidents%20Resolved-27%20Verified-blue?style=flat-square)](cases/)
[![SLA](https://img.shields.io/badge/Emergency%20SLA-1%20Hour-orange?style=flat-square)](https://www.fiverr.com/s/BRB54Qk)
[![Fiverr Service](https://img.shields.io/badge/Fiverr%20Gig-Hire%20Engineer-success?style=flat-square&logo=fiverr)](https://www.fiverr.com/s/BRB54Qk)

Welcome to the **Production Incident Fixes & Technical Post-Mortem Knowledge Base**.  
This repository houses real, verified production failure diagnostics, root-cause analyses, and executable bugfixes across modern automation backends.

🌐 **Live Web Showcase**: [https://grinem.github.io/n8n-production-incident-fixes/](https://grinem.github.io/n8n-production-incident-fixes/)

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


---

## 🏗️ Architecture & Continuous Sync

All incident post-mortems in this repository are autonomously generated and synchronized from our 24/7 **Production Lead & Error Radar**:

```
 ┌──────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
 │ Production Incident  │ ───► │ Autonomous Error Radar  │ ───► │ SQLite State Store      │
 │ (n8n/Make/APIs/Logs) │      │ (Root Cause Diagnostic) │      │ (/root/lead_radar_auto) │
 └──────────────────────┘      └─────────────────────────┘      └────────────┬────────────┘
                                                                             │
                                                                             ▼
 ┌──────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
 │ GitHub Pages Site    │ ◄─── │ GitHub Repo Sync Engine │ ◄─── │ Markdown Case Exporter  │
 │ (grinem.github.io)   │      │ (git push origin main)  │      │ (Anonymized & Cleaned)  │
 └──────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## 📚 Documented Production Incidents (27)

| Ecosystem | Incident Case Study | Root Cause Snapshot | Severity | Solution Link |
|:----------|:--------------------|:--------------------|:--------:|:-------------:|
| **n8n** | [Root `pnpm test` fails because the @n8n/typeorm test script needs ormconfig.json](cases/root-pnpm-test-fails-because-the-n8n-typeorm-test-script-needs-or.md) | In the root `package.json`, running `pnpm test` triggers Turborepo (`turbo run test`). Turbo executes the `test` lifecycle across all workspace packages, including `packages/Cli... | 🔴 `CRITICAL` | [**Solution**](cases/root-pnpm-test-fails-because-the-n8n-typeorm-test-script-needs-or.md) |
| **Activepieces** | [[Feature]: Platform Secret Managers: AWS provider should accept IAM role auth (default credential chain) instead of only static access keys](cases/platform-secret-managers-aws-provider-should-accept-iam-role-auth.md) | You hit the nail on the head. In enterprise deployments on AWS (especially EKS with IRSA or ECS Fargate/EC2 instance roles), requiring static long-lived IAM keys breaks standard... | 🟡 `MEDIUM` | [**Solution**](cases/platform-secret-managers-aws-provider-should-accept-iam-role-auth.md) |
| **n8n** | [ErrorReporter logs every error at error level when Sentry is not configured](cases/errorreporter-logs-every-error-at-error-level-when-sentry-is-not.md) | When Sentry is active, Sentry's `beforeSend` hook filters out or appropriately segments `info` and `warning` scopes. However, in standalone/self-hosted environments where Sentry... | 🟠 `HIGH` | [**Solution**](cases/errorreporter-logs-every-error-at-error-level-when-sentry-is-not.md) |
| **n8n** | [Workflow version restore blocked by deleted credential in a disabled, disconnected node](cases/workflow-version-restore-blocked-by-deleted-credential-in-a-disab.md) | When you trigger a workflow restore from the UI, the backend (`WorkflowHistoryService`) deserializes the historical snapshot stored in the database and runs an ACL integrity che... | 🔴 `CRITICAL` | [**Solution**](cases/workflow-version-restore-blocked-by-deleted-credential-in-a-disab.md) |
| **Bubble.io** | [Platform unavailable - error code 1794338958142x997066484691378600](cases/platform-unavailable-error-code-1794338958142x997066484691378600.md) | When Bubble throws an error code with that structure (a timestamp hash followed by an internal correlation ID, like `1794338958142x997066484691378600`), it is **not a global Bub... | 🔴 `CRITICAL` | [**Solution**](cases/platform-unavailable-error-code-1794338958142x997066484691378600.md) |
| **n8n** | [Broken CONTRIBUTING/LICENSE links in package READMEs](cases/broken-contributing-license-links-in-package-readmes.md) | 1. **On GitHub:** The links use relative paths like `CONTRIBUTING[.]md` inside sub-directories such as `packages/Client Case Study (User)/utils/`. GitHub evaluates this relative... | 🟡 `MEDIUM` | [**Solution**](cases/broken-contributing-license-links-in-package-readmes.md) |
| **Meta / Webhooks** | [Meta Lead Ads test lead stuck in Pending status](cases/meta-lead-ads-test-lead-stuck-in-pending-status.md) | B Krishna, | 🟠 `HIGH` | [**Solution**](cases/meta-lead-ads-test-lead-stuck-in-pending-status.md) |
| **Bubble.io** | [Error loading non-conflicting changes when merging a branch into main](cases/error-loading-non-conflicting-changes-when-merging-a-branch-into.md) | This specific error occurs when Bubble's underlying JSON tree parser encounters orphaned unique identifiers (`UIDs`), broken element parent-child references, or invalid schema n... | 🔴 `CRITICAL` | [**Solution**](cases/error-loading-non-conflicting-changes-when-merging-a-branch-into.md) |
| **Make.com** | [WhatsApp Coexistence fails with Meta error #3441038 before QR code](cases/whatsapp-coexistence-fails-with-meta-error-3441038-before-qr-code.md) | You pinpointed the exact root cause: *"Neither can access the business portfolio that owns the Page."* | 🔴 `CRITICAL` | [**Solution**](cases/whatsapp-coexistence-fails-with-meta-error-3441038-before-qr-code.md) |
| **Make.com** | [Does restoring a Make scenario preserve its webhook queue?](cases/does-restoring-a-make-scenario-preserve-its-webhook-queue.md) | Here is the exact technical behavior of Make concerning scenario versions, webhook bindings, and queued requests. | 🟡 `MEDIUM` | [**Solution**](cases/does-restoring-a-make-scenario-preserve-its-webhook-queue.md) |
| **Make.com** | [Custom app review stuck since 22 Sep after requested changes (CONTACT AI, eu2)](cases/custom-app-review-stuck-since-22-sep-after-requested-changes-cont.md) | This is an identified operational bottleneck in the Make ecosystem: the submission routing for the **Custom Apps → Review** category in the Help Center utilizes an automated def... | 🟠 `HIGH` | [**Solution**](cases/custom-app-review-stuck-since-22-sep-after-requested-changes-cont.md) |
| **Baserow** | [Error: integration of e-mail address for automations](cases/error-integration-of-e-mail-address-for-automations.md) | 1. **`[Errno 101] Network is unreachable` (Baserow Cloud Egress Policy):** | 🔴 `CRITICAL` | [**Solution**](cases/error-integration-of-e-mail-address-for-automations.md) |
| **Make.com** | [WhatsApp Business Cloud Watch Events webhook receives no incoming messages](cases/whatsapp-business-cloud-watch-events-webhook-receives-no-incoming.md) | Meta requires two distinct layers for WhatsApp Cloud API webhooks: | 🔴 `CRITICAL` | [**Solution**](cases/whatsapp-business-cloud-watch-events-webhook-receives-no-incoming.md) |
| **Make.com** | [Does a verified app stay published if the owner downgrades to Free? (ticket form not working)](cases/does-a-verified-app-stay-published-if-the-owner-downgrades-to-fre.md) | Here are the definitive answers regarding how verified Custom Apps behave when changing plans, along with a quick workaround for the ticket form issue. | 🔴 `CRITICAL` | [**Solution**](cases/does-a-verified-app-stay-published-if-the-owner-downgrades-to-fre.md) |
| **Bubble.io** | [Spike in server timeouts Nov 9th](cases/spike-in-server-timeouts-nov-9th.md) | Transient timeouts on jobs that usually execute in milliseconds are almost always caused by one of two things: underlying infrastructure noise (cluster/proxy saturation) or inte... | 🟠 `HIGH` | [**Solution**](cases/spike-in-server-timeouts-nov-9th.md) |
| **Bubble.io** | [Issue with Bubble's Native Geographic Places Search](cases/issue-with-bubble-s-native-geographic-places-search.md) | This is a very common issue resulting from Google's recent rollout of the "Places API (New)". Here is what is happening under the hood and how to fix both your native Search Box... | 🔴 `CRITICAL` | [**Solution**](cases/issue-with-bubble-s-native-geographic-places-search.md) |
| **Make.com** | [Instagram for Business: Facebook Page Not Showing and Webhook Error](cases/instagram-for-business-facebook-page-not-showing-and-webhook-erro.md) | This is a well-known issue when setting up the **Instagram for Business** "Watch Events" webhook in Make, and it stems from two separate factors: an incomplete Graph API asset l... | 🔴 `CRITICAL` | [**Solution**](cases/instagram-for-business-facebook-page-not-showing-and-webhook-erro.md) |
| **n8n** | [Ok / failed / unknown - what we log so ambiguous failures get found](cases/ok-failed-unknown-what-we-log-so-ambiguous-failures-get-found.md) | Here is what is likely causing this issue and how to resolve it: | 🟠 `HIGH` | [**Solution**](cases/ok-failed-unknown-what-we-log-so-ambiguous-failures-get-found.md) |
| **n8n** | [Building agents for clients: how did you find out the last time one failed silently?](cases/building-agents-for-clients-how-did-you-find-out-the-last-time-on.md) | Hello @/u/Ok-Machine7983, | 🟡 `MEDIUM` | [**Solution**](cases/building-agents-for-clients-how-did-you-find-out-the-last-time-on.md) |
| **n8n** | [Cloud instance stuck on "Your instance is starting" for over 2 hours](cases/cloud-instance-stuck-on-your-instance-is-starting-for-over-2-hour.md) | This issue happens when the n8n Cloud provisioning orchestrator gets stuck in a state machine transition. | 🟠 `HIGH` | [**Solution**](cases/cloud-instance-stuck-on-your-instance-is-starting-for-over-2-hour.md) |
| **Make.com** | [Workflow Reliability Reviews, Webhook Testing & Automation Handoffs](cases/workflow-reliability-reviews-webhook-testing-automation-handoffs.md) | Here is what is likely causing this issue and how to resolve it: | 🟡 `MEDIUM` | [**Solution**](cases/workflow-reliability-reviews-webhook-testing-automation-handoffs.md) |
| **n8n** | [5 things that make client n8n workflows fail at 2am, and the fix for each](cases/5-things-that-make-client-n8n-workflows-fail-at-2am-and-the-fix-f.md) | === SECTION 0: RESUME DU PROBLEME EN FRANCAIS === | 🔴 `CRITICAL` | [**Solution**](cases/5-things-that-make-client-n8n-workflows-fail-at-2am-and-the-fix-f.md) |
| **n8n** | [Duplicate bookings after a tool timeout - what the logs taught us](cases/duplicate-bookings-after-a-tool-timeout-what-the-logs-taught-us.md) | Le créateur du flux utilise un agent IA n8n en production pour orchestrer la réservation automatisée de rendez-vous pour un cabinet dentaire. Lors d'un appel d'outil (tool call)... | 🔴 `CRITICAL` | [**Solution**](cases/duplicate-bookings-after-a-tool-timeout-what-the-logs-taught-us.md) |
| **n8n** | [Troubleshooting Telegram API Errors: 'Thumbnail as Animation' & 'No Document in Request' when using n8n HTTP Request](cases/troubleshooting-telegram-api-errors-thumbnail-as-animation-no-doc.md) | === SECTION 0: RESUME DU PROBLEME EN FRANCAIS === | 🟠 `HIGH` | [**Solution**](cases/troubleshooting-telegram-api-errors-thumbnail-as-animation-no-doc.md) |
| **n8n** | [Learning n8n: How Do You Handle Workflow Failures?](cases/learning-n8n-how-do-you-handle-workflow-failures.md) | === SECTION 0: RESUME DU PROBLEME EN FRANCAIS === | 🔴 `CRITICAL` | [**Solution**](cases/learning-n8n-how-do-you-handle-workflow-failures.md) |
| **Make.com** | [NAIF Gravity — API, Webhook & JSON Troubleshooting](cases/naif-gravity-api-webhook-json-troubleshooting.md) | === SECTION 0: RESUME DU PROBLEME EN FRANCAIS === | 🔴 `CRITICAL` | [**Solution**](cases/naif-gravity-api-webhook-json-troubleshooting.md) |
| **Make.com** | [AI Automation Delivery Lead | Make.com builds with tested AI steps and real error handling](cases/ai-automation-delivery-lead-make-com-builds-with-tested-ai-steps.md) | === SECTION 0: RESUME DU PROBLEME EN FRANCAIS === | 🔴 `CRITICAL` | [**Solution**](cases/ai-automation-delivery-lead-make-com-builds-with-tested-ai-steps.md) |

---

## 🚨 Emergency Support & SLA

Encountering an active production outage, a broken webhook, or an unexpected platform crash?  
I specialize in high-stakes emergency automation recovery:

1. **Instant Root-Cause Isolation**: Pinpointing SQL deadlocks, schema mismatches, and auth expiration.
2. **Minimal-Downtime Hotfix**: Patching workflows, container environments, and database records safely.
3. **Hardened Resilience**: Implementing retry queues, exponential backoff, and idempotent consumers.

👉 [**Book Emergency 1-Hour Incident Resolution on Fiverr**](https://www.fiverr.com/s/BRB54Qk)

---

© 2026 grinem — Autonomous Production Engineering Portfolio.
