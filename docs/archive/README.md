# Documentation Archive

This directory contains archived documentation from previous iterations of the project. Files are preserved here to maintain historical context and ensure no important information is lost during documentation restructuring.

## Structure

```
archive/
├── YYYY-MM-DD/           # Archive date
│   ├── _MANIFEST.md      # List of moved files and their original locations
│   ├── _RATIONALE.md     # Explanation for archival decisions
│   └── content/          # Original files preserved as-is
└── README.md            # This file
```

## Archive Policy

1. **Never Delete**
   - Files are archived, never deleted
   - Original creation dates and git history are preserved
   - Each file's original location is documented

2. **Manifest Required**
   - Every archive operation must include a manifest
   - Original paths must be recorded
   - Movement rationale must be documented

3. **Retrieval Process**
   - Check the _MANIFEST.md in the relevant date folder
   - Files can be found in the content/ directory
   - Original paths are preserved in the manifest

## Retrieval Instructions

1. Locate the relevant archive date folder
2. Check _MANIFEST.md for file location
3. Copy required files from content/
4. Reference _RATIONALE.md for context

## Usage Notes

- Archives are read-only
- New archives should be date-stamped
- Modifications require new archive entries
- Original file structure is preserved within content/
