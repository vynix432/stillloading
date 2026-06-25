// ── supabase.js ──────────────────────────────
// Fill in YOUR keys from:
// Supabase → Project Settings → API
// ─────────────────────────────────────────────

const SUPABASE_URL = "https://rctjrobphjtxbouvjrus.supabase.co";
const SUPABASE_KEY = "sb_publishable_HFgVv7e1bs-vudJb0LhLFQ_rUs4xGTz";

// This naming avoids the window.supabase conflict
const _supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
