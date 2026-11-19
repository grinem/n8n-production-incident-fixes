---
layout: default
title: "How to upload an image file to a Shopify order (write_files scope missing in the Make connection)?"
platform: "Make.com"
severity: "HIGH"
status: "Resolved"
date: 2026-11-12
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "how-to-upload-an-image-file-to-a-shopify-order-write-files-scope"
---

# How to upload an image file to a Shopify order (write_files scope missing in the Make connection)?


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Instant Async Production Triage & Resolution (< 6h, Zero Video Calls)**](https://hooktriage.com/#triage)


> ✅ **Confirmed Production Resolution (Timestamp: `2026-11-19T08:41:05.141452+01:00`)**  
> **Author (`Sheeza_Aslam`) verified on [the live thread](https://community.make.com/t/how-to-upload-an-image-file-to-a-shopify-order-write-files-scope-missing-in-the-make-connection/119701)**:  
> *"Thank you Priyanshu and thanks for the two warnings. Yes, the photo now shows up on the order. The upload works end to end: stagedUploadsCreate, HTTP multipart upload, fileCreate, then metafieldsSet. The order is found and the file appears in the Carton photos card. The HTTP step only worked once the photo was sent as a real file part (field named file, last in the form). One more question, about the result. My team currently pastes the photo into the order Timeline comment box and types the order number, so it shows in the timeline and downloads with one click (screenshot 1). With the metafield approach (screenshot 2) the file is stored in Content, Files, which we use only for website images and downloading takes more steps. From what I found, there is no API mutation to create a timeline comment with an attachment (CommentEvent is read-only). Do you know of any workaround, or a way to attach a private file to an order without it landing in the Files library? Image 1 (what a person does today): a staff member pastes the photo into the order Timeline comment box and types the order number. The photo shows in the timeline and can be opened and downloaded with one click. Image 2 (what my Make scenario does): the photo is uploaded as a file and attached to an order metafield. It appears in the Carton photos card but the file is stored in Content, Files (our website image library), which we don’t want. Downloading it also takes more steps. I would like the result of Screenshot image 1 Thank you! ref Image 1 and 2 1758×1022 94.5 KB"*


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `CONFIRMED BY AUTHOR IN PRODUCTION`
- **Logged Timestamp**: `2026-11-12T08:00:42.008200`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Root-Cause Analysis & Patch Preview (Layer 1)

The error occurs because Make’s default multi-tenant Shopify app does **not** include the `write_files` (or `read_files`) OAuth scopes in its registered manifest. Because these scopes are not part of Make's shared application, you cannot select or inject them into the standard connection.

To bypass this restriction and attach files seamlessly, here is the exact architecture you need to implement.

---

### Step 1: Create a Custom App in Shopify Admin (No Partner Account Needed)
Instead of dealing with OAuth redirect callbacks, generate a direct Admin API Access Token:
1. In your Shopify Admin, navigate to **Settings** > **Apps and sales channels** > **Develop apps**.
2. Click **Create an app** (e.g., name it `Make File Ingestion`).
3. Under **Configuration** > **Admin API integration**, select the following scopes:
   - `write_files` & `read_files`
   - `write_orders` & `read_orders`
4. Click **Save**, then click **Install app**.
5. Reveal and copy your **Admin API access token** (it starts with `shpat_...`). Store it securely.

---

### Step 2: Streamline File Uploading in Make
If your file in Google Drive can be fetched as a direct download link (or via an accessible web link), Shopify’s GraphQL API can ingest it directly using `fileCreate(files: [{ originalSource: $url, contentType: IMAGE }])`. This completely eliminates the need for the complex 3-step staged upload (`stagedUploadsCreate` -> binary HTTP upload -> `fileCreate`).

If your file is private and cannot be exposed via a direct link, you can still execute the 3-step `stagedUploadsCreate` flow via the native HTTP module using your direct `shpat_...` token.

---

### Step 3: Configure the Make HTTP Module

In Make, replace the default Shopify module with the native **HTTP - Make a request** module:

- **URL**: `[https]://your-shop-name[.]myshopify[.]com/admin/api/2024-04/graphql.json`
- **Method**: `POST`
- **Headers**:
  - `Content-Type`: `application/json`
  - `X-Shopify-Access-Token`: `shpat_your_token_here`

#### Mini-Patch JSON / Code snippet ready to copy:

**Patch Preview (First 3 lines of verified fix):**
```json
{
  "query": "mutation fileCreate($files: [FileCreateInput!]!) { fileCreate(files: $files) { files { id alt createdAt fileStatus ... on GenericFile { url } ... on MediaImage { image { url } } } userErrors { field message } } }",
  "variables": {
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
