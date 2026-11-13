---
layout: default
title: "Instagram for Business: Facebook Page Not Showing and Webhook Error"
platform: "Make.com"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-10
tags: ["make", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "instagram-for-business-facebook-page-not-showing-and-webhook-erro"
---

# Instagram for Business: Facebook Page Not Showing and Webhook Error


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-10T12:14:58.850682`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

This is a well-known issue when setting up the **Instagram for Business** "Watch Events" webhook in Make, and it stems from two separate factors: an incomplete Graph API asset linkage on Meta's end, and a frontend parser requirement in Make's webhook modal.

Here is why this occurs and how to resolve it step-by-step:

---

### Why is this happening?

1. **"No data available"**: To populate that dropdown, Make queries Meta’s Graph API endpoint (`/me/accounts?fields=id,name,instagram_business_account`). Even if Meta Business Suite indicates your accounts are connected, the underlying Graph API frequently fails to return the `instagram_business_account` edge unless the connection was finalized at the direct Facebook Page level, or if granular permissions during the initial OAuth consent skipped that specific asset. Make automatically filters out any Facebook Page that does not return an associated Instagram Business ID, leaving your dropdown empty.
2. **`Cannot read properties of undefined (reading 'toString')`**: When creating a webhook inside Make, the module expects an object containing both the Page ID and its associated access token to execute the Meta webhook subscription call. Enabling **Map** and passing raw text or a numeric ID bypasses Make's internal object builder, causing Make's frontend code to fail when trying to parse the expected object properties. **Do not use the Map toggle here; the Page must be selected directly from the loaded dropdown list.**

---

### Step-by-Step Resolution Protocol

#### 1. Re-link the Instagram Account at the Page Level
Meta Business Suite and direct Facebook Page settings often fall out of sync:
1. Open Facebook and switch your active profile directly to your **Facebook Page**.
2. Navigate to **Settings > Linked Accounts > Instagram**.
3. If your account is listed, click **Disconnect Account**.
4. Click **Connect Account** to re-link it. During the prompt, ensure the toggle **"Allow access to Instagram messages in Inbox"** is turned **ON** (this forces Meta to run the complete API permissions handshake).

#### 2. Revoke Make’s Existing Token on Facebook
Clear the cached OAuth token so Meta prompts you for full access again:
1. Switch back to your personal Facebook profile.
2. Go to **Settings & Privacy > Settings > Business Integrations** (direct URL: `https://www.facebook.com/settings?tab=business_tools`).
3. Find **Make** (or Make.com), select the checkbox, and click **Remove**.

#### 3. Re-authorize Make with Explicit Asset Selection
1. Go back to your scenario in Make.
2. In the **Watch events** module, click **Add** next to the Connection dropdown (create a brand new connection rather than re-verifying the existing one).
3. When the Meta OAuth popup appears:
   - Do **not** simply click "Continue".
   - Click **Edit access** (or "Edit Settings").
   - Ensure that your Facebook Page and your Instagram Business account are explicitly selected across all permission screens (`pages_show_list`, `instagram_basic`, `instagram_manage_comments`, `pages_read_engagement`).
4. Complete the authorization flow.

#### 4. Configure the Webhook
1. In the module configuration, under **Webhook**, click **Add**.
2. Verify that the **Map** toggle is turned **OFF**.
3. Open the Page dropdown; your Facebook Page will now populate correctly alongside its connected Instagram account.
4. Select the Page, choose the **Comments** event, and click **Save**.

Once configured, any new comment matching your criteria will trigger the webhook instantly, allowing you to pass the data to your Google Sheets module.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
