vimport React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Users, RotateCcw, Save, BarChart3, Music2, Wifi, Crown, PawPrint, ChevronsRight } from "lucide-react";

const RAW_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "DEINE_SUPABASE_URL";
const SUPABASE_URL = RAW_SUPABASE_URL.replace(/\/rest\/v1\/?$/, "");
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "DEIN_SUPABASE_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ENTRIES = [
  { country: "Denmark", artist: "Søren Torpegaard Lund", song: "Før Vi Går Hjem" },
  { country: "Germany", artist: "Sarah Engels", song: "Fire" },
  { country: "Israel", artist: "Noam Bettan", song: "Michelle" },
  { country: "Belgium", artist: "ESSYLA", song: "Dancing on the Ice" },
  { country: "Albania", artist: "Alis", song: "Nân" },
  { country: "Greece", artist: "Akylas", song: "Ferto" },
  { country: "Ukraine", artist: "LELÉKA", song: "Ridnym" },
  { country: "Australia", artist: "Delta Goodrem", song: "Eclipse" },
  { country: "Serbia", artist: "LAVINA", song: "Kraj Mene" },
  { country: "Malta", artist: "AIDAN", song: "Bella" },
  { country: "Czechia", artist: "Daniel Zizka", song: "CROSSROADS" },
  { country: "Bulgaria", artist: "DARA", song: "Bangaranga" },
  { country: "Croatia", artist: "LELEK", song: "Andromeda" },
  { country: "United Kingdom", artist: "LOOK MUM NO COMPUTER", song: "Eins, Zwei, Drei" },
  { country: "France", artist: "Monroe", song: "Regarde!" },
  { country: "Moldova", artist: "Satoshi", song: "Viva, Moldova!" },
  { country: "Finland", artist: "Linda Lampenius x Pete Parkkonen", song: "Liekinheitin" },
  { country: "Poland", artist: "ALICJA", song: "Pray" },
  { country: "Lithuania", artist: "Lion Ceccah", song: "Sólo Quiero Más" },
  { country: "Sweden", artist: "FELICIA", song: "My System" },
  { country: "Cyprus", artist: "Antigoni", song: "JALLA" },
  { country: "Italy", artist: "Sal Da Vinci", song: "Per Sempre Sì" },
  { country: "Norway", artist: "JONAS LOVV", song: "YA YA YA" },
  { country: "Romania", artist: "Alexandra Căpitănescu", song: "Choke Me" },
  { country: "Austria", artist: "COSMÓ", song: "Tanzschein" },
];

const emptyPrediction = { top1: "", top2: "", top3: "", top4: "", top5: "", winner: "", last: "" };

const OFFICIAL_RESULTS = {
  top1: "Bulgaria",
  top2: "Israel",
  top3: "Romania",
  top4: "Australia",
  top5: "Italy",
  winner: "Bulgaria",
  last: "United Kingdom",
};

const DOG_VARIANTS = [
  { id: "dackel-1", image: "/dogs/Dackel-1.png" },
  { id: "dackel-2", image: "/dogs/Dackel-2.png" },
  { id: "dackel-3", image: "/dogs/Dackel-3.png" },
  { id: "whippet-1", image: "/dogs/Whippet-1.png" },
  { id: "whippet-2", image: "/dogs/Whippet-2.png" },
  { id: "whippet-3", image: "/dogs/Whippet-3.png" },
  { id: "bulldogge-1", image: "/dogs/Bulldogge-1.png" },
  { id: "bulldogge-2", image: "/dogs/Bulldogge-2.png" },
  { id: "bulldogge-3", image: "/dogs/Bulldogge-3.png" },
];

const CELEBRATION_EFFECTS = ["confetti", "fireworks", "sparkles", "lightbeams"];

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

function CartoonDog({ dog }) {
  return (
    <img
      src={dog.image}
      alt=""
      className="h-auto max-h-[58vh] w-auto max-w-[72vw] select-none object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,.55)]"
      draggable="false"
    />
  );
}

function CelebrationEffect({ type }) {
  if (type === "fireworks") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,.95)]"
            style={{ left: `${12 + (i * 10) % 82}%`, top: `${12 + (i * 17) % 62}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.25, delay: i * 0.08 }}
          >
            {Array.from({ length: 10 }).map((_, j) => (
              <motion.span
                key={j}
                className="absolute left-1/2 top-1/2 h-1 w-12 origin-left rounded-full bg-gradient-to-r from-yellow-200 via-fuchsia-300 to-transparent"
                style={{ rotate: `${j * 36}deg` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 1.2, delay: i * 0.08 }}
              />
            ))}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "lightbeams") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-[150vh] w-16 origin-bottom rounded-full bg-gradient-to-t from-white/30 via-fuchsia-300/20 to-transparent blur-xl"
            style={{ rotate: `${i * 45}deg` }}
            initial={{ opacity: 0, scaleY: 0.25 }}
            animate={{ opacity: [0, 0.8, 0], scaleY: [0.25, 1, 0.4] }}
            transition={{ duration: 1.8, delay: i * 0.04 }}
          />
        ))}
      </div>
    );
  }

  if (type === "sparkles") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 70 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0], rotate: 180 }}
            transition={{ duration: 1.5, delay: Math.random() * 0.7 }}
          >
            ✨
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 95 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ y: -80, x: `${Math.random() * 100}vw`, opacity: 0, rotate: 0, scale: 0.6 }}
          animate={{ y: "105vh", opacity: [0, 1, 1, 0], rotate: 720, scale: [0.6, 1, 0.8] }}
          transition={{ duration: 1.7 + Math.random() * 1, delay: Math.random() * 0.35, ease: "easeOut" }}
          className="absolute h-4 w-4 rounded-sm"
          style={{ background: ["#ff4fd8", "#ffe45e", "#39d7ff", "#a3ff53", "#ff8a3d"][i % 5] }}
        />
      ))}
    </div>
  );
}

function DogCelebration({ dog, message }) {
  if (!dog) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-black/45 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <CelebrationEffect type={dog.effect || "confetti"} />
        <motion.div
          initial={{ scale: 0.72, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.84, opacity: 0, y: -35 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative flex flex-col items-center"
        >
          <motion.img
            src={dog.image}
            alt=""
            draggable="false"
            initial={{ rotate: -4, scale: 0.96 }}
            animate={{ rotate: [0, -2, 2, 0], scale: [0.96, 1.02, 1] }}
            transition={{ duration: 1.15 }}
            className="max-h-[72vh] max-w-[78vw] select-none object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.08 }}
            className="mt-5 rounded-full border border-white/20 bg-white/15 px-7 py-3 text-center text-2xl font-black tracking-tight text-white shadow-2xl backdrop-blur-xl"
          >
            {message}
          </motion.div>
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
  const [results, setResults] = useState({ ...OFFICIAL_RESULTS });
  const [currentName, setCurrentName] = useState(() => localStorage.getItem("esc2026_currentName") || "");
  const [selectedPlayerView, setSelectedPlayerView] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [view, setView] = useState("vote");
  const [status, setStatus] = useState("Live-Verbindung wird aufgebaut …");
  const [draftPrediction, setDraftPrediction] = useState({ ...emptyPrediction });
  const [draftDirty, setDraftDirty] = useState(false);
  const [activeDog, setActiveDog] = useState(null);
  const [dogMessage, setDogMessage] = useState("");

  function showDog(message = "Gespeichert!") {
    const dog = DOG_VARIANTS[Math.floor(Math.random() * DOG_VARIANTS.length)];
    const effect = CELEBRATION_EFFECTS[Math.floor(Math.random() * CELEBRATION_EFFECTS.length)];
    setDogMessage(message);
    setActiveDog({ ...dog, effect });
    setTimeout(() => {
      setActiveDog(null);
      setDogMessage("");
    }, 2300);
  }

  function setDraftField(key, value) {
    setDraftDirty(true);
    setDraftPrediction((prev) => ({ ...prev, [key]: value }));
  }

  async function refreshAll() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL === "DEINE_SUPABASE_URL" || SUPABASE_ANON_KEY === "DEIN_SUPABASE_ANON_KEY") {
      setStatus("Nicht verbunden: Vercel Supabase Variablen fehlen");
      return;
    }

    const [p, t, r] = await Promise.all([
      supabase.from("esc2026_players").select("name, created_at").order("created_at", { ascending: true }),
      supabase.from("esc2026_predictions").select("*"),
      supabase.from("esc2026_results").select("*").eq("id", 1).maybeSingle(),
    ]);

    if (p.error || t.error) {
      setStatus(`Nicht verbunden: ${p.error?.message || t.error?.message || "Supabase prüfen"}`);
      return;
    }

    // Spieler und Tipps werden auch dann synchron angezeigt, wenn die Ergebnis-Tabelle noch keinen Datensatz hat.
    const remotePlayers = (p.data || []).map((x) => x.name);
    const remotePredictions = Object.fromEntries((t.data || []).map((x) => [x.player_name, {
      top1: x.top1 || "",
      top2: x.top2 || "",
      top3: x.top3 || "",
      top4: x.top4 || "",
      top5: x.top5 || "",
      winner: x.winner || "",
      last: x.last || "",
    }]));

    setPlayers(remotePlayers);
    setPredictions(remotePredictions);

    if (r.error) {
      setResults({ ...emptyPrediction });
      setStatus(`Teilweise verbunden: Ergebnisdaten prüfen (${r.error.message})`);
      return;
    }

    if (!r.data) {
      await supabase.from("esc2026_results").upsert({ id: 1, ...OFFICIAL_RESULTS }, { onConflict: "id" });
      setResults({ ...OFFICIAL_RESULTS });
    } else {
      const savedResults = { ...OFFICIAL_RESULTS, ...r.data };
      const isStillEmpty = !savedResults.top1 && !savedResults.top2 && !savedResults.top3 && !savedResults.top4 && !savedResults.top5 && !savedResults.last;
      if (isStillEmpty) {
        await supabase.from("esc2026_results").update({ ...OFFICIAL_RESULTS, updated_at: new Date().toISOString() }).eq("id", 1);
        setResults({ ...OFFICIAL_RESULTS });
      } else {
        setResults(savedResults);
      }
    }

    setStatus("Verbunden mit Supabase ✓");
  }

  useEffect(() => {
    refreshAll();

    // Realtime ist praktisch, aber je nach Supabase-Konfiguration nicht immer sofort aktiv.
    // Deshalb aktualisiert die App zusätzlich automatisch alle 3 Sekunden.
    const interval = setInterval(refreshAll, 3000);

    const channel = supabase.channel("esc2026-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_players" }, refreshAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_predictions" }, refreshAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_results" }, refreshAll)
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!draftDirty) {
      setDraftPrediction(predictions[currentName] || { ...emptyPrediction });
    }
  }, [currentName, predictions, draftDirty]);

  async function selectPlayer(name) {
    // Nur ansehen, nicht automatisch als diese Person bearbeiten.
    setSelectedPlayerView(name);
    setView("vote");
  }

  function editAsPlayer(name) {
    // Bewusst als Person übernehmen/bearbeiten.
    localStorage.setItem("esc2026_currentName", name);
    setCurrentName(name);
    setSelectedPlayerView(name);
    setView("vote");
    setDraftDirty(false);
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
    showDog("Herzlich willkommen!");
    refreshAll();
  }

  async function updatePrediction(next) {
    if (!currentName) return;

    const cleaned = {
      top1: next.top1 || "",
      top2: next.top2 || "",
      top3: next.top3 || "",
      top4: next.top4 || "",
      top5: next.top5 || "",
      winner: next.winner || "",
      last: next.last || "",
    };

    setPredictions((prev) => ({ ...prev, [currentName]: cleaned }));
    setDraftPrediction(cleaned);
    setDraftDirty(false);

    const { error } = await supabase
      .from("esc2026_predictions")
      .upsert({ player_name: currentName, ...cleaned, updated_at: new Date().toISOString() }, { onConflict: "player_name" });

    if (error) {
      setStatus(`Speichern fehlgeschlagen: ${error.message}`);
      setDraftDirty(true);
      return;
    }

    playJingle("save");
    showDog("Tipp gespeichert!");
    await refreshAll();
  }

  async function updateResults(next) {
    const cleaned = { ...OFFICIAL_RESULTS, ...next };
    setResults(cleaned);
    const { error } = await supabase.from("esc2026_results").upsert({ id: 1, ...cleaned, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) {
      setStatus(`Ergebnis konnte nicht gespeichert werden: ${error.message}`);
      return;
    }
    playJingle("save");
    showDog("Ergebnis aktualisiert!");
    refreshAll();
  }

  async function applyOfficialResults() {
    await updateResults(OFFICIAL_RESULTS);
    setView("score");
  }

  async function resetAll() {
    if (!confirm("Wirklich alles löschen?")) return;
    await supabase.from("esc2026_predictions").delete().neq("player_name", "");
    await supabase.from("esc2026_players").delete().neq("name", "");
    await supabase.from("esc2026_results").update({ ...OFFICIAL_RESULTS }).eq("id", 1);
    localStorage.removeItem("esc2026_currentName");
    setCurrentName("");
    setPlayers([]);
    setPredictions({});
    refreshAll();
  }

  const leaderboard = useMemo(() => players.map((name) => ({ name, ...scorePrediction(predictions[name] || emptyPrediction, results) })).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name)), [players, predictions, results]);
  const usedTop = [draftPrediction.top1, draftPrediction.top2, draftPrediction.top3, draftPrediction.top4, draftPrediction.top5].filter(Boolean);
  const viewedPrediction = predictions[selectedPlayerView] || emptyPrediction;
  const resultTop = [results.top1, results.top2, results.top3, results.top4, results.top5].filter(Boolean);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#ff2fb3,_transparent_30%),radial-gradient(circle_at_top_right,_#00d4ff,_transparent_26%),linear-gradient(135deg,_#1c0d5a,_#6616b8_45%,_#f0673b)] p-4 text-white md:p-8">
      <DogCelebration dog={activeDog} message={dogMessage} />
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
                  <Button onClick={() => editAsPlayer(selectedPlayerView)} className="ml-auto bg-white/20 text-white hover:bg-white/30">
                    Diese Tipps bearbeiten
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const key = `top${n}`;
                    return <motion.div whileHover={{ y: -4 }} key={key} className="rounded-3xl bg-white/10 p-4"><SelectEntry label={`${n}. Platz`} value={draftPrediction[key]} used={usedTop} onChange={(value) => setDraftField(key, value)} /></motion.div>;
                  })}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-yellow-300/20 p-4"><SelectEntry label="Wer gewinnt? · 10 Punkte" value={draftPrediction.winner} onChange={(value) => setDraftField("winner", value)} /></div>
                  <div className="rounded-3xl bg-cyan-300/20 p-4"><SelectEntry label="Wer wird letzter? · 5 Punkte" value={draftPrediction.last} onChange={(value) => setDraftField("last", value)} /></div>
                </div>
              </Card>
            )}

            {view === "results" && (
              <Card className="p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-3xl font-black">Offizielles Ergebnis</h2>
                    <p className="text-white/80">Das Ergebnis ist fest hinterlegt. Klicke einmal auf „Offizielles Ergebnis speichern“, dann wird die Auswertung für alle Geräte aktualisiert.</p>
                  </div>
                  <Button onClick={applyOfficialResults} className="bg-lime-300 px-6 text-slate-950 hover:bg-lime-200"><Save className="mr-2 h-4 w-4" />Offizielles Ergebnis speichern</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-5">{[1,2,3,4,5].map((n) => { const key = `top${n}`; return <div key={key} className="rounded-3xl bg-white/10 p-4"><div className="mb-2 text-sm font-black text-white/80">Platz {n}</div><div className="min-h-[96px] rounded-2xl bg-white/95 p-4 text-sm font-bold text-slate-900">{entryLabel(results[key])}</div></div>; })}</div>
                <div className="mt-4 rounded-3xl bg-cyan-300/20 p-4 md:w-1/2"><div className="mb-2 text-sm font-black text-white/80">Letzter Platz</div><div className="rounded-2xl bg-white/95 p-4 font-bold text-slate-900">{entryLabel(results.last)}</div></div>
              </Card>
            )}

            {view === "score" && (
              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <Card className="p-6">
                  <div className="mb-4 flex items-center gap-3"><Trophy className="h-8 w-8 text-yellow-200" /><h2 className="text-3xl font-black">Gewinner</h2></div>
                  {leaderboard[0] ? <motion.div onClick={() => { playJingle("winner"); showDog("Neuer Spitzenreiter!"); }} whileTap={{ scale: .98 }} className="cursor-pointer rounded-3xl bg-yellow-300/25 p-5"><Crown className="mb-2 h-8 w-8" /><div className="text-4xl font-black">{leaderboard[0].name}</div><div className="mt-1 text-2xl">{leaderboard[0].total} Punkte</div></motion.div> : <p>Noch keine Tipps vorhanden.</p>}
                  <div className="mt-4 space-y-2">{leaderboard.map((p, idx) => <div key={p.name} className="flex items-center justify-between rounded-2xl bg-white/10 p-3"><span>{idx + 1}. {p.name}</span><b>{p.total}</b></div>)}</div>
                </Card>
                <Card className="p-6">
                  <h2 className="mb-4 text-3xl font-black">Wer lag wo richtig?</h2>
                  <div className="overflow-x-auto rounded-3xl bg-white/95 text-slate-900"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-fuchsia-100 text-fuchsia-900"><tr><th className="p-3">Person</th><th className="p-3">Tipp</th><th className="p-3">Auswahl</th><th className="p-3">Treffer</th><th className="p-3 text-right">Punkte</th></tr></thead><tbody>{leaderboard.flatMap((player) => player.rows.map((row, i) => <tr key={`${player.name}-${row.label}`} className="border-t border-slate-200"><td className="p-3 font-bold">{i === 0 ? player.name : ""}</td><td className="p-3">{row.label}</td><td className="p-3">{entryLabel(row.pick) || "–"}</td><td className="p-3">{row.reason}</td><td className="p-3 text-right font-black">{row.points}</td></tr>))}</tbody></table></div>
                </Card>
              </div>
            )}

            {selectedPlayerView && (
              <Card className="mt-5 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <Users className="h-7 w-7 text-cyan-200" />
                  <div>
                    <h2 className="text-3xl font-black">Tipps von {selectedPlayerView}</h2>
                    <p className="text-white/80">Alle Mitspieler:innen können diese Tipps live ansehen. Bearbeiten geht nur, wenn du den Namen bewusst übernimmst.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                  {[1,2,3,4,5].map((n) => {
                    const key = `top${n}`;
                    return (
                      <div key={key} className="rounded-3xl bg-white/10 p-4">
                        <div className="mb-2 text-sm font-black text-white/80">{n}. Platz</div>
                        <div className="rounded-2xl bg-white/95 p-4 text-sm font-bold text-slate-900 min-h-[90px]">
                          {entryLabel(viewedPrediction[key]) || "Noch kein Tipp"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-yellow-300/20 p-4">
                    <div className="mb-2 text-sm font-black text-white/80">Siegertipp</div>
                    <div className="rounded-2xl bg-white/95 p-4 font-bold text-slate-900">
                      {entryLabel(viewedPrediction.winner) || "Noch kein Tipp"}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-cyan-300/20 p-4">
                    <div className="mb-2 text-sm font-black text-white/80">Letzter Platz</div>
                    <div className="rounded-2xl bg-white/95 p-4 font-bold text-slate-900">
                      {entryLabel(viewedPrediction.last) || "Noch kein Tipp"}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="mt-5 rounded-full bg-white/15 px-5 py-3 text-sm font-bold"><span><PawPrint className="mr-2 inline h-4 w-4" />Unbegrenzte Teilnahme · Alle sind willkommen!</span></div>
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <Card className="min-h-[680px] p-5">
              <div className="mb-4 flex items-center gap-2"><Users className="h-6 w-6" /><h2 className="text-2xl font-black">Mitspieler:innen ({players.length})</h2></div>
              <p className="mb-4 text-sm text-white/80">Alle Namen erscheinen automatisch auf jedem Gerät. Zum Anschauen einfach Namen anklicken.</p>
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
