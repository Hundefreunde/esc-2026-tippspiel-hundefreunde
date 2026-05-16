 import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Users, RotateCcw, Save, BarChart3, Music2, Wifi, Crown, PawPrint, ChevronsRight } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "DEINE_SUPABASE_URL";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "DEIN_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ENTRIES = [
  { country: "Albania", artist: "Alis", song: "Nân" },
  { country: "Armenia", artist: "SIMÓN", song: "Paloma Rumba" },
  { country: "Australia", artist: "Delta Goodrem", song: "Eclipse" },
  { country: "Austria", artist: "COSMÓ", song: "Tanzschein" },
  { country: "Azerbaijan", artist: "JIVA", song: "Just Go" },
  { country: "Belgium", artist: "ESSYLA", song: "Dancing on the Ice" },
  { country: "Bulgaria", artist: "DARA", song: "Bangaranga" },
  { country: "Croatia", artist: "LELEK", song: "Andromeda" },
  { country: "Cyprus", artist: "Antigoni", song: "JALLA" },
  { country: "Czechia", artist: "Daniel Zizka", song: "CROSSROADS" },
  { country: "Denmark", artist: "Søren Torpegaard Lund", song: "Før Vi Går Hjem" },
  { country: "Estonia", artist: "Vanilla Ninja", song: "Too Epic To Be True" },
  { country: "Finland", artist: "Linda Lampenius x Pete Parkkonen", song: "Liekinheitin" },
  { country: "France", artist: "Monroe", song: "Regarde !" },
  { country: "Georgia", artist: "Bzikebi", song: "On Replay" },
  { country: "Germany", artist: "Sarah Engels", song: "Fire" },
  { country: "Greece", artist: "Akylas", song: "Ferto" },
  { country: "Israel", artist: "Noam Bettan", song: "Michelle" },
  { country: "Italy", artist: "Sal Da Vinci", song: "Per Sempre Sì" },
  { country: "Latvia", artist: "Atvara", song: "Ēnā" },
  { country: "Lithuania", artist: "Lion Ceccah", song: "Sólo Quiero Más" },
  { country: "Luxembourg", artist: "Eva Marija", song: "Mother Nature" },
  { country: "Malta", artist: "AIDAN", song: "Bella" },
  { country: "Moldova", artist: "Satoshi", song: "Viva, Moldova!" },
  { country: "Montenegro", artist: "Tamara Živković", song: "Nova Zora" },
  { country: "Norway", artist: "JONAS LOVV", song: "YA YA YA" },
  { country: "Poland", artist: "ALICJA", song: "Pray" },
  { country: "Portugal", artist: "Bandidos do Cante", song: "Rosa" },
  { country: "Romania", artist: "Alexandra Căpitănescu", song: "Choke Me" },
  { country: "San Marino", artist: "SENHIT", song: "Superstar" },
  { country: "Serbia", artist: "LAVINA", song: "Kraj Mene" },
  { country: "Sweden", artist: "FELICIA", song: "My System" },
  { country: "Switzerland", artist: "Veronica Fusaro", song: "Alice" },
  { country: "Ukraine", artist: "LELÉKA", song: "Ridnym" },
  { country: "United Kingdom", artist: "LOOK MUM NO COMPUTER", song: "Eins, Zwei, Drei" },
];

const emptyPrediction = { top1: "", top2: "", top3: "", top4: "", top5: "", winner: "", last: "" };

const DOGS = [
  { id: "bulldog", breed: "Englische Bulldogge", body: "from-amber-100 via-orange-300 to-amber-600", ear: "bg-amber-700", spot: "bg-white/85", scale: "scale-x-110", head: "from-white via-amber-100 to-orange-400" },
  { id: "whippet", breed: "Whippet", body: "from-stone-100 via-amber-200 to-yellow-600", ear: "bg-amber-700", spot: "bg-white/70", scale: "scale-x-125", head: "from-white via-stone-100 to-amber-300" },
  { id: "dackel", breed: "Schwarzer Kurzhaardackel", body: "from-zinc-950 via-zinc-800 to-black", ear: "bg-black", spot: "bg-orange-500", scale: "scale-x-125", head: "from-zinc-900 via-zinc-800 to-black" },
];

const DOG_ACTIONS = ["run", "flip", "sit", "jump", "roll", "bounce"];

function entryLabel(country) {
  const e = ENTRIES.find((x) => x.country === country);
  return e ? `${e.country} — ${e.artist} · “${e.song}”` : "";
}

function playJingle(type = "save") {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = type === "winner" ? [523, 659, 784, 1047] : [392, 494, 587, 784];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.075, ctx.currentTime + i * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.09 + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.09);
      osc.stop(ctx.currentTime + i * 0.09 + 0.18);
    });
  } catch {}
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-white/20 bg-white/15 text-white shadow-2xl backdrop-blur ${className}`}>{children}</div>;
}

function Button({ children, className = "", ...props }) {
  return <button {...props} className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>{children}</button>;
}

function SelectEntry({ value, onChange, label, used = [] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-white/95">{label}</span>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-white/30 bg-white/95 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-4 focus:ring-fuchsia-300">
        <option value="">Bitte auswählen</option>
        {ENTRIES.map((entry) => (
          <option key={entry.country} value={entry.country} disabled={used.includes(entry.country) && value !== entry.country}>
            {entry.country} — {entry.artist} · {entry.song}
          </option>
        ))}
      </select>
    </label>
  );
}

function CartoonDog({ dog, size = "normal", action = "idle" }) {
  const big = size === "hero";
  const w = big ? "w-52 h-32 md:w-64 md:h-40" : "w-40 h-28 md:w-48 md:h-32";
  const isDark = dog.id === "dackel";
  const bodyMotion =
    action === "flip" ? { rotate: [0, 360], y: [0, -56, 0], scale: [1, 1.12, 1] } :
    action === "run" ? { x: [-34, 28, -8, 0], y: [0, -10, 0, -6, 0], rotate: [-4, 3, -2, 0] } :
    action === "sit" ? { y: [0, 12, 0], scaleY: [1, 0.88, 1], rotate: [0, -3, 0] } :
    action === "jump" ? { y: [0, -70, 0], rotate: [0, -10, 8, 0], scale: [1, 1.08, 1] } :
    action === "roll" ? { rotate: [0, -180, -360], x: [0, 26, 0], y: [0, 18, 0] } :
    action === "bounce" ? { y: [0, -28, 0, -12, 0], scale: [1, 1.05, 1, 1.03, 1] } :
    { y: [0, -8, 0] };

  return (
    <motion.div animate={bodyMotion} transition={{ duration: action === "idle" ? 2.4 : 1.25, repeat: action === "idle" ? Infinity : 0, ease: "easeInOut" }} className={`relative ${w} ${dog.scale} drop-shadow-2xl`}>
      <div className="absolute -bottom-1 left-8 h-6 w-32 rounded-full bg-black/25 blur-md md:w-40" />
      <div className={`absolute left-9 top-11 h-16 w-32 rounded-[48%] bg-gradient-to-br ${dog.body} shadow-[inset_-18px_-20px_22px_rgba(0,0,0,.22),inset_12px_12px_20px_rgba(255,255,255,.35)] md:h-20 md:w-40`} />
      <motion.div animate={{ rotate: [0, 22, -12, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className={`absolute right-1 top-10 h-4 w-18 origin-left rounded-full bg-gradient-to-r ${isDark ? "from-black via-zinc-800 to-orange-500" : "from-amber-500 via-amber-300 to-yellow-100"} shadow-lg`} />
      <motion.div animate={{ rotate: [20, -22, 18] }} transition={{ repeat: Infinity, duration: 0.48 }} className={`absolute left-20 bottom-3 h-14 w-5 rounded-full bg-gradient-to-b ${dog.body} shadow-lg`} />
      <motion.div animate={{ rotate: [-18, 24, -18] }} transition={{ repeat: Infinity, duration: 0.45 }} className={`absolute left-34 bottom-3 h-14 w-5 rounded-full bg-gradient-to-b ${dog.body} shadow-lg`} />
      <motion.div animate={{ rotate: [-12, 18, -12] }} transition={{ repeat: Infinity, duration: 0.5 }} className={`absolute left-28 bottom-2 h-12 w-4 rounded-full bg-gradient-to-b ${dog.body} shadow-lg`} />
      <div className={`absolute left-3 top-7 h-20 w-20 rounded-full bg-gradient-to-br ${dog.head} shadow-[inset_-12px_-15px_20px_rgba(0,0,0,.18),inset_10px_8px_18px_rgba(255,255,255,.52)] md:h-24 md:w-24`} />
      <div className={`absolute left-2 top-4 h-10 w-8 -rotate-12 rounded-full ${dog.ear} shadow-lg`} />
      <div className={`absolute left-16 top-4 h-10 w-8 rotate-12 rounded-full ${dog.ear} shadow-lg`} />
      <div className="absolute left-9 top-12 h-3.5 w-3.5 rounded-full bg-black ring-2 ring-white/50" />
      <div className="absolute left-16 top-12 h-3.5 w-3.5 rounded-full bg-black ring-2 ring-white/50" />
      <div className="absolute left-10 top-16 h-5 w-8 rounded-full bg-black/90" />
      <div className="absolute left-11 top-[4.6rem] h-3 w-9 rounded-b-full bg-pink-400" />
      <div className={`absolute left-17 top-9 h-9 w-11 rounded-full ${dog.spot} blur-[.5px]`} />
      {dog.id === "bulldog" && <><div className="absolute left-6 top-[4.6rem] h-2 w-9 rounded-full bg-black/20" /><div className="absolute left-10 top-[5.2rem] h-2 w-10 rounded-full bg-black/20" /></>}
    </motion.div>
  );
}

function DogCelebration({ dog }) {
  if (!dog) return null;
  const action = dog.action || "run";
  const path =
    action === "flip" ? { x: ["-70vw", "-10vw", "0vw", "12vw"], y: [0, -20, -95, 0], rotate: [0, 0, 360, 720], scale: [0.9, 1.15, 1.22, 1.05] } :
    action === "roll" ? { x: ["-70vw", "-20vw", "8vw", "25vw"], y: [0, 20, 20, 0], rotate: [0, -180, -360, -540], scale: [0.9, 1.08, 1.08, 1] } :
    action === "jump" ? { x: ["-65vw", "-15vw", "8vw", "22vw"], y: [0, -80, -30, 0], rotate: [0, -10, 12, 0], scale: [0.9, 1.22, 1.1, 1] } :
    action === "sit" ? { x: ["-55vw", "-8vw", "0vw"], y: [0, 0, 18], rotate: [0, 0, -4], scale: [0.9, 1.15, 1.05] } :
    { x: ["-70vw", "-20vw", "10vw", "30vw"], y: [0, -10, 0, -8], rotate: [-6, 4, -2, 0], scale: [0.9, 1.15, 1.05, 1] };

  return (
    <AnimatePresence>
      <motion.div className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-black/20 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {Array.from({ length: 18 }).map((_, i) => <motion.span key={i} initial={{ y: -30, x: `${Math.random() * 100}vw`, opacity: 0 }} animate={{ y: "95vh", opacity: [0, 1, 0], rotate: 360 }} transition={{ duration: 1.6 + Math.random(), delay: Math.random() * 0.25 }} className="absolute text-xl">{i % 2 === 0 ? "🐾" : "✨"}</motion.span>)}
        <motion.div initial={{ x: "-70vw", y: 0, scale: 0.9 }} animate={path} exit={{ x: "75vw", opacity: 0 }} transition={{ duration: 1.9, ease: "easeInOut" }} className="absolute bottom-20 left-1/2">
          <CartoonDog dog={dog} size="hero" action={action} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function scorePrediction(prediction, results) {
  const top5 = [results.top1, results.top2, results.top3, results.top4, results.top5].filter(Boolean);
  const rows = [];
  let total = 0;

  ["top1", "top2", "top3", "top4", "top5"].forEach((key, idx) => {
    const pick = prediction[key];
    let points = 0;
    let reason = "–";
    if (pick) {
      if (results[key] === pick) { points = 3; reason = "korrekte Top-5-Position"; }
      else if (top5.includes(pick)) { points = 2; reason = "Land in Top 5"; }
      else reason = "nicht in Top 5";
    }
    total += points;
    rows.push({ label: `Platz ${idx + 1}`, pick, points, reason });
  });

  if (prediction.winner) {
    const points = prediction.winner === results.top1 ? 10 : 0;
    total += points;
    rows.push({ label: "Siegertipp", pick: prediction.winner, points, reason: points ? "richtiger Siegertipp" : "nicht Sieger" });
  }

  if (prediction.last) {
    const points = prediction.last === results.last ? 5 : 0;
    total += points;
    rows.push({ label: "Letzter Platz", pick: prediction.last, points, reason: points ? "richtiger letzter Platz" : "nicht letzter Platz" });
  }

  return { total, rows };
}

export default function ESC2026Tippspiel() {
  const [players, setPlayers] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [results, setResults] = useState({ ...emptyPrediction });
  const [currentName, setCurrentName] = useState(() => localStorage.getItem("esc2026_currentName") || "");
  const [nameInput, setNameInput] = useState("");
  const [view, setView] = useState("vote");
  const [status, setStatus] = useState("Live-Verbindung wird aufgebaut …");
  const [draftPrediction, setDraftPrediction] = useState({ ...emptyPrediction });
  const [activeDog, setActiveDog] = useState(null);
  const [toast, setToast] = useState("");

  function showDog() {
    const dog = DOGS[Math.floor(Math.random() * DOGS.length)];
    setActiveDog({ ...dog, action: DOG_ACTIONS[Math.floor(Math.random() * DOG_ACTIONS.length)] });
    setTimeout(() => setActiveDog(null), 2100);
  }

  async function refreshAll() {
    const [p, t, r] = await Promise.all([
      supabase.from("esc2026_players").select("name, created_at").order("created_at", { ascending: true }),
      supabase.from("esc2026_predictions").select("*"),
      supabase.from("esc2026_results").select("*").eq("id", 1).single(),
    ]);
    if (p.error || t.error || r.error) {
      setStatus("Nicht verbunden: Supabase-Daten prüfen");
      return;
    }
    setPlayers((p.data || []).map((x) => x.name));
    setPredictions(Object.fromEntries((t.data || []).map((x) => [x.player_name, { top1: x.top1 || "", top2: x.top2 || "", top3: x.top3 || "", top4: x.top4 || "", top5: x.top5 || "", winner: x.winner || "", last: x.last || "" }])));
    setResults({ ...emptyPrediction, ...(r.data || {}) });
    setStatus("Verbunden mit Supabase ✓");
  }

  useEffect(() => {
    refreshAll();
    const channel = supabase.channel("esc2026-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_players" }, refreshAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_predictions" }, refreshAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_results" }, refreshAll)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    setDraftPrediction(predictions[currentName] || { ...emptyPrediction });
  }, [currentName, predictions]);

  async function selectPlayer(name) {
    localStorage.setItem("esc2026_currentName", name);
    setCurrentName(name);
    setView("vote");
    setDraftPrediction(predictions[name] || { ...emptyPrediction });
  }

  async function login() {
    const clean = nameInput.trim();
    if (!clean) return;
    if (!players.includes(clean)) setPlayers((prev) => [...prev, clean]);
    await supabase.from("esc2026_players").upsert({ name: clean }, { onConflict: "name" });
    await supabase.from("esc2026_predictions").upsert({ player_name: clean, ...emptyPrediction, ...(predictions[clean] || {}) }, { onConflict: "player_name" });
    localStorage.setItem("esc2026_currentName", clean);
    setCurrentName(clean);
    setNameInput("");
    playJingle("save");
    showDog();
    refreshAll();
  }

  async function updatePrediction(next) {
    if (!currentName) return;
    setPredictions({ ...predictions, [currentName]: next });
    await supabase.from("esc2026_predictions").upsert({ player_name: currentName, ...next, updated_at: new Date().toISOString() }, { onConflict: "player_name" });
    playJingle("save");
    showDog();
    refreshAll();
  }

  async function updateResults(next) {
    setResults(next);
    await supabase.from("esc2026_results").update({ ...next, updated_at: new Date().toISOString() }).eq("id", 1);
    playJingle("save");
    refreshAll();
  }

  async function resetAll() {
    if (!confirm("Wirklich alles löschen?")) return;
    await supabase.from("esc2026_predictions").delete().neq("player_name", "");
    await supabase.from("esc2026_players").delete().neq("name", "");
    await supabase.from("esc2026_results").update({ ...emptyPrediction }).eq("id", 1);
    localStorage.removeItem("esc2026_currentName");
    setCurrentName("");
    setPlayers([]);
    setPredictions({});
    refreshAll();
  }

  const leaderboard = useMemo(() => players.map((name) => ({ name, ...scorePrediction(predictions[name] || emptyPrediction, results) })).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name)), [players, predictions, results]);
  const usedTop = [draftPrediction.top1, draftPrediction.top2, draftPrediction.top3, draftPrediction.top4, draftPrediction.top5].filter(Boolean);
  const resultTop = [results.top1, results.top2, results.top3, results.top4, results.top5].filter(Boolean);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#ff2fb3,_transparent_30%),radial-gradient(circle_at_top_right,_#00d4ff,_transparent_26%),linear-gradient(135deg,_#1c0d5a,_#6616b8_45%,_#f0673b)] p-4 text-white md:p-8">
      <DogCelebration dog={activeDog} />
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
          <div>
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-5 min-h-[300px] overflow-hidden rounded-[2rem] border border-white/20 bg-white/15 p-7 shadow-2xl backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,255,255,.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(0,212,255,.16),transparent_24%)]" />
              <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 2.8 }} className="relative mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold"><Sparkles className="h-4 w-4" /> ESC 2026 · Live Tipp-Wette</motion.div>
              <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Hundefreunde Wettstudio ESC 2026</h1>
                  <p className="mt-4 max-w-2xl text-lg text-white/90">Mehrere Geräte, mehrere Orte, ein gemeinsamer Tippstand. Alle Tipps werden live gespeichert und synchronisiert.</p>
                </div>
                <div className="grid min-w-[250px] gap-3 text-sm md:text-right">
                  <div className={`rounded-2xl p-4 font-bold ${status.startsWith("Verbunden") ? "bg-lime-400/25" : "bg-white/20"}`}><Wifi className="mr-2 inline h-4 w-4" />{status}</div>
                  <div className="rounded-2xl bg-white/20 p-4 font-bold"><Users className="mr-2 inline h-4 w-4" />{players.length} Mitspieler:innen</div>
                </div>
              </div>
            </motion.header>

            <div className="mb-5 flex flex-wrap gap-2">
              {[{ id: "vote", label: "Tipps", icon: PawPrint }, { id: "results", label: "Ergebnis", icon: Trophy }, { id: "score", label: "Auswertung", icon: BarChart3 }].map(({ id, label, icon: Icon }) => (
                <Button key={id} onClick={() => { setView(id); playJingle("save"); }} className={view === id ? "bg-white text-fuchsia-700 hover:bg-white" : "bg-white/20 text-white hover:bg-white/30"}><Icon className="mr-2 h-4 w-4" />{label}</Button>
              ))}
              <Button onClick={resetAll} className="bg-black/25 text-white hover:bg-black/40"><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
            </div>

            {!currentName && view === "vote" && (
              <Card className="mb-5 p-6">
                <h2 className="mb-2 text-3xl font-black">Einloggen zum Tippen</h2>
                <p className="mb-4 text-white/80">Name eingeben oder rechts einen vorhandenen Namen anklicken. Es gibt kein Teilnehmerlimit.</p>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Dein Name" className="rounded-2xl border border-white/30 bg-white/95 px-4 py-4 text-slate-900 outline-none focus:ring-4 focus:ring-fuchsia-300" />
                  <Button onClick={login} className="rounded-2xl bg-fuchsia-500 px-8 py-6 text-white hover:bg-fuchsia-600"><Music2 className="mr-2 h-4 w-4" />Los geht’s</Button>
                </div>
              </Card>
            )}

            {currentName && view === "vote" && (
              <Card className="p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-3xl font-black">Tipps von {currentName} <span className="text-yellow-300">♛</span></h2>
                    <p className="text-white/90">Wähle deine Top 5, separaten Siegertipp und letzten Platz. Änderungen sind jederzeit möglich — zum Abschluss einfach speichern.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => { localStorage.removeItem("esc2026_currentName"); setCurrentName(""); }} className="bg-white/20 text-white hover:bg-white/30"><Users className="mr-2 h-4 w-4" />Als anderen wählen</Button>
                    <Button onClick={() => updatePrediction(draftPrediction)} className="bg-lime-300 px-6 text-slate-950 hover:bg-lime-200"><Save className="mr-2 h-4 w-4" />Eingabe speichern</Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const key = `top${n}`;
                    return <motion.div whileHover={{ y: -4 }} key={key} className="rounded-3xl bg-white/10 p-4"><SelectEntry label={`${n}. Platz`} value={draftPrediction[key]} used={usedTop} onChange={(value) => setDraftPrediction({ ...draftPrediction, [key]: value })} /></motion.div>;
                  })}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-yellow-300/20 p-4"><SelectEntry label="Wer gewinnt? · 10 Punkte" value={draftPrediction.winner} onChange={(value) => setDraftPrediction({ ...draftPrediction, winner: value })} /></div>
                  <div className="rounded-3xl bg-cyan-300/20 p-4"><SelectEntry label="Wer wird letzter? · 5 Punkte" value={draftPrediction.last} onChange={(value) => setDraftPrediction({ ...draftPrediction, last: value })} /></div>
                </div>
              </Card>
            )}

            {view === "results" && (
              <Card className="p-6">
                <h2 className="text-3xl font-black">Offizielles Ergebnis eintragen</h2>
                <p className="mb-5 text-white/80">Nach der Show die echten Top 5 und den letzten Platz auswählen.</p>
                <div className="grid gap-4 md:grid-cols-5">{[1,2,3,4,5].map((n) => { const key = `top${n}`; return <div key={key} className="rounded-3xl bg-white/10 p-4"><SelectEntry label={`Echter Platz ${n}`} value={results[key]} used={resultTop} onChange={(value) => updateResults({ ...results, [key]: value })} /></div>; })}</div>
                <div className="mt-4 rounded-3xl bg-cyan-300/20 p-4 md:w-1/2"><SelectEntry label="Echter letzter Platz" value={results.last} onChange={(value) => updateResults({ ...results, last: value })} /></div>
              </Card>
            )}

            {view === "score" && (
              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <Card className="p-6">
                  <div className="mb-4 flex items-center gap-3"><Trophy className="h-8 w-8 text-yellow-200" /><h2 className="text-3xl font-black">Gewinner</h2></div>
                  {leaderboard[0] ? <motion.div onClick={() => { playJingle("winner"); showDog(); }} whileTap={{ scale: .98 }} className="cursor-pointer rounded-3xl bg-yellow-300/25 p-5"><Crown className="mb-2 h-8 w-8" /><div className="text-4xl font-black">{leaderboard[0].name}</div><div className="mt-1 text-2xl">{leaderboard[0].total} Punkte</div></motion.div> : <p>Noch keine Tipps vorhanden.</p>}
                  <div className="mt-4 space-y-2">{leaderboard.map((p, idx) => <div key={p.name} className="flex items-center justify-between rounded-2xl bg-white/10 p-3"><span>{idx + 1}. {p.name}</span><b>{p.total}</b></div>)}</div>
                </Card>
                <Card className="p-6">
                  <h2 className="mb-4 text-3xl font-black">Wer lag wo richtig?</h2>
                  <div className="overflow-x-auto rounded-3xl bg-white/95 text-slate-900"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-fuchsia-100 text-fuchsia-900"><tr><th className="p-3">Person</th><th className="p-3">Tipp</th><th className="p-3">Auswahl</th><th className="p-3">Treffer</th><th className="p-3 text-right">Punkte</th></tr></thead><tbody>{leaderboard.flatMap((player) => player.rows.map((row, i) => <tr key={`${player.name}-${row.label}`} className="border-t border-slate-200"><td className="p-3 font-bold">{i === 0 ? player.name : ""}</td><td className="p-3">{row.label}</td><td className="p-3">{entryLabel(row.pick) || "–"}</td><td className="p-3">{row.reason}</td><td className="p-3 text-right font-black">{row.points}</td></tr>))}</tbody></table></div>
                </Card>
              </div>
            )}

            <div className="mt-5 rounded-full bg-white/15 px-5 py-3 text-sm font-bold"><span><PawPrint className="mr-2 inline h-4 w-4" />Unbegrenzte Teilnahme · Alle sind willkommen!</span></div>
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <Card className="min-h-[680px] p-5">
              <div className="mb-4 flex items-center gap-2"><Users className="h-6 w-6" /><h2 className="text-2xl font-black">Mitspieler:innen ({players.length})</h2></div>
              <p className="mb-4 text-sm text-white/80">Alle Namen erscheinen sofort nach der Anmeldung. Zum Bearbeiten einfach Namen anklicken.</p>
              <div className="max-h-[720px] space-y-2 overflow-auto pr-1">
                {players.length === 0 ? <div className="rounded-2xl bg-white/10 p-4 text-sm">Noch niemand angemeldet.</div> : players.map((name, idx) => (
                  <button key={name} onClick={() => selectPlayer(name)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${name === currentName ? "bg-lime-300 text-slate-950" : "bg-white/10 text-white hover:bg-white/20"}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-xl">{idx % 3 === 0 ? "🐶" : idx % 3 === 1 ? "🐕" : "🌭"}</div>
                    <div className="min-w-0 flex-1"><div className="truncate text-lg font-black">{name} {idx === 0 ? "👑" : ""}</div><div className="text-xs opacity-80">{predictions[name] ? "Tippzettel vorhanden" : "Neu angemeldet"}</div></div>
                    <ChevronsRight className="h-5 w-5 opacity-70" />
                  </button>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
