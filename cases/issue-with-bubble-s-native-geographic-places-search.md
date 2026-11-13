---
layout: default
title: "Issue with Bubble's Native Geographic Places Search"
platform: "Bubble.io"
severity: "CRITICAL"
status: "Resolved"
date: 2026-11-10
tags: ["bubble", "critical-incident", "production-fix", "post-mortem", "verified-resolution"]
slug: "issue-with-bubble-s-native-geographic-places-search"
---

# Issue with Bubble's Native Geographic Places Search


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Bubble.io`
- **Incident Severity**: `CRITICAL`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-10T12:15:45.659532`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

This is a very common issue resulting from Google's recent rollout of the "Places API (New)". Here is what is happening under the hood and how to fix both your native Search Box and the API Connector database assignment.

---

### 1. Why the Native Search Box is Failing
Bubble’s native `Search Box` element relies on the Google Maps JavaScript SDK and instantiates the legacy `google.maps.places.AutocompleteService()`. 

When Google introduced the "Places API (New)", it was released as an entirely separate service from the classic Places API. If you only enabled **Places API (New)** in your Google Cloud Console, Google will reject all requests coming from Bubble's native element with an `ApiNotActivatedMapError` or `REQUEST_DENIED`.

**How to fix it in Google Cloud Console:**
1. Go to your **Google Cloud Console > APIs & Services > Library**.
2. Search for and enable the legacy **"Places API"** (ensure it does **not** have "(New)" in its name).
3. Verify that you have all three core services enabled on the project:
   - **Maps JavaScript API**
   - **Places API** (Legacy)
   - **Geocoding API**
4. Review your API Key restrictions under **APIs & Services > Credentials**:
   - If your key uses **Application restrictions** set to *Websites (HTTP referrers)*, ensure your app domains are listed (e.g., `https://yourdomain.com/*` and `https://*.bubbleapps.io/*`).
   - Under **API restrictions**, make sure *Places API* and *Maps JavaScript API* are explicitly allowed.

Once the legacy **Places API** is active, Bubble's native Search Box will start returning place predictions immediately.

---

### 2. Why API Connector Data Isn't Saving to `Geographic Address`
Bubble's native `geographic address` field type is not a plain string—it is an internal composite object containing formatted text, latitude, and longitude.

When you assign a plain text string to a `geographic address` field in a workflow (e.g., `Address = API Connector - Get Place's formatted_address`), Bubble automatically triggers a server-side geocoding request in the background using the key defined in **Settings > General > General Services API Keys**.

**Why it saves as empty/null:**
If the API key entered into the **Google Geocoding API key** field in Bubble has an **HTTP referrer restriction**, Google will reject the request. Backend server-side requests originate from Bubble's AWS clusters and do not send browser HTTP referrers. When geocoding fails silently, Bubble leaves the database field empty.

**How to resolve this:**
1. In Google Cloud Console, configure two separate API keys:
   - **Client Key (Google Map API key):** Restricted by HTTP referrers (`*.yourdomain.com/*`, `*.bubbleapps.io/*`), with access restricted to *Maps JavaScript API* and *Places API*.
   - **Server Key (Google Geocoding API key):** Restricted by IP addresses (or left unrestricted / restricted by API only during testing), with access restricted to *Geocoding API*.
2. Paste each key into its corresponding input in Bubble under **Settings > General > General Services API Keys**:
   - Paste the Client Key into **Google Map API key**.
   - Paste the Server Key into **Google Geocoding API key**.
3. In your workflow, assign the formatted address string directly to your `geographic address` field:
   `Address = API Connector's formatted_address`
   With a valid server key, Bubble will successfully geocode the string and store the complete geographic object in your database.

*(Alternative approach: If you prefer bypassing Bubble's geocoding abstraction altogether, create three custom fields on your data type: `Address_Formatted` (text), `Latitude` (number), and `Longitude` (number), and save the coordinates directly from your API response).*

Let me know if your Google Cloud Console has both keys separated, and feel free to share your console error log if you run into any permission issues!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
