 import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Users, RotateCcw, Save, BarChart3, Vote, Music2, Wifi, Crown, Dog, Pencil } from "lucide-react";

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
  { breed: "Englische Bulldogge", emoji: "🐶", trick: "macht Sitz" },
  { breed: "Whippet", emoji: "🐕", trick: "rennt eine Ehrenrunde" },
  { breed: "Schwarzer Kurzhaardackel", emoji: "🌭", trick: "macht einen Salto" },
];

function entryLabel(country) {
  const e = ENTRIES.find((x) => x.country === country);
  return e ? `${e.country} — ${e.artist} · “${e.song}”` : "";
}

function playJingle(type = "save") {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = type === "winner" ? [523, 659, 784, 1047] : [392, 494, 587];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + i * 0.11 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.11 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.11);
      osc.stop(ctx.currentTime + i * 0.11 + 0.2);
    });
  } catch {}
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-white/20 bg-white/15 text-white shadow-2xl backdrop-blur ${className}`}>{children}</div>;
}

function Button({ children, className = "", ...props }) {
  return <button {...props} className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>{children}</button>;
}

function SelectEntry({ value, onChange, label, used = [], disabled = false }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-white/90">{label}</span>
      <select
        disabled={disabled}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl border border-white/30 bg-white/95 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-4 focus:ring-fuchsia-300 ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
      >
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

function DogAnimation({ dog }) {
  return (
    <AnimatePresence>
      {dog && (
        <motion.div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ y: 120, scale: 0.4, rotate: -10 }}
            animate={{ y: [120, -20, 0], scale: [0.4, 1.15, 1], rotate: dog.breed.includes("Dackel") ? [0, 360, 720] : dog.breed.includes("Whippet") ? [-12, 12, -8, 0] : [0, -8, 8, 0] }}
            exit={{ y: 120, scale: 0.3, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="rounded-[2rem] border border-white/30 bg-white/90 p-8 text-center text-slate-900 shadow-2xl"
          >
            <motion.div animate={{ y: [0, -18, 0] }} transition={{ repeat: 2, duration: 0.35 }} className="text-8xl drop-shadow-lg">{dog.emoji}</motion.div>
            <div className="mt-3 text-2xl font-black">{dog.breed}</div>
            <div className="mt-1 text-lg font-bold text-fuchsia-700">{dog.trick}! Wuff! 🎶</div>
          </motion.div>
        </motion.div>
      )}
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
  const [isEditing, setIsEditing] = useState(true);
  const [draftPrediction, setDraftPrediction] = useState({ ...emptyPrediction });
  const [activeDog, setActiveDog] = useState(null);

  const currentPrediction = predictions[currentName] || { ...emptyPrediction };

  function showDog() {
    const dog = DOGS[Math.floor(Math.random() * DOGS.length)];
    setActiveDog(dog);
    setTimeout(() => setActiveDog(null), 1800);
  }

  async function refreshAll() {
    const [p, t, r] = await Promise.all([
      supabase.from("esc2026_players").select("name").order("created_at", { ascending: true }),
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
    setStatus("Live verbunden — Tipps werden für alle Geräte synchronisiert");
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
    setIsEditing(!currentName || !predictions[currentName]);
  }, [currentName, predictions]);

  async function login() {
    const clean = nameInput.trim();
    if (!clean) return;
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
    refreshAll();
  }

  const leaderboard = useMemo(() => players.map((name) => ({ name, ...scorePrediction(predictions[name] || emptyPrediction, results) })).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name)), [players, predictions, results]);
  const usedTop = [draftPrediction.top1, draftPrediction.top2, draftPrediction.top3, draftPrediction.top4, draftPrediction.top5].filter(Boolean);
  const resultTop = [results.top1, results.top2, results.top3, results.top4, results.top5].filter(Boolean);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#ff2fb3,_transparent_30%),radial-gradient(circle_at_top_right,_#00d4ff,_transparent_26%),linear-gradient(135deg,_#22115f,_#6616b8_45%,_#ff7a00)] p-4 text-white md:p-8">
      <DogAnimation dog={activeDog} />
      <div className="mx-auto max-w-7xl">
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 overflow-hidden rounded-[2rem] border border-white/20 bg-white/15 p-6 shadow-2xl backdrop-blur">
          <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 2.8 }} className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold"><Sparkles className="h-4 w-4" /> ESC 2026 · Live Tipp-Wette</motion.div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Hundefreunde Wettstudio ESC 2026</h1>
              <p className="mt-2 max-w-2xl text-white/85">Mehrere Geräte, mehrere Orte, ein gemeinsamer Tippstand. Alle Tipps werden live gespeichert und synchronisiert.</p>
            </div>
            <div className="grid gap-2 text-sm md:text-right">
              <div className="rounded-2xl bg-white/20 p-3"><Wifi className="mr-2 inline h-4 w-4" />{status}</div>
              <div className="rounded-2xl bg-white/20 p-3"><Users className="mr-2 inline h-4 w-4" />{players.length} Mitspieler:innen</div>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {[{ id: "vote", label: "Tipps", icon: Vote }, { id: "results", label: "Ergebnis", icon: Save }, { id: "score", label: "Auswertung", icon: BarChart3 }].map(({ id, label, icon: Icon }) => (
                <Button key={id} onClick={() => { setView(id); playJingle("save"); }} className={view === id ? "bg-white text-fuchsia-700 hover:bg-white" : "bg-white/20 text-white hover:bg-white/30"}><Icon className="mr-2 h-4 w-4" />{label}</Button>
              ))}
              <Button onClick={resetAll} className="bg-black/25 text-white hover:bg-black/40"><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
            </div>

            {!currentName && view === "vote" && (
              <Card className="mb-6 p-6">
                <h2 className="mb-2 text-2xl font-black">Einloggen zum Tippen</h2>
                <p className="mb-4 text-white/80">Name eingeben oder vorhandenen Namen wählen. Es gibt kein Teilnehmerlimit.</p>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Dein Name" className="rounded-2xl border border-white/30 bg-white/95 px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-fuchsia-300" />
                  <Button onClick={login} className="rounded-2xl bg-fuchsia-500 px-8 py-6 text-white hover:bg-fuchsia-600"><Music2 className="mr-2 h-4 w-4" />Los geht’s</Button>
                </div>
              </Card>
            )}

            {currentName && view === "vote" && (
              <Card className="p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-3xl font-black">Tipps von {currentName}</h2>
                    <p className="text-white/80">Top 5, separater Siegertipp und letzter Platz. Erst mit „Eingabe speichern“ wird die Auswertung aktualisiert.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => { localStorage.removeItem("esc2026_currentName"); setCurrentName(""); }} className="bg-white/20 text-white hover:bg-white/30">Person wechseln</Button>
                    {isEditing ? (
                      <Button onClick={() => { updatePrediction(draftPrediction); setIsEditing(false); }} className="bg-lime-300 px-6 text-slate-950 hover:bg-lime-200"><Save className="mr-2 h-4 w-4" />Eingabe speichern</Button>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} className="bg-yellow-300 px-6 text-slate-950 hover:bg-yellow-200"><Pencil className="mr-2 h-4 w-4" />Bearbeiten</Button>
                    )}
                  </div>
                </div>

                {!isEditing && <div className="mb-4 rounded-3xl bg-lime-300/20 p-4 text-sm font-semibold">Gespeichert. Die Auswertung wurde aktualisiert. Über „Bearbeiten“ kannst du deine Tipps wieder ändern.</div>}

                <div className="grid gap-4 md:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const key = `top${n}`;
                    return <motion.div whileHover={{ y: isEditing ? -4 : 0 }} key={key} className="rounded-3xl bg-white/10 p-4"><SelectEntry disabled={!isEditing} label={`${n}. Platz`} value={draftPrediction[key]} used={usedTop} onChange={(value) => setDraftPrediction({ ...draftPrediction, [key]: value })} /></motion.div>;
                  })}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-yellow-300/25 p-4"><SelectEntry disabled={!isEditing} label="Wer gewinnt? · 10 Punkte" value={draftPrediction.winner} onChange={(value) => setDraftPrediction({ ...draftPrediction, winner: value })} /></div>
                  <div className="rounded-3xl bg-cyan-300/20 p-4"><SelectEntry disabled={!isEditing} label="Wer wird letzter? · 5 Punkte" value={draftPrediction.last} onChange={(value) => setDraftPrediction({ ...draftPrediction, last: value })} /></div>
                </div>

                <div className="mt-5 rounded-3xl bg-black/20 p-4">
                  <h3 className="mb-2 font-black">Aktueller Tippzettel</h3>
                  <div className="grid gap-2 text-sm md:grid-cols-2">{["top1", "top2", "top3", "top4", "top5", "winner", "last"].map((key) => <div key={key} className="rounded-2xl bg-white/10 p-3"><b>{key === "winner" ? "Siegertipp" : key === "last" ? "Letzter" : key.replace("top", "Platz ")}:</b> {entryLabel(draftPrediction[key]) || "–"}</div>)}</div>
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
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2"><Dog className="h-6 w-6" /><h2 className="text-2xl font-black">Mitspieler:innen</h2></div>
              <p className="mb-4 text-sm text-white/80">Permanente Live-Liste aller angemeldeten Personen. Keine Teilnahmebegrenzung.</p>
              <div className="max-h-[560px] space-y-2 overflow-auto pr-1">
                {players.length === 0 ? <div className="rounded-2xl bg-white/10 p-4 text-sm">Noch niemand angemeldet.</div> : players.map((name, idx) => (
                  <button key={name} onClick={() => { localStorage.setItem("esc2026_currentName", name); setCurrentName(name); setView("vote"); }} className={`flex w-full items-center justify-between rounded-2xl p-3 text-left transition ${name === currentName ? "bg-lime-300 text-slate-950" : "bg-white/10 text-white hover:bg-white/20"}`}>
                    <span className="font-black">{idx + 1}. {name}</span>
                    <span className="text-xs font-bold">{predictions[name] ? "Tippt mit" : "Neu"}</span>
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
