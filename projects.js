// ── projects.js ──────────────────────────────

let _allProjects = [];

async function renderProjects(data) {
  const c = document.getElementById("projectsContainer");
  if (!c) return;
  c.innerHTML = "";

  if (!data || data.length === 0) {
    c.innerHTML = `<div class="card" style="grid-column:1/-1"><p style="color:var(--text-muted)">No projects found. Add one from the Control Room.</p></div>`;
    return;
  }

  data.forEach(p => {
    c.innerHTML += `
    <div class="project-card">
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.description}</div>
      <div class="project-footer">
        <span class="project-date">${p.date || ""}</span>
        ${p.github ? `<a href="${p.github}" target="_blank" class="source-link"><i class="fab fa-github"></i> Source code</a>` : ""}
      </div>
    </div>`;
  });
}

async function searchProjects() {
  const kw = document.getElementById("searchInput").value.toLowerCase().trim();
  if (!kw) { renderProjects(_allProjects); return; }
  renderProjects(_allProjects.filter(p =>
    p.title.toLowerCase().includes(kw) ||
    (p.description || "").toLowerCase().includes(kw)
  ));
}

(async () => {
  _allProjects = await getProjects();
  renderProjects(_allProjects);
})();
