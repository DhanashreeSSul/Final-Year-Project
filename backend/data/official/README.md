# Official Data Directory

Place officially downloaded CSV datasets here.

## Structure

```
data/official/
├── jobs/         # Job listing CSVs from official sources
├── courses/      # Training course CSVs from official sources
└── schemes/      # Government scheme CSVs from official sources
```

## CSV Metadata

Each CSV file should have a companion `_meta.json` file with the same base name.

Example: If your CSV is `ncs_jobs_2024.csv`, create `ncs_jobs_2024_meta.json`:

```json
{
  "sourceName": "National Career Service",
  "sourceUrl": "https://www.ncs.gov.in",
  "datasetName": "NCS Job Listings Export",
  "datasetId": "ncs-2024-q1",
  "isOfficialSource": true
}
```

## Important

- Only place real, officially downloaded datasets here
- Do not place synthetic or AI-generated data
- The `isOfficialSource` flag must only be `true` for verified government sources
