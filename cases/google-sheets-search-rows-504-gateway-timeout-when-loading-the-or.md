---
layout: default
title: "Google Sheets Search Rows: 504 Gateway Timeout when loading the \"Order by\" field"
platform: "Make.com"
severity: "MEDIUM"
status: "Resolved"
date: 2026-11-13
tags: ["make", "production-fix", "post-mortem", "verified-resolution"]
slug: "google-sheets-search-rows-504-gateway-timeout-when-loading-the-or"
---

# Google Sheets Search Rows: 504 Gateway Timeout when loading the "Order by" field


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


## Incident Metadata
- **Platform / Ecosystem**: `Make.com`
- **Incident Severity**: `MEDIUM`
- **Resolution Status**: `VERIFIED & RESOLVED`
- **Logged Timestamp**: `2026-11-13T08:01:13.237987`
- **Diagnosis Engine**: Autonomous Production Incident Radar

---

## Technical Post-Mortem & Resolution Guide

The 100-second `ECONNABORTED` and subsequent 504 Cloudflare timeout happen because Make's module inspector dynamically queries Google Sheets (`values:batchGet`) to introspect your columns and populate dropdowns like **Order by**.

If Google Sheets takes longer than 100s to calculate or parse the grid, Make's backend drops the connection, triggering the 504 in the builder UI.

Since this was working previously and suddenly started timing out, here is what typically causes it and how to fix it:

### 1. Delete "Ghost" Rows and Columns
Spreadsheets often accumulate tens of thousands of blank, formatted rows or columns over time (especially from imports or copy-pastes). Google's API attempts to scan and evaluate the entire bounded grid.
1. Open the spreadsheet in Google Sheets.
2. Go to the last row containing actual data. Click the row number below it, press `Ctrl + Shift + Down` (or `Cmd + Shift + Down` on Mac) to select all trailing empty rows, right-click, and select **Delete rows**.
3. Do the same for trailing empty columns: click the first unused column letter, press `Ctrl + Shift + Right`, right-click, and select **Delete columns**.

### 2. Check for Heavy/Volatile Formulas
If this specific tab runs `IMPORTRANGE`, `QUERY`, `FILTER`, or volatile functions like `TODAY()` or `NOW()`, Google re-evaluates the entire calculation chain when Make requests the batch values. If possible:
- Move heavy calculation logic or dynamic reporting views to a separate tab.
- Keep the tab Make reads/writes as plain raw data.

### 3. Bypass the Dropdown via the "Map" Toggle
If the sheet is inherently large and you cannot reduce its size:
- Toggle the **Map** switch (the small slider icon next to **Order by**).
- Instead of letting Make fetch the column names automatically, manually enter or map the column letter/name you want to sort by, or leave it blank if ordering is not mandatory at the search level.
- Ensure your **Column range** is tightly bounded (e.g., `A1:K1` instead of scanning wide unneeded ranges).

Once you clean up the blank rows/columns, reload the Make tab and re-open the module—the metadata call should resolve in under a second.

---

## Incident Prevention & Operational Takeaways
1. **Audit Upstream Authentication**: Validate OAuth2 token refresh loops and ensure service credentials cannot be orphaned.
2. **Implement Schema Boundary Validation**: Guard downstream webhooks against unexpected payload truncations.
3. **Automate Error Interception**: Configure fallback nodes and alerting monitors before critical production executions.

---


> ⚡ **Encountering this exact production bug or need an emergency automation fix?**  
> [**🚨 1-Hour Emergency On-Call — $99 | Hire me on Fiverr**](https://www.fiverr.com/s/BRB54Qk)


[← Back to Live Case Studies Index](../)
