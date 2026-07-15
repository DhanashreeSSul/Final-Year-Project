# Real Data Ingestion — Architecture & Guide

## Overview

The Shakti Platform data ingestion system imports **real, source-grounded records** from official government data sources into the PostgreSQL database. Every imported record carries provenance metadata so the chatbot can cite sources accurately.

## Architecture

```
Official Source
    ↓
Source Adapter (fetches raw records)
    ↓
Normalizer (maps fields to DB schema)
    ↓
Validator (rejects incomplete records)
    ↓
Deduplicator (SHA-256 fingerprinting)
    ↓
Importer (UPSERT into PostgreSQL)
```

## Directory Structure

```
backend/src/data-ingestion/
├── sources/                    # Source adapters
│   ├── jobs/
│   │   ├── dataGovJobsSource.js
│   │   └── csvJobsSource.js
│   ├── courses/
│   │   ├── dataGovCoursesSource.js
│   │   └── csvCoursesSource.js
│   └── schemes/
│       ├── dataGovSchemesSource.js
│       └── csvSchemesSource.js
├── normalizers/
│   ├── jobNormalizer.js
│   ├── courseNormalizer.js
│   └── schemeNormalizer.js
├── importers/
│   ├── jobImporter.js
│   ├── courseImporter.js
│   └── schemeImporter.js
├── utils/
│   ├── httpClient.js
│   ├── csvParser.js
│   ├── sourceLogger.js
│   ├── deduplication.js
│   └── validation.js
├── syncJobs.js
├── syncCourses.js
├── syncSchemes.js
└── syncAll.js
```

## Supported Official Sources

### IMPLEMENTED

| Source | Type | Entity | Access Method |
|--------|------|--------|---------------|
| data.gov.in | API | Jobs, Courses, Schemes | REST API with API key |
| Official CSV | File | Jobs, Courses, Schemes | Manual download → import |

### PLANNED (Not Yet Accessible)

| Source | Status | Reason |
|--------|--------|--------|
| National Career Service (NCS) | No public API | Ministry does not expose programmatic access |
| SWAYAM | No public API | Course catalog not available via API |
| Skill India Digital Hub | No public API | Portal-only access |
| myScheme | Requires partnership | Needs API Setu registration |

> **Important**: We do NOT scrape these websites. Adapter stubs exist for when public APIs become available.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATA_GOV_API_KEY` | For API sync | Free API key from data.gov.in |
| `DATA_GOV_RESOURCE_JOBS` | For job sync | Resource ID from data.gov.in |
| `DATA_GOV_RESOURCE_COURSES` | For course sync | Resource ID from data.gov.in |
| `DATA_GOV_RESOURCE_SCHEMES` | For scheme sync | Resource ID from data.gov.in |
| `DATA_SYNC_ENABLED` | Optional | Enable/disable sync (default: false) |
| `DATA_SYNC_INTERVAL_HOURS` | Optional | Auto-sync interval (default: 24) |
| `OFFICIAL_DATA_DIR` | Optional | CSV data directory (default: ./data/official) |

## Database Migration

The provenance migration adds columns to existing tables without modifying or deleting data:

```bash
# Run the additive migration
npm run migrate:provenance
```

Added columns: `source_name`, `source_url`, `source_record_id`, `source_type`, `source_dataset_name`, `last_verified_at`, `imported_at`, `data_status`, `is_official_source`, plus entity-specific fields.

## Running Data Synchronization

```bash
# Sync all entity types
npm run data:sync

# Sync individual types
npm run data:sync:jobs
npm run data:sync:courses
npm run data:sync:schemes
```

Each sync prints a summary:
```
══════════════════════════════════════════════════
📊 Open Government Data Platform India (Jobs) Sync Summary
──────────────────────────────────────────────────
   Fetched:  100
   Valid:    94
   Inserted: 60
   Updated:  30
   Skipped:  4
   Failed:   0
   Time:     2.3s
══════════════════════════════════════════════════
```

## CSV Import

1. Download an official dataset as CSV from a government portal
2. Place the CSV in `backend/data/official/{jobs|courses|schemes}/`
3. Create a companion `_meta.json` file:

```json
{
  "sourceName": "Open Government Data Platform India",
  "sourceUrl": "https://data.gov.in/resource/xxxxx",
  "datasetName": "Employment Exchange Statistics",
  "datasetId": "resource-id-here",
  "isOfficialSource": true
}
```

4. Run `npm run data:sync:jobs` (or courses/schemes)

## Deduplication Strategy

- **If source provides a record ID**: Uses `source_name + source_record_id` as unique key
- **If no record ID**: Generates SHA-256 fingerprint from stable fields:
  - Jobs: `title + company + location + source_name`
  - Courses: `title + provider + source_name`
  - Schemes: `title + ministry + source_name`
- Re-running sync updates existing records instead of creating duplicates

## Stale Data Handling

| Status | Meaning |
|--------|---------|
| `active` | Currently verified and available |
| `stale` | Previously imported but not in latest sync batch |
| `expired` | Past application deadline (jobs only) |
| `unverified` | Could not be verified against source |

The chatbot **only recommends `active` records** and prefers `is_official_source = TRUE`.

## Chatbot Grounding

The chatbot's AI system prompt includes real database records as context:

1. User sends a message
2. `detectIntent()` classifies the query (jobs/courses/schemes/greeting/help/general)
3. Relevant records are retrieved from PostgreSQL (`data_status = 'active'`)
4. Records are formatted as structured context in the AI system prompt
5. The AI is instructed to ONLY recommend from provided records
6. If AI fails, deterministic formatters display the data without AI
7. If no records exist, static `RESPONSES` fallback is used

## Source Provenance

Every imported record tracks:
- **source_name**: e.g., "Open Government Data Platform India"
- **source_url**: Direct link to the source
- **source_record_id**: Original ID from the source
- **source_type**: "api" or "csv"
- **is_official_source**: TRUE only for verified government sources
- **last_verified_at**: Timestamp of last verification

## Known Limitations

1. **NCS jobs**: No public API available. Cannot import real job listings programmatically.
2. **SWAYAM courses**: No public API. Course data must be added via CSV if officially obtained.
3. **myScheme**: Requires API Setu partnership for programmatic access.
4. **data.gov.in**: Requires free registration and API key. Dataset availability varies.
5. **Existing seed data**: The original 6 jobs and 5 courses are seeded from a demo org and are NOT marked as official source data.

## Adding a New Official Data Source

1. Create a source adapter in `sources/{entity_type}/`:
   ```javascript
   module.exports = {
     sourceName: 'Source Name',
     sourceType: 'entity_type',
     async fetchRecords() {
       return {
         records: [...],
         meta: { sourceName, sourceUrl, sourceType, isOfficialSource }
       };
     }
   };
   ```

2. Add it to the `sources` array in the relevant `sync{Entity}.js`

3. If it requires an API key, add the env var to `.env.example`

4. Update this documentation

5. Run the sync and verify with `npm run data:sync:{entity}`
