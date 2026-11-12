---
layout: default
title: "Error: integration of e-mail address for automations"
platform: "Baserow"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-10
tags: ["baserow", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "error-integration-of-e-mail-address-for-automations"
---

# Error: integration of e-mail address for automations


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Baserow`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-10T21:20:19.290397`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

The errors you are encountering stem from two distinct constraints: an infrastructure-level egress restriction on Baserow Cloud and modern authentication policies enforced by Microsoft and Google.

---

### Why this happens:

1. **`[Errno 101] Network is unreachable` (Baserow Cloud Egress Policy):**
   This is a POSIX kernel socket error indicating that outbound TCP connections on port `587` are blocked or have no route at the Baserow Cloud host firewall level. Multi-tenant cloud providers routinely block or filter ports `25` and `587` on free tiers to prevent automated spam abuse and protect their IP reputations.

2. **Microsoft Outlook & Basic Authentication Deprecation:**
   Microsoft officially deprecated legacy Basic Authentication (Username + Password) for consumer (`outlook[.]com` / `hotmail[.]com`) and Microsoft 365 accounts. Connecting to `smtp-mail[.]outlook[.]com` now requires OAuth2 modern token authentication. Because standard SMTP input fields only transmit plain credentials, Microsoft rejects the handshake with `The username or password is incorrect`.

3. **Gmail Authentication Requirements:**
   Google completely blocks standard Google account passwords for SMTP. It requires 2-Step Verification and a generated 16-character **Google App Password**. However, even with an App Password, port `587` will still fail if Baserow Cloud blocks outbound connections.

---

### How to resolve this in Baserow:

#### Option 1: Test SSL on Port 465 with a Gmail App Password
Sometimes outbound port `465` (pure SSL/TLS) is permitted while `587` (STARTTLS) is filtered. If you must use Gmail:
1. Go to your Google Account -> **Security**.
2. Ensure **2-Step Verification** is turned on.
3. Navigate to `myaccount[.]google[.]com/apppasswords`.
4. Generate a new App Password (name it "Baserow"). Copy the 16-character code.
5. In your Baserow SMTP configuration:
   - **Host:** `smtp[.]gmail[.]com`
   - **Port:** `465`
   - **Security / Encryption:** SSL/TLS
   - **Username:** `your-email[at]gmail[.]com`
   - **Password:** The 16-character App Password (without spaces).

#### Option 2: Use a Dedicated Transactional Email Provider (Recommended)
Consumer webmail accounts are not intended for backend automations. A dedicated transactional relay like **Brevo** or **Resend** provides reliable delivery and whitelisted IP ports:
- **Host:** `smtp-relay[.]brevo[.]com`
- **Port:** `587` (or `465` with SSL)
- **Security:** STARTTLS (or SSL on 465)
- **Username:** Your registered Brevo account login
- **Password:** Your generated Brevo SMTP API Master Key

#### Option 3: Direct API Call via Webhook Action (Bypassing SMTP entirely)
If SMTP ports remain unreachable on Baserow Cloud, change your automation action from "Send an email" to an HTTP Call / Webhook step pointing directly to an HTTPS transactional email endpoint (such as Resend over standard port `443`, which is never blocked).

**Endpoint:** `[https]://api[.]resend[.]com/emails`
**Method:** `POST`
**Headers:**
```text
Authorization: Bearer [REDACTED_SECRET]
Content-Type: application/json
```

**JSON Payload:**
```json
{
  "from": "Automations <onboarding[at]resend[.]dev>",
  "to": ["recipient[at]example[.]com"],
  "subject": "Automated Notification from Baserow",
  "html": "<p>Hello,</p><p>This is an automated notification triggered from Baserow table row <strong>{{ fields.Name }}</strong>.</p>"
}
```

If you'd like, I can also share the complete JSON blueprint / flow template with you for free—just let me know and I'll send it over.

Let me know if testing port 465 or switching to the API route resolves the socket unreachable error for you!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
