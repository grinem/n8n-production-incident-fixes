---
layout: default
title: "WhatsApp Business Cloud Watch Events webhook receives no incoming messages"
platform: "Make.com"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-10
tags: ["make", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "whatsapp-business-cloud-watch-events-webhook-receives-no-incoming"
---

# WhatsApp Business Cloud Watch Events webhook receives no incoming messages


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-10T18:20:17.260941`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

The fact that you received a `WEBHOOK_CONFIG_UPDATED` / `account_update` event proves that your webhook endpoint and verification token are active between Meta and Make. You are completely right in your diagnosis: your WhatsApp Business Account (WABA) is missing the active subscription to the `messages` webhook field.

Here is why this happens and the two ways to resolve it:

---

### Why this happens
Meta requires two distinct layers for WhatsApp Cloud API webhooks:
1. **Endpoint Configuration:** Establishing the callback URL and verify token (which succeeded on your setup).
2. **Field Subscription:** Explicitly subscribing your WABA to specific topics (such as `messages`) via the `/{WABA_ID}/subscribed_apps` endpoint.

When using Make’s default managed app connection, Make attempts to subscribe to these fields automatically during the embedded OAuth flow. This subscription call can silently fail or omit `messages` if:
- Granular permissions were skipped during the Facebook OAuth popup.
- The phone number has two-step verification or catalog routing issues still pending in Meta Business Suite.
- Meta’s Graph API experienced a synchronization hiccup when firing `subscribed_apps`.

---

### Solution 1: Force a Fresh Re-authorization in Make (No Developer Account Needed)

Since Make's managed app handles the API credentials, re-triggering the embedded signup with explicit permissions usually resolves the missing subscription:

1. In **Meta Business Suite** (business.facebook.com):
   - Navigate to **Settings** > **WhatsApp Accounts**.
   - Select your WABA and verify that your phone number shows an **Active / Connected** status with no pending alerts.
2. In **Make.com**:
   - Open your scenario and open the **Watch Events** module.
   - Click **Add** next to the Webhook field (do not reuse the old webhook).
   - In the connection picker, click **Add** to create a brand new connection using the default **WhatsApp Business Cloud** type.
   - When the Meta login modal opens, click **Edit Settings** (do not just click "Continue"). Ensure that:
     - Your exact Meta Business Account is selected.
     - Your specific WhatsApp Business Account (WABA) and phone number are selected.
     - All permissions (especially *Manage and access WhatsApp messages*) are toggled **ON**.
   - Complete the authorization. Make will register a brand-new webhook and re-invoke the subscription endpoint for `messages`.
3. Set your scenario to **Run Once** (or keep it **Active**) and send a test message from a customer phone number.

---

### Solution 2: Switch to a Custom Meta App (Full Visibility & Control)

If Meta's managed app still fails to subscribe to the `messages` topic, switching to a Custom App gives you direct access to the webhook toggles in the Meta Developer Portal. It takes about 5 minutes and is completely free:

1. Go to [Meta for Developers](https://developers.facebook.com/) and log in with your Facebook account.
2. Click **Create App** > select **Other** > **Business**.
3. Under **Add products to your app**, select **WhatsApp** and click **Set up**.
4. In the left navigation, go to **WhatsApp** > **Configuration**:
   - Copy the Webhook URL from your Make **Watch Events** module.
   - Enter your Verify Token from Make.
   - Under **Webhook Fields**, click **Manage** and explicitly click **Subscribe** on the **`messages`** row.
5. In **Meta Business Settings** > **Users** > **System Users**:
   - Create a System User with an **Admin** role.
   - Assign your WhatsApp Account to this user with full control.
   - Generate a permanent access token with `whatsapp_business_messaging` and `whatsapp_business_management`.
6. Back in Make, create a new connection using **WhatsApp Business Cloud (Custom App)** and supply your App ID, App Secret, and the permanent System User token.

Once subscribed to the `messages` field, incoming customer payloads will trigger your scenario immediately.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**Hire me on Fiverr for 1-Hour Emergency Incident Resolution**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
