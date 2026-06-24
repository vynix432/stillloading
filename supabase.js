const SUPABASE_URL =
"https://rctjrobphjtxbouvjrus.supabase.co";

const SUPABASE_KEY =
"sb_publishable_HFgVv7e1bs-vudJb0LhLFQ_rUs4xGTz";

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);
alert("Supabase JS Loaded");
