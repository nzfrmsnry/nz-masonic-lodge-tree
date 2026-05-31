document.addEventListener("DOMContentLoaded", async () => {
  try { const data = await loadAllData(); const lodgeId = getQueryParam("id"); if (!lodgeId) { renderError("No lodge ID was provided in the URL."); return; } const lodge = data.lodgeMap.get(lodgeId); if (!lodge) { renderError(`No approved lodge was found for ID: ${lodgeId}`); return; } renderLodgeDetails(lodge); renderRelationships(lodgeId, data); }
  catch (error) { renderError(error.message); console.error(error); }
});
function renderError(message) { document.getElementById("lodgeDetails").innerHTML = `<div class="error">${message}</div>`; }
function field(label, value) { return `<div class="field-label">${label}</div><div>${safeText(value)}</div>`; }
function renderLodgeDetails(lodge) {
  document.title = lodgeDisplayName(lodge); document.getElementById("pageTitle").textContent = lodgeDisplayName(lodge); const crest = lodge.CrestImage || APP_CONFIG.defaultCrestImage;
  document.getElementById("lodgeDetails").innerHTML = `<div class="lodge-header"><img class="lodge-crest" src="${crest}" alt="${safeText(lodge.LodgeName, "Lodge")} crest" /><div><h2>${lodgeDisplayName(lodge)}</h2><p class="muted">${safeText(lodge.Status)} · ${safeText(lodge.Location)}</p><p>${safeText(lodge.ShortHistory, "")}</p></div></div><div class="field-grid">${field("Lodge ID", lodge.LodgeID)}${field("Lodge name", lodge.LodgeName)}${field("Lodge number", lodge.LodgeNumber)}${field("Previous names", lodge.PreviousNames)}${field("Previous numbers", lodge.PreviousNumbers)}${field("Status", lodge.Status)}${field("Consecration date", lodge.ConsecrationDate)}${field("Closure date", lodge.ClosureDate)}${field("Location", lodge.Location)}${field("Constitution", lodge.Constitution)}${field("Notes", lodge.Notes)}</div><h3>History</h3><p>${safeText(lodge.FullHistory, "No detailed history has been added yet.")}</p>`;
}
function renderRelationships(lodgeId, data) {
  const related = data.relationships.filter(rel => rel.FromLodgeID === lodgeId || rel.ToLodgeID === lodgeId); const container = document.getElementById("relatedRelationships");
  if (related.length === 0) { container.innerHTML = `<h2>Related relationships</h2><p>No approved relationships have been recorded for this lodge yet.</p>`; return; }
  const rows = related.map(rel => { const from = data.lodgeMap.get(rel.FromLodgeID); const to = data.lodgeMap.get(rel.ToLodgeID); const fromName = from ? lodgeDisplayName(from) : rel.FromLodgeID; const toName = to ? lodgeDisplayName(to) : rel.ToLodgeID; return `<li><strong>${safeText(rel.RelationshipType, "Related")}</strong>: <a href="lodge.html?id=${encodeURIComponent(rel.FromLodgeID)}">${fromName}</a> → <a href="lodge.html?id=${encodeURIComponent(rel.ToLodgeID)}">${toName}</a> ${rel.RelationshipDate ? `(${rel.RelationshipDate})` : ""} ${rel.Notes ? `<br><span class="muted">${rel.Notes}</span>` : ""}</li>`; }).join("");
  container.innerHTML = `<h2>Related relationships</h2><ul>${rows}</ul>`;
}
