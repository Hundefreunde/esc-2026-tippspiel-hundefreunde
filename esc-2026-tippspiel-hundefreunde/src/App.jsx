 import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  BarChart3,
  ChevronsRight,
  Eye,
  MessageCircle,
  Music2,
  PawPrint,
  Send,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wifi,
  X,
} from "lucide-react";

const RAW_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_URL = RAW_SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
const IS_SUPABASE_CONFIGURED =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_URL.includes(".supabase.co") &&
  SUPABASE_ANON_KEY.length > 20;
const supabase = IS_SUPABASE_CONFIGURED ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

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

const emptyPrediction = { top1: "", top2: "", top3: "", top4: "", top5: "", last: "" };

const OFFICIAL_RESULTS = {
  top1: "Bulgaria",
  top2: "Israel",
  top3: "Romania",
  top4: "Australia",
  top5: "Italy",
  last: "United Kingdom",
};

const COUNTRY_FLAGS = {
  Bulgaria: "🇧🇬",
  Israel: "🇮🇱",
  Romania: "🇷🇴",
  Australia: "🇦🇺",
  Italy: "🇮🇹",
  "United Kingdom": "🇬🇧",
};

const RESULT_STORIES = [
  { place: 1, country: "Bulgaria", artist: "DARA", song: "Bangaranga", summary: "Bulgaria gewann mit einem energiegeladenen Pop-Auftritt, der moderne Club-Elemente mit folkloristischen Anklängen verbindet." },
  { place: 2, country: "Israel", artist: "Noam Bettan", song: "Michelle", summary: "Israel landete mit einer emotionalen Performance auf Platz 2." },
  { place: 3, country: "Romania", artist: "Alexandra Căpitănescu", song: "Choke Me", summary: "Rumänien erreichte Platz 3 mit einem dramatischen Pop-Rock-Auftritt." },
  { place: 4, country: "Australia", artist: "Delta Goodrem", song: "Eclipse", summary: "Australien überzeugte mit einer großen, professionellen Pop-Performance." },
  { place: 5, country: "Italy", artist: "Sal Da Vinci", song: "Per Sempre Sì", summary: "Italien erreichte die Top 5 mit einer warmen, melodischen Nummer." },
  { place: "Letzter Platz", country: "United Kingdom", artist: "LOOK MUM NO COMPUTER", song: "Eins, Zwei, Drei", summary: "Das Vereinigte Königreich landete auf dem letzten Platz." },
];

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

const PROFILE_DOG_SHEETS = [
  { breed: "Whippet", image: "/dogs/Whippet.png", cols: 4, rows: 4, count: 16 },
  { breed: "Bulldogge", image: "/dogs/Bulldogge.png", cols: 3, rows: 3, count: 9 },
  { breed: "Dackel", image: "/dogs/Dackel.png", cols: 4, rows: 4, count: 16 },
];

const PROFILE_DOG_OPTIONS = PROFILE_DOG_SHEETS.flatMap((sheet) =>
  Array.from({ length: sheet.count }).map((_, index) => {
    const col = index % sheet.cols;
    const row = Math.floor(index / sheet.cols);
    return {
      id: `${sheet.breed.toLowerCase()}-${index + 1}`,
      label: `${sheet.breed} ${index + 1}`,
      breed: sheet.breed,
      image: sheet.image,
      cols: sheet.cols,
      rows: sheet.rows,
      col,
      row,
    };
  })
);

const DEFAULT_PROFILE_DOG_ID = PROFILE_DOG_OPTIONS[0]?.id || "";

function getProfileDog(id) {
  return PROFILE_DOG_OPTIONS.find((dog) => dog.id === id) || PROFILE_DOG_OPTIONS[0];
}

function entryLabel(country) {
  const entry = ENTRIES.find((item) => item.country === country);
  return entry ? `${entry.country} — ${entry.artist} · “${entry.song}”` : "";
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[2rem] border border-white/20 bg-white/15 text-white shadow-2xl backdrop-blur ${className}`}>{children}</div>;
}

function Button({ children, className = "", ...props }) {
  return (
    <button {...props} className={`inline-flex items-center justify-center rounded-full px-5 py-3 font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
      {children}
    </button>
  );
}

function ProfileDogAvatar({ dogId, name = "", size = "md", className = "", onClick }) {
  const dog = getProfileDog(dogId);
  const sizeClass = size === "lg" ? "h-24 w-24" : size === "sm" ? "h-12 w-12" : "h-16 w-16";
  const backgroundPosition = dog
    ? `${dog.cols === 1 ? 0 : (dog.col / (dog.cols - 1)) * 100}% ${dog.rows === 1 ? 0 : (dog.row / (dog.rows - 1)) * 100}%`
    : "center";
  const backgroundSize = dog ? `${dog.cols * 100}% ${dog.rows * 100}%` : "cover";
  const content = dog ? (
    <span
      aria-hidden="true"
      className="block h-full w-full rounded-full bg-white bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${dog.image})`, backgroundPosition, backgroundSize }}
    />
  ) : (
    <span className="flex h-full w-full items-center justify-center rounded-full bg-white/90 text-xl">🐶</span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${sizeClass} shrink-0 overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-xl ring-2 ring-fuchsia-300/60 transition hover:scale-105 hover:ring-yellow-200 ${className}`}
        title={name ? `Profilbild von ${name} ändern` : "Profilbild ändern"}
      >
        {content}
      </button>
    );
  }

  return <div className={`${sizeClass} shrink-0 overflow-hidden rounded-full border-4 border-white/80 bg-white shadow-lg ${className}`}>{content}</div>;
}

function ProfileDogPicker({ open, selectedId, onSelect, onClose }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ scale: 0.92, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }} className="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-[2rem] border border-white/20 bg-[#24105f]/95 p-6 text-white shadow-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black">Profilbild wählen</h2>
              <p className="mt-1 text-white/80">Klick auf eine Pose, um sie als Profilbild zu speichern.</p>
            </div>
            <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"><X className="h-6 w-6" /></button>
          </div>
          <div className="space-y-7">
            {PROFILE_DOG_SHEETS.map((sheet) => {
              const options = PROFILE_DOG_OPTIONS.filter((dog) => dog.breed === sheet.breed);
              return (
                <section key={sheet.breed}>
                  <h3 className="mb-3 text-2xl font-black">{sheet.breed}</h3>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9">
                    {options.map((dog) => (
                      <button key={dog.id} type="button" onClick={() => onSelect(dog.id)} className={`rounded-[1.4rem] border p-3 transition hover:-translate-y-1 hover:bg-white/20 ${selectedId === dog.id ? "border-yellow-300 bg-yellow-300/25 ring-4 ring-yellow-300/40" : "border-white/15 bg-white/10"}`}>
                        <ProfileDogAvatar dogId={dog.id} size="lg" className="mx-auto" />
                        <div className="mt-2 truncate text-center text-xs font-black text-white/85">{dog.label}</div>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SelectEntry({ value, onChange, label, used = [] }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-white/95">{label}</span>
      <select value={value || ""} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-white/30 bg-white/95 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:ring-4 focus:ring-fuchsia-300">
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

function CelebrationEffect({ type }) {
  if (type === "fireworks") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div key={i} className="absolute h-2 w-2 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,.95)]" style={{ left: `${12 + (i * 10) % 82}%`, top: `${12 + (i * 17) % 62}%` }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.1, 0], opacity: [0, 1, 0] }} transition={{ duration: 1.25, delay: i * 0.08 }}>
            {Array.from({ length: 10 }).map((_, j) => <motion.span key={j} className="absolute left-1/2 top-1/2 h-1 w-12 origin-left rounded-full bg-gradient-to-r from-yellow-200 via-fuchsia-300 to-transparent" style={{ rotate: `${j * 36}deg` }} initial={{ scaleX: 0 }} animate={{ scaleX: [0, 1, 0] }} transition={{ duration: 1.2, delay: i * 0.08 }} />)}
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "lightbeams") {
    return <div className="absolute inset-0 overflow-hidden">{Array.from({ length: 8 }).map((_, i) => <motion.div key={i} className="absolute left-1/2 top-1/2 h-[150vh] w-16 origin-bottom rounded-full bg-gradient-to-t from-white/30 via-fuchsia-300/20 to-transparent blur-xl" style={{ rotate: `${i * 45}deg` }} initial={{ opacity: 0, scaleY: 0.25 }} animate={{ opacity: [0, 0.8, 0], scaleY: [0.25, 1, 0.4] }} transition={{ duration: 1.8, delay: i * 0.04 }} />)}</div>;
  }

  if (type === "sparkles") {
    return <div className="absolute inset-0 overflow-hidden">{Array.from({ length: 70 }).map((_, i) => <motion.span key={i} className="absolute text-2xl" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} initial={{ opacity: 0, scale: 0, rotate: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0], rotate: 180 }} transition={{ duration: 1.5, delay: Math.random() * 0.7 }}>✨</motion.span>)}</div>;
  }

  return <div className="absolute inset-0 overflow-hidden">{Array.from({ length: 95 }).map((_, i) => <motion.span key={i} initial={{ y: -80, x: `${Math.random() * 100}vw`, opacity: 0, rotate: 0, scale: 0.6 }} animate={{ y: "105vh", opacity: [0, 1, 1, 0], rotate: 720, scale: [0.6, 1, 0.8] }} transition={{ duration: 1.7 + Math.random() * 1, delay: Math.random() * 0.35, ease: "easeOut" }} className="absolute h-4 w-4 rounded-sm" style={{ background: ["#ff4fd8", "#ffe45e", "#39d7ff", "#a3ff53", "#ff8a3d"][i % 5] }} />)}</div>;
}

function DogCelebration({ dog, message }) {
  if (!dog) return null;
  return (
    <AnimatePresence>
      <motion.div className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-black/45 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <CelebrationEffect type={dog.effect || "confetti"} />
        <motion.div initial={{ scale: 0.72, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.84, opacity: 0, y: -35 }} transition={{ duration: 0.45, ease: "easeOut" }} className="relative flex flex-col items-center">
          <motion.img src={dog.image} alt="" draggable="false" initial={{ rotate: -4, scale: 0.96 }} animate={{ rotate: [0, -2, 2, 0], scale: [0.96, 1.02, 1] }} transition={{ duration: 1.15 }} className="max-h-[72vh] max-w-[78vw] select-none object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.65)]" />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ delay: 0.08 }} className="mt-5 rounded-full border border-white/20 bg-white/15 px-7 py-3 text-center text-2xl font-black tracking-tight text-white shadow-2xl backdrop-blur-xl">{message}</motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ResultFlag({ country }) {
  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-purple-800/35 to-cyan-500/25 shadow-inner">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,.28),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,.14),transparent_28%)]" />
      <motion.div initial={{ scale: 0.86, rotate: -4 }} animate={{ scale: [0.86, 1.02, 1], rotate: [-4, 2, 0] }} transition={{ duration: 0.7, ease: "easeOut" }} className="relative text-[7rem] leading-none drop-shadow-[0_18px_30px_rgba(0,0,0,0.35)]" aria-label={`Flagge ${country}`}>{COUNTRY_FLAGS[country] || "🏳️"}</motion.div>
    </div>
  );
}

function scorePrediction(prediction, results) {
  const top5 = [results.top1, results.top2, results.top3, results.top4, results.top5].filter(Boolean);
  const exactMap = { top1: results.top1, top2: results.top2, top3: results.top3, top4: results.top4, top5: results.top5 };
  const rows = [];
  let total = 0;

  ["top1", "top2", "top3", "top4", "top5"].forEach((key, index) => {
    const pick = prediction[key];
    let points = 0;
    let reason = "–";

    if (pick) {
      if (exactMap[key] === pick) {
        points = 10;
        reason = "Top-5-Act auf richtigem Platz";
      } else if (top5.includes(pick)) {
        points = 5;
        reason = "Top-5-Treffer, aber anderer Platz";
      } else {
        reason = "nicht in den Top 5";
      }
    }

    total += points;
    rows.push({ label: `Platz ${index + 1}`, pick, points, reason, correct: points === 10, partial: points === 5 });
  });

  if (prediction.top1) {
    const points = prediction.top1 === results.top1 ? 30 : 0;
    total += points;
    rows.push({ label: "Siegertipp", pick: prediction.top1, points, reason: points ? "richtiger Siegertipp" : "nicht Sieger", correct: points > 0, partial: false });
  }

  if (prediction.last) {
    const points = prediction.last === results.last ? 20 : 0;
    total += points;
    rows.push({ label: "Letzter Platz", pick: prediction.last, points, reason: points ? "richtiger letzter Platz" : "nicht letzter Platz", correct: points > 0, partial: false });
  }

  return { total, rows, exact: rows.filter((row) => row.correct).length, partial: rows.filter((row) => row.partial).length };
}

function PointsOverview() {
  const rules = [
    { points: 30, title: "Richtiger Siegertipp", desc: "Dein Platz-1-Tipp ist automatisch dein Siegertipp." },
    { points: 20, title: "Richtiger letzter Platz", desc: "Du hast den Act auf dem letzten Platz korrekt getippt." },
    { points: 10, title: "Top 5 exakt", desc: "Ein Act ist in den Top 5 und genau auf dem richtigen Platz." },
    { points: 5, title: "Top 5 Treffer", desc: "Ein Act ist in den Top 5, aber auf einem anderen Platz als getippt." },
  ];

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3"><Target className="h-8 w-8 text-yellow-200" /><div><h2 className="text-4xl font-black">Punkteübersicht</h2><p className="text-white/80">So werden die Tipps im Hundefreunde Wettstudio gewertet.</p></div></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {rules.map((rule) => <div key={rule.title} className="rounded-[2rem] bg-white/10 p-5 text-center"><div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-300 text-3xl font-black text-slate-950">{rule.points}</div><h3 className="text-xl font-black">{rule.title}</h3><p className="mt-2 text-sm text-white/80">{rule.desc}</p></div>)}
      </div>
    </Card>
  );
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
  const [activeDog, setActiveDog] = useState(null);
  const [dogMessage, setDogMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [scoreCelebrationKey, setScoreCelebrationKey] = useState(0);
  const [profilePictures, setProfilePictures] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("esc2026_profilePictures") || "{}");
    } catch {
      return {};
    }
  });
  const [profilePickerOpen, setProfilePickerOpen] = useState(false);

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

  function openView(nextView) {
    setView(nextView);
    if (nextView === "score") setScoreCelebrationKey((value) => value + 1);
  }

  function getRank(index, sortedPlayers) {
    if (index === 0) return 1;
    const current = sortedPlayers[index];
    const previous = sortedPlayers[index - 1];
    if (current.total === previous.total) return getRank(index - 1, sortedPlayers);
    return getRank(index - 1, sortedPlayers) + 1;
  }

  async function saveProfilePicture(dogId) {
    if (!currentName || !dogId) return;
    const next = { ...profilePictures, [currentName]: dogId };
    setProfilePictures(next);
    localStorage.setItem("esc2026_profilePictures", JSON.stringify(next));
    setProfilePickerOpen(false);
    showDog("Profilbild gespeichert!");

    if (supabase) {
      const { error } = await supabase.from("esc2026_profiles").upsert({ player_name: currentName, avatar_id: dogId, updated_at: new Date().toISOString() }, { onConflict: "player_name" });
      if (error) setStatus("Profilbild lokal gespeichert – für Live-Sync bitte Tabelle esc2026_profiles anlegen.");
      else await refreshAll();
    }
  }

  async function savePrediction(next, message = "Tipps automatisch gespeichert!") {
    if (!currentName || !supabase) return;
    const cleaned = { top1: next.top1 || "", top2: next.top2 || "", top3: next.top3 || "", top4: next.top4 || "", top5: next.top5 || "", last: next.last || "" };
    setDraftPrediction(cleaned);
    setPredictions((prev) => ({ ...prev, [currentName]: cleaned }));
    const { error } = await supabase.from("esc2026_predictions").upsert({ player_name: currentName, ...cleaned, winner: cleaned.top1, updated_at: new Date().toISOString() }, { onConflict: "player_name" });
    if (error) {
      setStatus(`Speichern fehlgeschlagen: ${error.message}`);
      return;
    }
    showDog(message);
    await refreshAll();
  }

  function setDraftField(key, value) {
    const next = { ...draftPrediction, [key]: value };
    setDraftPrediction(next);
    savePrediction(next);
  }

  async function refreshAll() {
    if (!supabase) {
      setStatus("Nicht verbunden: Vercel Supabase Variablen prüfen");
      return;
    }

    const playersRequest = supabase.from("esc2026_players").select("name, created_at").order("created_at", { ascending: true });
    const [p, t, c, a] = await Promise.all([
      playersRequest,
      supabase.from("esc2026_predictions").select("*"),
      supabase.from("esc2026_chat").select("id, player_name, message, created_at").order("created_at", { ascending: true }).limit(120),
      supabase.from("esc2026_profiles").select("player_name, avatar_id"),
    ]);

    if (p.error || t.error) {
      setStatus(`Nicht verbunden: ${p.error?.message || t.error?.message || "Supabase prüfen"}`);
      return;
    }

    setPlayers((p.data || []).map((item) => item.name));
    setPredictions(Object.fromEntries((t.data || []).map((item) => [item.player_name, { top1: item.top1 || "", top2: item.top2 || "", top3: item.top3 || "", top4: item.top4 || "", top5: item.top5 || "", last: item.last || "" }])));
    setResults({ ...OFFICIAL_RESULTS });

    if (!a.error) {
      const remoteProfilePictures = Object.fromEntries((a.data || []).filter((item) => item.avatar_id).map((item) => [item.player_name, item.avatar_id]));
      if (Object.keys(remoteProfilePictures).length) {
        setProfilePictures((prev) => {
          const merged = { ...prev, ...remoteProfilePictures };
          localStorage.setItem("esc2026_profilePictures", JSON.stringify(merged));
          return merged;
        });
      }
    }

    if (!c.error) {
      setChatMessages(c.data || []);
      setStatus("Verbunden mit Supabase ✓");
    } else {
      setChatMessages([]);
      setStatus(`Verbunden – Chat prüfen: ${c.error.message}`);
    }
  }

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 3000);
    if (!supabase) return () => clearInterval(interval);

    const channel = supabase
      .channel("esc2026-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_players" }, refreshAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_predictions" }, refreshAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "esc2026_chat" }, refreshAll)
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setDraftPrediction(predictions[currentName] || { ...emptyPrediction });
  }, [currentName, predictions]);

  function selectPlayer(name) {
    setSelectedPlayerView(name);
    setView("vote");
  }

  function editAsPlayer(name) {
    localStorage.setItem("esc2026_currentName", name);
    setCurrentName(name);
    setSelectedPlayerView(name);
    setView("vote");
    setDraftPrediction(predictions[name] || { ...emptyPrediction });
  }

  async function login() {
    const clean = nameInput.trim();
    if (!clean || !supabase) return;
    if (!players.includes(clean)) setPlayers((prev) => [...prev, clean]);
    await supabase.from("esc2026_players").upsert({ name: clean }, { onConflict: "name" });
    await supabase.from("esc2026_predictions").upsert({ player_name: clean, ...emptyPrediction, winner: "" }, { onConflict: "player_name" });
    localStorage.setItem("esc2026_currentName", clean);
    setCurrentName(clean);
    setSelectedPlayerView(clean);
    setNameInput("");
    showDog("Herzlich willkommen!");
    refreshAll();
  }

  async function sendChat() {
    const message = chatInput.trim();
    if (!message || !currentName || !supabase) return;
    setChatInput("");
    const { error } = await supabase.from("esc2026_chat").insert({ player_name: currentName, message });
    if (error) {
      setStatus(`Chat konnte nicht gespeichert werden: ${error.message}`);
      setChatInput(message);
    } else {
      refreshAll();
    }
  }

  async function applyOfficialResults() {
    if (supabase) await supabase.from("esc2026_results").upsert({ id: 1, ...OFFICIAL_RESULTS, winner: OFFICIAL_RESULTS.top1, updated_at: new Date().toISOString() }, { onConflict: "id" });
    setResults({ ...OFFICIAL_RESULTS });
    openView("score");
    showDog("Ergebnis aktualisiert!");
  }

  async function removePlayer(name) {
    if (!supabase || !name) return;
    if (!confirm(`${name} wirklich entfernen? Die Tipps dieser Person werden ebenfalls gelöscht.`)) return;
    await supabase.from("esc2026_predictions").delete().eq("player_name", name);
    await supabase.from("esc2026_players").delete().eq("name", name);
    if (currentName === name) {
      localStorage.removeItem("esc2026_currentName");
      setCurrentName("");
      setDraftPrediction({ ...emptyPrediction });
    }
    if (selectedPlayerView === name) setSelectedPlayerView("");
    await refreshAll();
  }

  const scoringResults = useMemo(() => ({ ...OFFICIAL_RESULTS }), []);
  const leaderboard = useMemo(() => {
    const sortedPlayers = players
      .map((name) => ({ name, ...scorePrediction(predictions[name] || emptyPrediction, scoringResults) }))
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
    return sortedPlayers.map((player, index, list) => ({ ...player, rank: getRank(index, list) }));
  }, [players, predictions, scoringResults]);

  const maxScore = Math.max(1, ...leaderboard.map((player) => player.total));
  const usedTop = [draftPrediction.top1, draftPrediction.top2, draftPrediction.top3, draftPrediction.top4, draftPrediction.top5].filter(Boolean);
  const viewedPrediction = predictions[selectedPlayerView] || emptyPrediction;
  const currentProfileDogId = profilePictures[currentName] || DEFAULT_PROFILE_DOG_ID;

  const navItems = [
    { id: "vote", label: currentName || "Tipps", icon: PawPrint },
    { id: "results", label: "Ergebnis", icon: Trophy },
    { id: "score", label: "Auswertung", icon: BarChart3 },
    { id: "points", label: "Punkteübersicht", icon: Target },
    { id: "archive", label: "Archiv", icon: Archive },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#ff2fb3,_transparent_30%),radial-gradient(circle_at_top_right,_#00d4ff,_transparent_26%),linear-gradient(135deg,_#1c0d5a,_#6616b8_45%,_#f0673b)] p-4 text-white md:p-8">
      <DogCelebration dog={activeDog} message={dogMessage} />
      <ProfileDogPicker open={profilePickerOpen} selectedId={currentProfileDogId} onSelect={saveProfilePicture} onClose={() => setProfilePickerOpen(false)} />

      <div className="mx-auto max-w-[1720px]">
        <div className="grid gap-6 xl:grid-cols-[1fr_390px_390px]">
          <div>
            <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-5 min-h-[250px] overflow-hidden rounded-[2rem] border border-white/20 bg-white/15 p-7 shadow-2xl backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,255,255,.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(0,212,255,.16),transparent_24%)]" />
              <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 2.8 }} className="relative mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold"><Sparkles className="h-4 w-4" /> ESC 2026 · Live Tipp-Wette</motion.div>
              <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">Hundefreunde Wettstudio ESC 2026</h1>
                  <p className="mt-4 max-w-2xl text-lg text-white/90">Gemeinsamer Tippstand, Live-Chat und automatische Speicherung auf allen Geräten.</p>
                </div>
                <div className="grid min-w-[250px] gap-3 text-sm md:text-right">
                  <div className={`rounded-2xl p-4 font-bold ${status.startsWith("Verbunden") ? "bg-lime-400/25" : "bg-white/20"}`}><Wifi className="mr-2 inline h-4 w-4" />{status}</div>
                  <div className="rounded-2xl bg-white/20 p-4 font-bold"><Users className="mr-2 inline h-4 w-4" />{players.length} Mitspieler:innen</div>
                </div>
              </div>
            </motion.header>

            <div className="mb-5 flex flex-wrap gap-2">
              {navItems.map(({ id, label, icon: Icon }) => <Button key={id} onClick={() => openView(id)} className={view === id ? "bg-white text-fuchsia-700 hover:bg-white" : "bg-white/20 text-white hover:bg-white/30"}><Icon className="mr-2 h-4 w-4" />{label}</Button>)}
            </div>

            {!currentName && view === "vote" && (
              <Card className="mb-5 p-6">
                <h2 className="mb-2 text-3xl font-black">Einloggen zum Tippen</h2>
                <p className="mb-4 text-white/80">Name eingeben oder rechts einen vorhandenen Namen anklicken.</p>
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <input value={nameInput} onChange={(event) => setNameInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && login()} placeholder="Dein Name" className="rounded-2xl border border-white/30 bg-white/95 px-4 py-4 text-slate-900 outline-none focus:ring-4 focus:ring-fuchsia-300" />
                  <Button onClick={login} disabled={!supabase || !nameInput.trim()} className="rounded-2xl bg-fuchsia-500 px-8 py-6 text-white hover:bg-fuchsia-600"><Music2 className="mr-2 h-4 w-4" />Los geht’s</Button>
                </div>
              </Card>
            )}

            {currentName && view === "vote" && (
              <Card className="p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-center gap-4">
                    <ProfileDogAvatar dogId={currentProfileDogId} name={currentName} size="lg" onClick={() => setProfilePickerOpen(true)} />
                    <div>
                      <h2 className="text-3xl font-black">Tipps von {currentName} <span className="text-yellow-300">♛</span></h2>
                      <p className="text-white/90">Jede Auswahl wird automatisch gespeichert. Platz 1 ist automatisch dein Siegertipp.</p>
                      <button type="button" onClick={() => setProfilePickerOpen(true)} className="mt-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black text-white hover:bg-white/25">Profilbild ändern</button>
                    </div>
                  </div>
                  <Button onClick={() => { localStorage.removeItem("esc2026_currentName"); setCurrentName(""); }} className="bg-white/20 text-white hover:bg-white/30"><Users className="mr-2 h-4 w-4" />Als anderen wählen</Button>
                </div>
                <div className="grid gap-4 md:grid-cols-5">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const key = `top${n}`;
                    return <motion.div whileHover={{ y: -4 }} key={key} className="rounded-3xl bg-white/10 p-4"><SelectEntry label={`${n}. Platz`} value={draftPrediction[key]} used={usedTop} onChange={(value) => setDraftField(key, value)} /></motion.div>;
                  })}
                </div>
                <div className="mt-4 rounded-3xl bg-cyan-300/20 p-4 md:w-1/2"><SelectEntry label="Wer wird letzter? · 20 Punkte" value={draftPrediction.last} onChange={(value) => setDraftField("last", value)} /></div>
              </Card>
            )}

            {view === "results" && (
              <Card className="p-6">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="text-3xl font-black">Offizielles Ergebnis</h2><p className="text-white/80">Top 5 und letzter Platz mit Flaggen, Künstler:innen, Song und Kurzinfos.</p></div><Button onClick={applyOfficialResults} className="bg-lime-300 px-6 text-slate-950 hover:bg-lime-200"><Trophy className="mr-2 h-4 w-4" />Ergebnis übernehmen</Button></div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {RESULT_STORIES.map((item) => <div key={`${item.place}-${item.country}`} className="rounded-[2rem] bg-white/10 p-4"><ResultFlag country={item.country} /><div className="mt-4"><div className="text-sm font-black text-cyan-200">{typeof item.place === "number" ? `${item.place}. Platz` : item.place}</div><h3 className="text-2xl font-black">{item.country}</h3><p className="font-bold text-white/90">{item.artist} · “{item.song}”</p></div><p className="mt-3 text-sm leading-relaxed text-white/85">{item.summary}</p></div>)}
                </div>
              </Card>
            )}

            {view === "points" && <PointsOverview />}

            {view === "archive" && (
              <Card className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Archive className="h-8 w-8 text-yellow-200" />
                  <div>
                    <h2 className="text-4xl font-black">Archiv</h2>
                    <p className="text-white/80">Alle abgeschlossenen ESC-Jahre werden hier gesammelt. Das aktuelle Ergebnis ist als Archivposter unter ESC 2026 abgelegt.</p>
                  </div>
                </div>
                <div className="rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-fuchsia-500/35 via-purple-700/40 to-cyan-400/25 p-6 shadow-2xl">
                  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <div className="mb-2 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-black">Archivbild</div>
                      <h3 className="text-5xl font-black leading-none">ESC 2026</h3>
                      <p className="mt-2 text-white/80">Offizielles Hundefreunde-Wettstudio Ergebnis inklusive Endranking</p>
                    </div>
                    <div className="rounded-3xl bg-yellow-300 px-6 py-4 text-right text-slate-950">
                      <div className="text-xs font-black uppercase tracking-widest">Sieger</div>
                      <div className="text-3xl font-black">🇧🇬 Bulgaria</div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {RESULT_STORIES.map((item) => (
                      <div key={`archive-${item.country}`} className="rounded-[2rem] bg-white/15 p-5">
                        <div className="mb-3 flex items-center gap-4">
                          <div className="text-5xl">{COUNTRY_FLAGS[item.country] || "🏳️"}</div>
                          <div><div className="text-sm font-black text-cyan-200">{typeof item.place === "number" ? `${item.place}. Platz` : item.place}</div><div className="text-2xl font-black">{item.country}</div></div>
                        </div>
                        <div className="font-bold text-white/90">{item.artist}</div>
                        <div className="text-sm text-white/80">“{item.song}”</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 rounded-[2rem] bg-black/20 p-5">
                    <div className="mb-4 flex items-center gap-3"><Trophy className="h-7 w-7 text-yellow-200" /><div><h4 className="text-3xl font-black">Mitspieler-Ranking</h4><p className="text-sm text-white/75">Archivierte Übersicht: Wer welchen Platz belegt hat und wie viele Punkte erreicht wurden.</p></div></div>
                    {leaderboard.length === 0 ? (
                      <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/80">Noch keine Mitspieler:innen im Archiv vorhanden.</div>
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.map((player) => (
                          <div key={`archive-player-${player.name}`} className="rounded-2xl bg-white/12 p-4">
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <ProfileDogAvatar dogId={profilePictures[player.name] || DEFAULT_PROFILE_DOG_ID} name={player.name} size="sm" />
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-black text-fuchsia-700">{player.rank}</div>
                                <div><div className="text-2xl font-black">{player.name}</div><div className="text-xs text-white/70">{player.exact} Volltreffer · {player.partial} Top-5-Treffer</div></div>
                              </div>
                              <div className="text-right"><div className="text-3xl font-black text-yellow-200">{player.total}</div><div className="text-xs font-bold uppercase tracking-widest text-white/70">Punkte</div></div>
                            </div>
                            <div className="h-3 overflow-hidden rounded-full bg-black/30"><div className="h-full rounded-full bg-gradient-to-r from-lime-300 via-yellow-300 to-fuchsia-300" style={{ width: `${Math.max(5, (player.total / maxScore) * 100)}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {view === "score" && (
              <Card className="p-6">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div><h2 className="text-4xl font-black">Live-Auswertung</h2><p className="text-white/80">Automatisch berechnet nach dem offiziellen Ergebnis.</p></div>
                  <Button onClick={() => setScoreCelebrationKey((value) => value + 1)} className="bg-yellow-300 text-slate-950 hover:bg-yellow-200"><Sparkles className="mr-2 h-4 w-4" />Noch mal feiern</Button>
                </div>
                {leaderboard.length === 0 ? (
                  <div className="rounded-3xl bg-white/10 p-6 text-white/80">Noch keine Mitspieler:innen vorhanden.</div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {leaderboard.map((player, index) => (
                        <motion.div key={`${scoreCelebrationKey}-${player.name}`} layout initial={{ opacity: 0, x: -30, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: index * 0.06 }} className="rounded-[2rem] bg-white/12 p-5">
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4"><ProfileDogAvatar dogId={profilePictures[player.name] || DEFAULT_PROFILE_DOG_ID} name={player.name} size="sm" /><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl font-black text-fuchsia-700">{player.rank}</div><div><h3 className="text-3xl font-black">{player.name}</h3><p className="text-sm text-white/75">{player.exact} Volltreffer · {player.partial} Top-5-Treffer</p></div></div>
                            <div className="text-left md:text-right"><div className="text-5xl font-black text-yellow-200">{player.total}</div><div className="text-xs font-bold uppercase tracking-widest text-white/70">Punkte</div></div>
                          </div>
                          <div className="mt-4 h-4 overflow-hidden rounded-full bg-black/30"><motion.div className="h-full rounded-full bg-gradient-to-r from-lime-300 via-yellow-300 to-fuchsia-300" initial={{ width: 0 }} animate={{ width: `${Math.max(5, (player.total / maxScore) * 100)}%` }} transition={{ duration: 0.7, delay: index * 0.08 }} /></div>
                          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                            {player.rows.map((row) => (
                              <div key={`${player.name}-${row.label}`} className="rounded-2xl bg-black/18 p-3">
                                <div className="flex items-center justify-between gap-3"><div className="font-black">{row.label}</div><div className={`rounded-full px-3 py-1 text-sm font-black ${row.points > 0 ? "bg-yellow-300 text-slate-950" : "bg-white/10 text-white/75"}`}>{row.points}</div></div>
                                <div className="mt-1 text-sm text-white/85">{row.pick ? entryLabel(row.pick) : "kein Tipp"}</div>
                                <div className="mt-1 text-xs text-white/60">{row.reason}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </Card>
            )}
          </div>

          <aside className="space-y-5">
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-3"><Users className="h-7 w-7 text-cyan-200" /><div><h2 className="text-2xl font-black">Mitspieler:innen</h2><p className="text-sm text-white/70">Ansehen, übernehmen oder entfernen.</p></div></div>
              {players.length === 0 ? (
                <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/75">Noch niemand eingeloggt.</div>
              ) : (
                <div className="space-y-3">
                  {players.map((name) => (
                    <div key={name} className={`rounded-2xl p-3 transition ${selectedPlayerView === name ? "bg-yellow-300/20 ring-2 ring-yellow-300/40" : "bg-white/10"}`}>
                      <div className="flex items-center gap-3"><ProfileDogAvatar dogId={profilePictures[name] || DEFAULT_PROFILE_DOG_ID} name={name} size="sm" /><div className="min-w-0 flex-1"><div className="truncate text-lg font-black">{name}</div><div className="text-xs text-white/65">{predictions[name]?.top1 ? `Siegertipp: ${predictions[name].top1}` : "noch kein Siegertipp"}</div></div></div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <Button onClick={() => selectPlayer(name)} className="bg-white/15 px-3 py-2 text-xs text-white hover:bg-white/25"><Eye className="mr-1 h-3 w-3" />Ansehen</Button>
                        <Button onClick={() => editAsPlayer(name)} className="bg-fuchsia-500 px-3 py-2 text-xs text-white hover:bg-fuchsia-600"><ChevronsRight className="mr-1 h-3 w-3" />Tippen</Button>
                        <Button onClick={() => removePlayer(name)} className="bg-black/20 px-3 py-2 text-xs text-white hover:bg-black/35"><X className="mr-1 h-3 w-3" />Löschen</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-3"><Eye className="h-7 w-7 text-yellow-200" /><div><h2 className="text-2xl font-black">Tipp-Ansicht</h2><p className="text-sm text-white/70">{selectedPlayerView || "Wähle rechts eine Person aus."}</p></div></div>
              {selectedPlayerView ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const key = `top${n}`;
                    return <div key={key} className="rounded-2xl bg-white/10 p-3"><div className="text-xs font-black uppercase tracking-widest text-cyan-200">{n}. Platz</div><div className="font-bold">{viewedPrediction[key] ? entryLabel(viewedPrediction[key]) : "–"}</div></div>;
                  })}
                  <div className="rounded-2xl bg-cyan-300/15 p-3"><div className="text-xs font-black uppercase tracking-widest text-cyan-200">Letzter Platz</div><div className="font-bold">{viewedPrediction.last ? entryLabel(viewedPrediction.last) : "–"}</div></div>
                </div>
              ) : (
                <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/75">Noch keine Person ausgewählt.</div>
              )}
            </Card>
          </aside>

          <aside>
            <Card className="flex max-h-[calc(100vh-4rem)] min-h-[680px] flex-col p-5">
              <div className="mb-4 flex items-center gap-3"><MessageCircle className="h-7 w-7 text-lime-200" /><div><h2 className="text-2xl font-black">Live-Chat</h2><p className="text-sm text-white/70">Plaudern während des Tippens.</p></div></div>
              <div className="min-h-0 flex-1 space-y-3 overflow-auto rounded-[1.5rem] bg-black/18 p-3">
                {chatMessages.length === 0 ? (
                  <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/75">Noch keine Nachrichten.</div>
                ) : (
                  chatMessages.map((message) => (
                    <div key={message.id} className="rounded-2xl bg-white/12 p-3"><div className="mb-1 flex items-center justify-between gap-3"><div className="font-black text-yellow-200">{message.player_name}</div><div className="text-[10px] text-white/50">{message.created_at ? new Date(message.created_at).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : ""}</div></div><p className="whitespace-pre-wrap break-words text-sm text-white/90">{message.message}</p></div>
                  ))
                )}
              </div>
              <div className="mt-4 grid gap-2">
                <textarea value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendChat(); } }} placeholder={currentName ? "Nachricht schreiben …" : "Zum Chatten erst einloggen"} disabled={!currentName || !supabase} className="min-h-[90px] rounded-2xl border border-white/25 bg-white/95 p-3 text-slate-900 outline-none focus:ring-4 focus:ring-lime-300 disabled:opacity-60" />
                <Button onClick={sendChat} disabled={!chatInput.trim() || !currentName || !supabase} className="bg-lime-300 text-slate-950 hover:bg-lime-200"><Send className="mr-2 h-4 w-4" />Senden</Button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
