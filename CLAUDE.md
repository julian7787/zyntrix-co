# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Überblick

Statische Marketing-Website für **Zyntrix** (Produkt: „Nils“, KI-Mitarbeiter für WhatsApp/Telegram), gehostet auf **GitHub Pages** unter `zyntrix.co` (`CNAME`). Kein Build, kein Package-Manager, keine Tests, kein Linter – Änderungen werden committet und gepusht, GitHub Pages deployt automatisch. Inhalte, Kommentare und Commit-Messages sind auf Deutsch.

Lokale Vorschau (Root-relative Pfade wie `/favicon.ico` brauchen einen Server):

```bash
python3 -m http.server 8000
```

Im Claude-Desktop-Browser: `preview_start` mit `site` (`.claude/launch.json`, Port 8123).

## Corporate Identity – verbindlich

**Die Startseite `index.html` ist die Corporate Identity von Zyntrix.** Jede neue oder überarbeitete Seite, jedes Dokument (PDF, DOCX, PPTX, E-Mail-Vorlage, Grafik …) und jede sonstige Ausgabe übernimmt exakt ihre Elemente, Farben und Schriften. Das gilt immer, auch wenn es in der Anfrage nicht eigens erwähnt wird.

- **Nur bestehende CSS-Klassen der Startseite verwenden.** Keine neuen Klassen, keine eigenen Komponenten, keine Inline-Styles als Ersatz. Markup und Klassen aus `index.html` übernehmen (z. B. `wrap`, `section`, `section-top`, `eyebrow`, `button`, `text-link`, `card`, `step-card`, `value-card`, `grid2`, `grid3`, `faq-list`, `check-card`, `field`, `fields`, `form-button`, `footer`, `site-header`, `brand`). Das CSS kommt 1:1 aus dem `<style>` von `index.html` (Unterseiten binden dafür `site.css` ein). Fehlt ein Element: nicht erfinden, sondern beim User nachfragen.
- **Farben – ausschließlich diese** (`:root` in `index.html`):
  - `--ink` `#20434F` (Primär, Text, dunkle Flächen) · `--lime` `#D2E245` (Akzent, Buttons)
  - `--muted` `#556E77` (Fließtext sekundär) · `--line` `#E2E7E8` (Linien, Rahmen) · `--paper`/`--white` `#FFFFFF`
  - Flächen: `#F2F4F4` (Panels, Tags) · `#F9FBEE` (Hover) · `#2A5361` (Fläche auf Dunkel)
  - Nur im jeweiligen Kontext: `#C0474B` Fehler · `#B0791A` Hinweis · `#1F7A5A` Status · `#D9FDD3` WhatsApp-Bubble
- **Schriften:** Space Grotesk (`assets/landing2/space-grotesk.woff2`) für Überschriften, Buttons, Marke; Inter (`assets/landing2/inter.woff2`) für Text. Keine Google-Fonts-Einbindung, keine weiteren Schriften. Radius `--radius` 18px.
- **Bildsprache/Marke:** Nils-Avatar `assets/landing2/nils.webp`, Kundenlogos aus `assets/landing2/`, Tonalität wie auf der Startseite (Kunden werden gesiezt).
- Abweichende Seiten sind Altlasten, keine Vorlage: `archiv/`, `assets/legacy/`.

## `index.html` – Startseite (ehem. „Landingpage 2“)

Normales, handgeschriebenes HTML (~70 KB, eine Datei): CSS im `<style>`, Logik in einem Inline-`<script>` am Ende (Vanilla JS, `$()` = `getElementById`). Viele Regeln stehen minifiziert in einer Zeile – Änderungen per exaktem String-Replace. Assets (Fonts, Nils-Avatar, Kundenlogos, OG-Bild) unter `assets/landing2/`, relativ referenziert. Sonstiges: `docs/landing2-umsetzung.md`.

- Branchen-Varianten per URL: `?b=handwerk` (Standard), `gastro`, `immo`, `hausverwaltung`, `kanzlei` (`BRANCHES` im Script).
- Anker: `#inhalt`, `#so-funktionierts`, `#beispiele`, `#rechner`, `#datenschutz`, `#referenzen`, `#faq`, `#potenzialcheck`.
- Potenzialcheck: 4 Klick-Schritte (`#quiz`), dann Kontaktformular (`#form-panel`), Bestätigung (`#thank-you`). Alle drei liegen im selben Grid-Feld der `.check-card` → die Kartenhöhe ist über alle Schritte gleich; Fehlertexte haben reservierten Platz. Layoutänderungen am Formular deshalb auch in den Quiz-Schritten (Mobile!) prüfen.
- Vorherige gebündelte Startseite (Claude-Design-/`x-dc`-Export): `archiv/index_bundle_20260915.html`.

## Kontaktformular-Flow (übergreifend)

Im Submit-Handler von `#lead-form` (`index.html`, Script-Ende):

1. Validierung, Honeypot `botcheck`, Telefon-Normalisierung; Check-Antworten, Rechnerwerte, `datenschutzvariante`, `anzeigen_branche`, `event_id` werden angehängt.
2. `POST` an Web3Forms (`access_key` als Hidden-Field) → E-Mail.
3. Erst bei Erfolg: fire-and-forget `POST` (JSON, ohne `access_key`) an `TELEGRAM_ENDPOINT` (Cloudflare Worker, `keepalive`). Fehler dort dürfen den Formularerfolg nie beeinflussen; leerer Endpoint = deaktiviert.
4. `handOffLead()` legt `{eventId, ts}` unter `sessionStorage['zyntrix:lead']` ab, zeigt `#thank-you` als Rückfall und leitet nach 250 ms auf `danke.html` weiter.
5. `danke.html` liest/löscht den Token und feuert das Meta-Pixel-`Lead`-Event. Fallback: ist der Token nach 3 s noch da, feuert `index.html` selbst – mit derselben `eventID` zur Deduplizierung. Schlüssel/Logik auf beiden Seiten synchron halten.

Lokal testen: Web3Forms verschickt auch von `localhost` echte E-Mails, und das Pixel-`Lead`-Event feuert ebenfalls (verfälscht Meta-Tracking) – `fetch`/`fbq` im Browser vorher überschreiben. Der Worker lehnt `localhost` ab (403 `origin_not_allowed`, nicht in `ALLOWED_ORIGINS`), das Formular funktioniert trotzdem.

Telefonfeld: Vorwahl-Dropdown (`vorwahl`) wird in `telefon` zusammengeführt und vor dem Senden entfernt (iOS-AutoFill liefert oft nationale Schreibweise).

## `telegram-worker/`

Cloudflare Worker (`worker.js`), der Leads in eine Telegram-Gruppe postet, damit das Bot-Token nicht im öffentlichen Quelltext steht. Origin-Allowlist (`ALLOWED_ORIGINS` in `wrangler.toml`), Honeypot `botcheck`, Feldkürzung + HTML-Escaping. Secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Neue Formularfelder erscheinen automatisch; Formular-Mechanikfelder gehören in `IGNORED_FIELDS`.

```bash
cd telegram-worker
npx wrangler deploy
npx wrangler tail            # Logs
```

Test-`curl` und Fehlercodes: `telegram-worker/README.md`.

## Weitere Dateien

- **CSS-Kopien synchron halten:** Das `<style>` von `index.html` existiert zusätzlich als `site.css` (eingebunden von `impressum.html`, `datenschutz.html`, `agb.html`) und als Inline-`<style>` in `danke.html`. Jede CSS-Änderung an der Startseite in beide Kopien übernehmen.
- `danke.html` – Danke-Seite nach dem Formular, `noindex`, nur Klassen der Startseite; Datenschutz-Umschalter und -Dialog per kleinem Inline-Script. Links auf `/` bzw. `/#anker`.
- `impressum.html`, `datenschutz.html`, `agb.html` – Rechtsseiten, im Footer aller Seiten verlinkt. Der kurze `#privacy-dialog` in `index.html`/`danke.html` (Link an der Einwilligungs-Checkbox) nennt ebenfalls die eingesetzten Dienste – bei neuen Diensten/Trackern Dialog und `datenschutz.html` gemeinsam anpassen.
- `assets/legacy/` (`style.css`, `script.js`) – Reste des alten „Zyntrix v3“-Designs; die zugehörigen Seiten `leistungen.html`, `team.html`, `use-cases.html` sind entfernt, nichts bindet die Dateien mehr ein.
- `archiv/` – alte Startseiten (`index_bundle_20260915.html` = bisheriges Bundle, `index_backup_20260810_173150.html` = unbündelt), nicht live verlinkt, aber öffentlich erreichbar.
- `assets/icons/` – Favicon-PNGs (referenziert in allen Seiten und in `site.webmanifest`). `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`, `CNAME` bleiben bewusst im Root.
- `assets/img/` – `logo.jpg` (nur Legacy, derzeit nirgends eingebunden), `nils-avatar.png` (derzeit nirgends eingebunden); `assets/img/kunden/` – Kundenlogos, derzeit nirgends eingebunden (`index.html` nutzt `assets/landing2/`).
- `docs/` – Dokumente/Anleitungen (z. B. Cloudflare-Worker-PDF). Achtung: alles im Repo ist öffentlich unter `zyntrix.co/…` erreichbar.
- HTML-Seiten bleiben im Root, damit ihre öffentlichen URLs stabil bleiben.
- Tracking in jeder Seite im `<head>` – bei neuen Seiten beides übernehmen: Google Analytics (gtag, `G-1M1GFKZNW0`, ganz oben) und Meta Pixel (ID `1392514952248366`).
