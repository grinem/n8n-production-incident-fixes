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
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `HIGH`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-12T08:00:42.008200`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

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

```json
{
  "query": "mutation fileCreate($files: [FileCreateInput!]!) { fileCreate(files: $files) { files { id alt createdAt fileStatus ... on GenericFile { url } ... on MediaImage { image { url } } } userErrors { field message } } }",
  "variables": {
    "files": [
      {
        "alt": "Packing slip photo",
        "contentType": "IMAGE",
        "originalSource": "[https]://drive[.]google[.]com/uc?export=download&id=YOUR_DRIVE_FILE_ID"
      }
    ]
  }
}
```

*(Note: Replace `[https]://drive[.]google[.]com/...` with your actual defanged download link pattern or mapped variable from your Google Drive module).*

---

### Step 4: Attach the Resulting File GID to the Order Metafield

Once `fileCreate` runs, Shopify returns a File ID (`gid://shopify/MediaImage/123456789`). You then execute `metafieldsSet` on the order using another GraphQL call in Make:

```json
{
  "query": "mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { metafields { id key value } userErrors { field message } } }",
  "variables": {
    "metafields": [
      {
        "ownerId": "gid://shopify/Order/YOUR_SHOPIFY_ORDER_ID",
        "namespace": "custom",
        "key": "carton_photos",
        "type": "list.file_reference",
        "value": "[\"gid://shopify/MediaImage/123456789\"]"
      }
    ]
  }
}
```

*(Remember that for `list.file_reference`, the `value` must be a stringified JSON array containing the file GIDs).*

If you'd like, I can also share the complete JSON blueprint / flow template with you for free—just let me know and I'll send it over.

Feel free to post your Google Drive file output bundle or GraphQL response here if you encounter any edge cases while mapping the order ID!

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 Astreinte d'Urgence 1h — $99 (19000 DA) | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
