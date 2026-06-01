/*
  CONFIGURATION FILE

  Replace the local CSV file paths below with your published Google Sheets CSV links.

  Example Google Sheets CSV link:
  https://docs.google.com/spreadsheets/d/e/2PACX-1vR3jszO3kCu-oktv5lmJ74qyRWS-F-DJPlfmwEgCzTZ6qtHYiu0R_apMvh3_CZKow/pub?gid=126382585&single=true&output=csv

  For first testing, this starter website uses local sample files in the /data folder.
*/

const APP_CONFIG = {
  siteTitle: "New Zealand Masonic Lodge Family Tree",

  dataSources: {
    lodges: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3jszO3kCu-oktv5lmJ74qyRWS-F-DJPlfmwEgCzTZ6qtHYiu0R_apMvh3_CZKow/pub?gid=126382585&single=true&output=csv",
    relationships: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3jszO3kCu-oktv5lmJ74qyRWS-F-DJPlfmwEgCzTZ6qtHYiu0R_apMvh3_CZKow/pub?gid=1469414122&single=true&output=csv",
    amalgamations: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3jszO3kCu-oktv5lmJ74qyRWS-F-DJPlfmwEgCzTZ6qtHYiu0R_apMvh3_CZKow/pub?gid=708531209&single=true&output=csv",
    timelineEvents: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR3jszO3kCu-oktv5lmJ74qyRWS-F-DJPlfmwEgCzTZ6qtHYiu0R_apMvh3_CZKow/pub?gid=1344416449&single=true&output=csv"
  },

  defaultCrestImage: "images/crests/generic-square-compass.svg",

  // Set to true to show only rows where Approved = Yes.
  approvedOnly: false
};
