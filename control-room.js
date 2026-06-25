// ── control-room.js ──────────────────────────

// ── UTILS ──

const ALL_SECTIONS = [
  "secAddProject","secManageProjects","secEditProject",
  "secAddJournal","secManageJournals","secEditJournal",
  "secAddFailure","secManageFailures","secEditFailure",
  "secSkills","secGoals"
];

function show(id) {
  ALL_SECTIONS.forEach(s => {
    document.getElementById(s)?.classList.add("hidden");
  });
  document.getElementById(id)?.classList.remove("hidden");
  window.scrollTo({ top: 300, behavior: "smooth" });

  // Auto-load list sections
  if (id === "secManageProjects") loadProjectList();
  if (id === "secManageJournals") loadJournalList();
  if (id === "secManageFailures") loadFailureList();
  if (id === "secSkills")         loadSkillsForm();
  if (id === "secGoals")          loadGoalsList();
}

function msg(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.className = "msg-text " + (type === "ok" ? "msg-success" : "msg-error");
  setTimeout(() => { el.textContent = ""; el.className = "msg-text"; }, 3000);
}

// ── AUTH ──

document.addEventListener("DOMContentLoaded", async () => {
  const session = await getSession();
  if (session) enterDash();
});

async function doLogin() {
  const email    = document.getElementById("crEmail").value.trim();
  const password = document.getElementById("crPassword").value.trim();
  const msgEl    = document.getElementById("loginMsg");

  if (!email || !password) {
    msgEl.textContent = "Please enter email and password.";
    msgEl.className = "msg-text msg-error";
    return;
  }

  msgEl.textContent = "Signing in...";
  msgEl.className = "msg-text";

  const result = await authLogin(email, password);

  if (result.ok) {
    enterDash();
  } else {
    msgEl.textContent = result.msg;
    msgEl.className = "msg-text msg-error";
  }
}

function enterDash() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("crdash").classList.remove("hidden");
}

async function doLogout() {
  await authLogout();
  location.reload();
}

// ── PROJECTS ──

async function addProject() {
  const title  = document.getElementById("pTitle").value.trim();
  const desc   = document.getElementById("pDesc").value.trim();
  const github = document.getElementById("pGithub").value.trim();
  if (!title || !desc) { msg("msgAddProject","Fill in title and description.","err"); return; }
  try {
    await insertProject({ title, description: desc, github, date: todayDate() });
    document.getElementById("pTitle").value = "";
    document.getElementById("pDesc").value  = "";
    document.getElementById("pGithub").value = "";
    msg("msgAddProject","Project saved!","ok");
  } catch(e) { msg("msgAddProject", e.message, "err"); }
}

async function loadProjectList() {
  const list = document.getElementById("listProjects");
  list.innerHTML = `<p style="color:var(--text-muted)">Loading...</p>`;
  const data = await getProjects();
  if (data.length === 0) { list.innerHTML = `<p style="color:var(--text-muted)">No projects yet.</p>`; return; }
  list.innerHTML = "";
  data.forEach(p => {
    list.innerHTML += `
    <div class="cr-list-item">
      <div style="flex:1">
        <b>${p.title}</b><br>
        <small>${p.date || ""}</small>
      </div>
      <div class="cr-actions">
        <button class="btn-edit" onclick="openEditProject(${p.id})">Edit</button>
        <button class="btn-del"  onclick="delProject(${p.id})">Delete</button>
      </div>
    </div>`;
  });
}

async function openEditProject(id) {
  const data = await getProjects();
  const p = data.find(x => x.id === id);
  if (!p) return;
  document.getElementById("epId").value    = p.id;
  document.getElementById("epTitle").value = p.title;
  document.getElementById("epDesc").value  = p.description;
  document.getElementById("epGithub").value= p.github || "";
  show("secEditProject");
}

async function updateProject() {
  const id = Number(document.getElementById("epId").value);
  try {
    await editProject(id, {
      title:       document.getElementById("epTitle").value.trim(),
      description: document.getElementById("epDesc").value.trim(),
      github:      document.getElementById("epGithub").value.trim()
    });
    msg("msgEditProject","Project updated!","ok");
    setTimeout(() => show("secManageProjects"), 1000);
  } catch(e) { msg("msgEditProject", e.message, "err"); }
}

async function delProject(id) {
  if (!confirm("Delete this project?")) return;
  try { await removeProject(id); loadProjectList(); }
  catch(e) { alert(e.message); }
}

// ── JOURNALS ──

async function addJournal() {
  const title   = document.getElementById("jTitle").value.trim();
  const content = document.getElementById("jContent").value.trim();
  if (!title || !content) { msg("msgAddJournal","Fill in title and content.","err"); return; }
  try {
    await insertJournal({ title, content, date: todayDate() });
    document.getElementById("jTitle").value   = "";
    document.getElementById("jContent").value = "";
    msg("msgAddJournal","Journal entry saved!","ok");
  } catch(e) { msg("msgAddJournal", e.message, "err"); }
}

async function loadJournalList() {
  const list = document.getElementById("listJournals");
  list.innerHTML = `<p style="color:var(--text-muted)">Loading...</p>`;
  const data = await getJournals();
  if (data.length === 0) { list.innerHTML = `<p style="color:var(--text-muted)">No journal entries yet.</p>`; return; }
  list.innerHTML = "";
  data.forEach(j => {
    list.innerHTML += `
    <div class="cr-list-item">
      <div style="flex:1">
        <b>${j.title}</b><br>
        <small>${j.date || ""}</small>
      </div>
      <div class="cr-actions">
        <button class="btn-edit" onclick="openEditJournal(${j.id})">Edit</button>
        <button class="btn-del"  onclick="delJournal(${j.id})">Delete</button>
      </div>
    </div>`;
  });
}

async function openEditJournal(id) {
  const data = await getJournals();
  const j = data.find(x => x.id === id);
  if (!j) return;
  document.getElementById("ejId").value      = j.id;
  document.getElementById("ejTitle").value   = j.title;
  document.getElementById("ejContent").value = j.content;
  show("secEditJournal");
}

async function updateJournal() {
  const id = Number(document.getElementById("ejId").value);
  try {
    await editJournal(id, {
      title:   document.getElementById("ejTitle").value.trim(),
      content: document.getElementById("ejContent").value.trim()
    });
    msg("msgEditJournal","Journal updated!","ok");
    setTimeout(() => show("secManageJournals"), 1000);
  } catch(e) { msg("msgEditJournal", e.message, "err"); }
}

async function delJournal(id) {
  if (!confirm("Delete this journal entry?")) return;
  try { await removeJournal(id); loadJournalList(); }
  catch(e) { alert(e.message); }
}

// ── FAILURES ──

async function addFailure() {
  const mistake = document.getElementById("fMistake").value.trim();
  const fix     = document.getElementById("fFix").value.trim();
  const lesson  = document.getElementById("fLesson").value.trim();
  if (!mistake || !fix || !lesson) { msg("msgAddFailure","Fill all three fields.","err"); return; }
  try {
    await insertFailure({ mistake, fix, lesson, date: todayDate() });
    document.getElementById("fMistake").value = "";
    document.getElementById("fFix").value     = "";
    document.getElementById("fLesson").value  = "";
    msg("msgAddFailure","Failure log saved!","ok");
  } catch(e) { msg("msgAddFailure", e.message, "err"); }
}

async function loadFailureList() {
  const list = document.getElementById("listFailures");
  list.innerHTML = `<p style="color:var(--text-muted)">Loading...</p>`;
  const data = await getFailures();
  if (data.length === 0) { list.innerHTML = `<p style="color:var(--text-muted)">No failure logs yet.</p>`; return; }
  list.innerHTML = "";
  data.forEach(f => {
    list.innerHTML += `
    <div class="cr-list-item">
      <div style="flex:1">
        <b>${f.date || "Log"}</b><br>
        <small style="color:var(--text-secondary)">${f.mistake.substring(0,60)}${f.mistake.length>60?"...":""}</small>
      </div>
      <div class="cr-actions">
        <button class="btn-edit" onclick="openEditFailure(${f.id})">Edit</button>
        <button class="btn-del"  onclick="delFailure(${f.id})">Delete</button>
      </div>
    </div>`;
  });
}

async function openEditFailure(id) {
  const data = await getFailures();
  const f = data.find(x => x.id === id);
  if (!f) return;
  document.getElementById("efId").value      = f.id;
  document.getElementById("efMistake").value = f.mistake;
  document.getElementById("efFix").value     = f.fix;
  document.getElementById("efLesson").value  = f.lesson;
  show("secEditFailure");
}

async function updateFailure() {
  const id = Number(document.getElementById("efId").value);
  try {
    await editFailure(id, {
      mistake: document.getElementById("efMistake").value.trim(),
      fix:     document.getElementById("efFix").value.trim(),
      lesson:  document.getElementById("efLesson").value.trim()
    });
    msg("msgEditFailure","Failure log updated!","ok");
    setTimeout(() => show("secManageFailures"), 1000);
  } catch(e) { msg("msgEditFailure", e.message, "err"); }
}

async function delFailure(id) {
  if (!confirm("Delete this failure log?")) return;
  try { await removeFailure(id); loadFailureList(); }
  catch(e) { alert(e.message); }
}

// ── SKILLS ──

async function loadSkillsForm() {
  const s = await getSkills();
  document.getElementById("skLinux").value   = s.linux        || 0;
  document.getElementById("skPython").value  = s.python       || 0;
  document.getElementById("skCyber").value   = s.cybersecurity|| 0;
  document.getElementById("skNetwork").value = s.networking   || 0;
  document.getElementById("skCloud").value   = s.cloud        || 0;
}

async function updateSkills() {
  try {
    await saveSkills({
      linux:         Number(document.getElementById("skLinux").value),
      python:        Number(document.getElementById("skPython").value),
      cybersecurity: Number(document.getElementById("skCyber").value),
      networking:    Number(document.getElementById("skNetwork").value),
      cloud:         Number(document.getElementById("skCloud").value)
    });
    msg("msgSkills","Skills updated!","ok");
  } catch(e) { msg("msgSkills", e.message, "err"); }
}

// ── GOALS ──

async function loadGoalsList() {
  const list = document.getElementById("goalsList");
  list.innerHTML = `<p style="color:var(--text-muted)">Loading...</p>`;
  const data = await getGoals();
  if (data.length === 0) { list.innerHTML = `<p style="color:var(--text-muted)">No goals found. Add them via Supabase Table Editor.</p>`; return; }
  list.innerHTML = "";
  data.forEach(g => {
    list.innerHTML += `
    <div style="margin-bottom:1.25rem">
      <label class="form-label">${g.type || "Goal"}</label>
      <input class="form-input" id="goal-${g.id}" value="${g.text}">
      <button class="btn-edit" style="margin-top:6px" onclick="saveGoal(${g.id})">Save</button>
    </div>`;
  });
}

async function saveGoal(id) {
  const text = document.getElementById(`goal-${id}`).value.trim();
  try {
    await editGoal(id, text);
    msg("msgGoals","Goal updated!","ok");
  } catch(e) { msg("msgGoals", e.message, "err"); }
}
