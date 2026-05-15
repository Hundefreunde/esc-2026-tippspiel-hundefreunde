# ESC 2026 Tippspiel Hundefreunde

Diese ZIP enthält ein fertiges Vercel-Projekt für das ESC-2026-Tippspiel.

## Kurz-Anleitung

1. ZIP entpacken.
2. Alle entpackten Dateien bei GitHub hochladen.
3. In Supabase die Datei `supabase-setup.sql` öffnen, den Inhalt kopieren und im SQL Editor ausführen.
4. In Supabase unter Project Settings > API die Project URL und den anon public key kopieren.
5. In Vercel das GitHub-Projekt importieren.
6. Bei Vercel unter Environment Variables eintragen:
   - `VITE_SUPABASE_URL` = deine Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = dein Supabase anon public key
7. Deploy klicken.
8. Den Vercel-Link teilen.

## Wichtig

Die Teilnehmerdaten sind im Code in `src/App.jsx` eingetragen. Wenn Eurovision die offizielle Liste ändert, kannst du diese Datei später anpassen.
