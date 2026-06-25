// ── storage.js ───────────────────────────────
// All data functions — uses _supabase client
// ─────────────────────────────────────────────

// ── PROJECTS ──

async function getProjects() {
    const { data, error } = await _supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: false });
    if (error) { console.error(error.message); return []; }
    return data || [];
}

async function insertProject(obj) {
    const { error } = await _supabase.from("projects").insert([obj]);
    if (error) throw error;
}

async function editProject(id, changes) {
    const { error } = await _supabase.from("projects").update(changes).eq("id", id);
    if (error) throw error;
}

async function removeProject(id) {
    const { error } = await _supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
}

// ── JOURNALS ──

async function getJournals() {
    const { data, error } = await _supabase
        .from("journals")
        .select("*")
        .order("id", { ascending: false });
    if (error) { console.error(error.message); return []; }
    return data || [];
}

async function insertJournal(obj) {
    const { error } = await _supabase.from("journals").insert([obj]);
    if (error) throw error;
}

async function editJournal(id, changes) {
    const { error } = await _supabase.from("journals").update(changes).eq("id", id);
    if (error) throw error;
}

async function removeJournal(id) {
    const { error } = await _supabase.from("journals").delete().eq("id", id);
    if (error) throw error;
}

// ── FAILURES ──

async function getFailures() {
    const { data, error } = await _supabase
        .from("failures")
        .select("*")
        .order("id", { ascending: false });
    if (error) { console.error(error.message); return []; }
    return data || [];
}

async function insertFailure(obj) {
    const { error } = await _supabase.from("failures").insert([obj]);
    if (error) throw error;
}

async function editFailure(id, changes) {
    const { error } = await _supabase.from("failures").update(changes).eq("id", id);
    if (error) throw error;
}

async function removeFailure(id) {
    const { error } = await _supabase.from("failures").delete().eq("id", id);
    if (error) throw error;
}

// ── SKILLS ──

async function getSkills() {
    const { data, error } = await _supabase
        .from("skills")
        .select("*")
        .eq("id", 1)
        .single();
    if (error) {
        console.error(error.message);
        return { linux:0, python:0, cybersecurity:0, networking:0, cloud:0 };
    }
    return data;
}

async function saveSkills(obj) {
    const { error } = await _supabase
        .from("skills")
        .upsert({ id: 1, ...obj });
    if (error) throw error;
}

// ── GOALS ──

async function getGoals() {
    const { data, error } = await _supabase
        .from("goals")
        .select("*")
        .order("id", { ascending: true });
    if (error) { console.error(error.message); return []; }
    return data || [];
}

async function editGoal(id, text) {
    const { error } = await _supabase.from("goals").update({ text }).eq("id", id);
    if (error) throw error;
}

// ── AUTH ──

async function authLogin(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, msg: error.message };
    return { ok: true, user: data.user };
}

async function authLogout() {
    await _supabase.auth.signOut();
}

async function getSession() {
    const { data } = await _supabase.auth.getSession();
    return data.session;
}

// ── HELPERS ──

function todayDate() {
    return new Date().toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
    });
}
