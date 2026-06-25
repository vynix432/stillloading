// ── home.js ──────────────────────────────────

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

async function loadStats() {
  const [projects, journals, failures] = await Promise.all([
    getProjects(), getJournals(), getFailures()
  ]);
  document.getElementById("statProjects").textContent = projects.length;
  document.getElementById("statJournals").textContent = journals.length;
  document.getElementById("statFailures").textContent = failures.length;
}

async function loadSkills() {
  const s = await getSkills();
  const map = [
    ["Linux",         s.linux,         "barLinux",  "pctLinux"],
    ["Python",        s.python,        "barPython", "pctPython"],
    ["Cybersecurity", s.cybersecurity, "barCyber",  "pctCyber"],
    ["Networking",    s.networking,    "barNetwork","pctNetwork"],
    ["Cloud",         s.cloud,        "barCloud",  "pctCloud"],
  ];
  map.forEach(([, val, barId, pctId]) => {
    const v = val || 0;
    const bar = document.getElementById(barId);
    const pct = document.getElementById(pctId);
    if (bar) bar.style.width = v + "%";
    if (pct) pct.textContent = v + "%";
  });
}

async function loadHomeProjects() {
  const container = document.getElementById("homeProjects");
  if (!container) return;
  const data = await getProjects();
  if (data.length === 0) {
    container.innerHTML = `<div class="card"><p style="color:var(--text-muted)">No projects yet. Add one from the Control Room.</p></div>`;
    return;
  }
  data.slice(0, 3).forEach(p => {
    container.innerHTML += `
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

async function loadHomeJournals() {
  const container = document.getElementById("homeJournals");
  if (!container) return;
  const data = await getJournals();
  if (data.length === 0) {
    container.innerHTML = `<div class="card"><p style="color:var(--text-muted)">No entries yet. Write one from the Control Room.</p></div>`;
    return;
  }
  data.slice(0, 3).forEach(j => {
    container.innerHTML += `
    <div class="journal-card">
      <div class="journal-card-title">${j.title}</div>
      <div class="journal-card-preview">${j.content}</div>
      <div class="journal-card-date">${j.date || ""}</div>
    </div>`;
  });
}

async function loadHomeFailures() {
  const container = document.getElementById("homeFailures");
  if (!container) return;
  const data = await getFailures();
  if (data.length === 0) {
    container.innerHTML = `<div class="card"><p style="color:var(--text-muted)">No failure logs yet.</p></div>`;
    return;
  }
  data.slice(0, 2).forEach(f => {
    container.innerHTML += `
    <div class="failure-card">
      <div>
        <span class="failure-tag tag-mistake">Mistake</span>
        <p class="failure-text">${f.mistake}</p>
      </div>
      <div>
        <span class="failure-tag tag-fix">Fix</span>
        <p class="failure-text">${f.fix}</p>
      </div>
      <div>
        <span class="failure-tag tag-lesson">Lesson</span>
        <p class="failure-text">${f.lesson}</p>
      </div>
      <p style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);margin-top:0.5rem">${f.date || ""}</p>
    </div>`;
  });
}

async function loadHomeGoals() {
  const container = document.getElementById("homeGoals");
  if (!container) return;
  const data = await getGoals();
  if (data.length === 0) {
    container.innerHTML = `<div class="card"><p style="color:var(--text-muted)">No goals set yet.</p></div>`;
    return;
  }
  data.forEach(g => {
    container.innerHTML += `
    <div class="goal-card">
      <div class="goal-type">${g.type || "Goal"}</div>
      <div class="goal-text">${g.text}</div>
    </div>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadSkills();
  loadHomeProjects();
  loadHomeJournals();
  loadHomeFailures();
  loadHomeGoals();
});
