# Last Updated Feature Documentation

## Overview

The website footer now displays the date and time when the last code push happened, formatted in 24-hour format.

## How it Works

### Components

1. **Build Info Utility** (`src/utils/buildInfo.js`)

   - Retrieves last updated and build date from environment variables
   - Formats dates in DD/MM/YYYY, HH:MM format (24-hour)

2. **Footer Component** (`src/components/Footer.js`)

   - Displays the last updated information in the footer
   - Shows as "Last updated: DD/MM/YYYY, HH:MM"

3. **Build Script** (`scripts/generate-build-info.js`)
   - Gets the last git commit date using `git log -1 --format=%ci`
   - Generates current build date
   - Updates `.env.local` with the information

### Build Process

The `prebuild` script automatically runs before `npm run build` to generate fresh build information:

```json
{
  "scripts": {
    "prebuild": "node scripts/generate-build-info.js",
    "build": "next build"
  }
}
```

### Environment Variables

The script generates these environment variables in `.env.local`:

- `NEXT_PUBLIC_LAST_UPDATED`: Date of the last git commit
- `NEXT_PUBLIC_BUILD_DATE`: Current build timestamp

### Usage

1. **Automatic**: Runs automatically during build process
2. **Manual**: Run `npm run generate-build-info` to update manually

### Display Format

The footer displays: "Last updated: 14/08/2025, 02:17"

### Fallback Behavior

If git is not available or there are no commits, the script falls back to using the current date/time.

## Example Output

```
Last updated: 14/08/2025, 02:17
```

This shows the website was last updated on August 14th, 2025 at 2:17 AM.
