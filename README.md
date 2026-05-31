# NZ Masonic Lodge Family Tree Starter Website

This is a starter static website for displaying a public interactive network and timeline of Masonic lodges in New Zealand.

## What this package contains

- `index.html` — interactive network page
- `lodge.html` — single lodge detail page
- `timeline.html` — timeline view
- `css/style.css` — website styling
- `js/config.js` — data source settings
- `js/data.js` — CSV loading and parsing
- `js/network.js` — Cytoscape.js network visualisation
- `js/lodge.js` — lodge detail page
- `js/timeline.js` — timeline page
- `images/crests/generic-square-compass.svg` — placeholder crest
- `data/*.csv` — local sample CSV files for testing

## Recommended workflow

1. Upload this folder to your GitHub repository.
2. Enable GitHub Pages from your repository settings.
3. Test the website using the included sample CSV files.
4. Publish your Google Sheets tabs as CSV.
5. Replace the CSV file paths in `js/config.js` with your Google Sheets CSV links.

## Google Sheets tabs expected

The JavaScript expects these sheets or CSV files:

- Lodges
- Relationships
- Amalgamations
- TimelineEvents

## Publishing Google Sheets as CSV

In Google Sheets:

1. Go to **File**
2. Select **Share**
3. Select **Publish to web**
4. Select the tab you want, such as `Lodges`
5. Select format: **Comma-separated values (.csv)**
6. Click **Publish**
7. Copy the link
8. Paste it into `js/config.js`

## Crest images

Put crest images in:

```text
images/crests/
```

Then use the same path in the `CrestImage` column of the Lodges sheet.

Example:

```text
images/crests/lodge-0348.png
```

For lodges without a crest, use:

```text
images/crests/generic-square-compass.svg
```

## Notes

Public submissions should go through Google Forms and be manually approved before they appear on the live website.
