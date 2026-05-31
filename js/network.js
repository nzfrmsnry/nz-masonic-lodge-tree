let cy; let allData;
document.addEventListener("DOMContentLoaded", async () => {
  try { allData = await loadAllData(); buildNetwork(allData); setupControls(); }
  catch (error) { document.getElementById("cy").innerHTML = `<div class="error">${error.message}</div>`; console.error(error); }
});
function buildNetwork(data) {
  const lodgeIds = new Set(data.lodges.map(l => l.LodgeID));
  const nodes = data.lodges.map(lodge => ({ data: { id: lodge.LodgeID, label: lodgeDisplayName(lodge), name: lodge.LodgeName || "", number: lodge.LodgeNumber || "", status: lodge.Status || "Unknown", crest: lodge.CrestImage || APP_CONFIG.defaultCrestImage }, classes: statusClass(lodge.Status) }));
  const edges = data.relationships.filter(rel => lodgeIds.has(rel.FromLodgeID) && lodgeIds.has(rel.ToLodgeID)).map(rel => ({ data: { id: rel.RelationshipID || `${rel.FromLodgeID}_${rel.ToLodgeID}_${rel.RelationshipType}`, source: rel.FromLodgeID, target: rel.ToLodgeID, label: rel.RelationshipType || "Related", type: rel.RelationshipType || "Related" }, classes: relationshipClass(rel.RelationshipType) }));
  cy = cytoscape({ container: document.getElementById("cy"), elements: [...nodes, ...edges], style: [
    { selector: "node", style: { "label": "data(label)", "text-wrap": "wrap", "text-max-width": 130, "text-valign": "bottom", "text-halign": "center", "font-size": 11, "background-color": "#ffffff", "background-image": "data(crest)", "background-fit": "contain", "background-clip": "none", "background-width": "70%", "background-height": "70%", "border-width": 2, "border-color": "#1f2933", "width": 72, "height": 72 } },
    { selector: "node.active", style: { "border-color": "#1f2933", "border-width": 3 } },
    { selector: "node.closed", style: { "opacity": 0.55, "border-style": "dashed" } },
    { selector: "node.amalgamated", style: { "border-style": "dashed", "border-width": 4 } },
    { selector: "node.historical", style: { "opacity": 0.75 } },
    { selector: "edge", style: { "width": 2, "line-color": "#66717e", "target-arrow-color": "#66717e", "target-arrow-shape": "triangle", "curve-style": "bezier", "label": "data(label)", "font-size": 9, "text-rotation": "autorotate", "text-background-color": "#ffffff", "text-background-opacity": 0.8, "text-background-padding": 2 } },
    { selector: "edge.amalgamation", style: { "line-style": "dashed", "width": 3 } },
    { selector: "edge.rename", style: { "line-style": "dotted" } },
    { selector: ".hidden", style: { "display": "none" } }
  ], layout: { name: "breadthfirst", directed: true, padding: 40, spacingFactor: 1.25, avoidOverlap: true } });
  cy.on("tap", "node", event => { window.location.href = `lodge.html?id=${encodeURIComponent(event.target.id())}`; });
}
function statusClass(status) { const value = String(status || "").toLowerCase(); if (value.includes("active")) return "active"; if (value.includes("closed")) return "closed"; if (value.includes("amalgamated")) return "amalgamated"; if (value.includes("historical")) return "historical"; return "unknown"; }
function relationshipClass(type) { const value = String(type || "").toLowerCase(); if (value.includes("amalgam")) return "amalgamation"; if (value.includes("rename")) return "rename"; return "sponsored"; }
function setupControls() { document.getElementById("fitButton").addEventListener("click", () => { if (cy) cy.fit(undefined, 40); }); document.getElementById("searchBox").addEventListener("input", applyFilters); document.getElementById("statusFilter").addEventListener("change", applyFilters); }
function applyFilters() {
  const search = document.getElementById("searchBox").value.trim().toLowerCase(); const status = document.getElementById("statusFilter").value.trim().toLowerCase();
  cy.nodes().forEach(node => { const data = node.data(); const matchesSearch = !search || String(data.name).toLowerCase().includes(search) || String(data.number).toLowerCase().includes(search) || String(data.label).toLowerCase().includes(search); const matchesStatus = !status || String(data.status).toLowerCase() === status; node.toggleClass("hidden", !(matchesSearch && matchesStatus)); });
  cy.edges().forEach(edge => { const sourceVisible = !edge.source().hasClass("hidden"); const targetVisible = !edge.target().hasClass("hidden"); edge.toggleClass("hidden", !(sourceVisible && targetVisible)); });
}
