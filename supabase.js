const SUPABASE_URL =
"https://rctjrobphjtxbouvjrus.supabase.co";

const SUPABASE_KEY =
"YOUR_PUBLISHABLE_KEY";

const db =
window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
console.log(supabase);
alert(typeof db.from);
alert("Supabase JS Loaded");
alert(typeof window.supabase);
alert(Object.keys(window.supabase));
