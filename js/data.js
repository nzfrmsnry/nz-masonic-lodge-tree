async function fetchCsv(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load CSV: ${url}`);
  }

  const text = await response.text();
  return parseCsv(text);
}

function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(current.trim());
      current = "";

      if (row.some(cell => cell !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      current += char;
    }
  }

  if (current || row.length) {
    row.push(current.trim());

    if (row.some(cell => cell !== "")) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map(header => header.trim());

  return rows.slice(1).map(values => {
    const obj = {};

    headers.forEach((header, index) => {
      obj[header] = values[index] || "";
    });

    return obj;
  });
}

function isApproved(row) {
  if (!APP_CONFIG.approvedOnly) {
    return true;
  }

  const value = String(row.Approved || "").trim().toLowerCase();

  return (
    value === "yes" ||
    value === "y" ||
    value === "true" ||
    value === "approved"
  );
}

async function loadAllData() {
  const [lodges, relationships, amalgamations, timelineEvents] = await Promise.all([
    fetchCsv(APP_CONFIG.dataSources.lodges),
    fetchCsv(APP_CONFIG.dataSources.relationships),
    fetchCsv(APP_CONFIG.dataSources.amalgamations),
    fetchCsv(APP_CONFIG.dataSources.timelineEvents)
  ]);

  const approvedLodges = lodges.filter(isApproved);
  const approvedRelationships = relationships.filter(isApproved);
  const approvedAmalgamations = amalgamations.filter(isApproved);
  const approvedTimelineEvents = timelineEvents.filter(isApproved);

  const lodgeMap = new Map();

  approvedLodges.forEach(lodge => {
    lodgeMap.set(lodge.LodgeID, lodge);
  });

  return {
    lodges: approvedLodges,
    relationships: approvedRelationships,
    amalgamations: approvedAmalgamations,
    timelineEvents: approvedTimelineEvents,
    lodgeMap
  };
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function safeText(value, fallback = "—") {
  const text = String(value || "").trim();
  return text || fallback;
}

function lodgeDisplayName(lodge) {
  const name = safeText(lodge.LodgeName, "Unnamed Lodge");
  const number = safeText(lodge.LodgeNumber, "");

  return number && number !== "—" ? `${name} No. ${number}` : name;
}
