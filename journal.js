// ── journal.js ───────────────────────────────

let _allJournals = [];

function renderJournals(data) {
  const c = document.getElementById("journalContainer");
  if (!c) return;
  c.innerHTML = "";

  if (!data || data.length === 0) {
    c.innerHTML = `<div class="card"><p style="color:var(--text-muted)">No journal entries yet. Add one from the Control Room.</p></div>`;
    return;
  }

  data.forEach(j => {
    c.innerHTML += `
    <div class="journal-full-card">
      <div class="journal-full-header" onclick="toggleJournal(${j.id})">
        <h3>${j.title}</h3>
        <span class="jdate">${j.date || ""}</span>
        <i class="fas fa-chevron-down journal-chevron" id="chev-${j.id}"></i>
      </div>
      <div class="journal-full-body" id="jbody-${j.id}">
        <p>${j.content}</p>
      </div>
    </div>`;
  });
}

function toggleJournal(id) {
  const body = document.getElementById(`jbody-${id}`);
  const chev = document.getElementById(`chev-${id}`);
  body.classList.toggle("open");
  chev.classList.toggle("open");
}

async function searchJournals() {
  const kw = document.getElementById("searchInput").value.toLowerCase().trim();
  if (!kw) { renderJournals(_allJournals); return; }
  renderJournals(_allJournals.filter(j =>
    j.title.toLowerCase().includes(kw) ||
    (j.content || "").toLowerCase().includes(kw)
  ));
}

(async () => {
  _allJournals = await getJournals();
  renderJournals(_allJournals);
})();
