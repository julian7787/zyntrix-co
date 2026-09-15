# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Überblick

Statische Marketing-Website für **Zyntrix** (Produkt: „Nils“, KI-Mitarbeiter für WhatsApp/Telegram), gehostet auf **GitHub Pages** unter `zyntrix.co` (`CNAME`). Kein Build, kein Package-Manager, keine Tests, kein Linter – Änderungen werden committet und gepusht, GitHub Pages deployt automatisch. Inhalte, Kommentare und Commit-Messages sind auf Deutsch.

Lokale Vorschau (Root-relative Pfade wie `/favicon.ico` brauchen einen Server):

```bash
python3 -m http.server 8000
```

## `index.html` ist ein gebündeltes Export-Artefakt

`index.html` (~2 MB) ist **kein** normales HTML, sondern ein selbstentpackendes Bundle (Claude-Design-/`x-dc`-Export):

- `<script type="__bundler/manifest">` – JSON mit allen Assets (Bilder, Fonts, React-UMD) als Base64, adressiert per UUID.
- `<script type="__bundler/template">` – die eigentliche Seite als **ein einziger JSON-String** (eine Zeile). Asset-Referenzen darin sind UUIDs (`src="072c0b37-…"`).
- Ein Loader-Script entpackt beim `DOMContentLoaded` das Template und ersetzt `document.documentElement`. Deshalb stehen Meta-Pixel und Favicon-Links zusätzlich im äußeren `<head>`, und nach dem Swap werden Favicons per JS neu gesetzt (`?v=3`-Cache-Buster).

Seiteninhalt und Logik liegen im Template: Markup in `<x-dc>…</x-dc>`, Logik in `<script type="text/x-dc">` als `class Component extends DCLogic` (React-artiger State, `data-props` für Editor-Props wie `showTeam`, `chatKanal`). Sektionen per Anker: `#leistungen`, `#branchen`, `#vorlagen`, `#warum`, `#modelle`, `#datenschutz`, `#ablauf`, `#faq`, `#team`, `#anfrage`, `#potenzialcheck` …

**Template bearbeiten:** Kleine Änderungen direkt mit exakt escaptem String (`\"`, `\n`, `</` statt `</`). Für größere Änderungen dekodieren, bearbeiten, re-enkodieren – dieser Roundtrip ist byte-identisch:

```python
import json
lines = open('index.html').read().split('\n')
i = next(n for n, l in enumerate(lines) if l.startswith('"<!DOCTYPE html>'))
tpl = json.loads(lines[i])
# ... tpl bearbeiten ...
lines[i] = json.dumps(tpl, ensure_ascii=False).replace('</', '<\\u002F')
open('index.html', 'w').write('\n'.join(lines))
```

Neue Bilder/Fonts müssten ins Manifest (Base64 + UUID); einfacher ist oft ein root-relativer Pfad auf eine Datei im Repo.

## Kontaktformular-Flow (übergreifend)

Im `Component` des Templates (`submit()`):

1. `notifyTelegram()` – fire-and-forget `POST` (JSON) an `TELEGRAM_ENDPOINT` (Cloudflare Worker). Fehler dort dürfen den Formularerfolg nie beeinflussen; leerer Endpoint = deaktiviert.
2. `POST` an Web3Forms (`WEB3FORMS_ENDPOINT`, `access_key` als Hidden-Field) → E-Mail.
3. Bei Erfolg: `handOffLead()` legt `{eventId, ts}` unter `sessionStorage['zyntrix:lead']` ab, dann Redirect auf `danke.html`.
4. `danke.html` liest/löscht den Token und feuert das Meta-Pixel-`Lead`-Event. Fallback: ist der Token nach 3 s noch da, feuert `index.html` selbst – mit derselben `eventID` zur Deduplizierung. Schlüssel/Logik auf beiden Seiten synchron halten.

Lokal testen: Web3Forms verschickt auch von `localhost` echte E-Mails, und das Pixel-`Lead`-Event feuert ebenfalls (verfälscht Meta-Tracking). Der Worker lehnt `localhost` ab (403 `origin_not_allowed`, nicht in `ALLOWED_ORIGINS`), das Formular funktioniert trotzdem.

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

- `danke.html` – eigenständige Seite im aktuellen Design (Inter/Space Grotesk, `#20434F`/`#D2E245`), `noindex`, verlinkt auf Anker in `index.html`.
- `leistungen.html`, `team.html`, `use-cases.html` + `assets/legacy/style.css` + `assets/legacy/script.js` – **Legacy „Zyntrix v3“-Design**. Sie verlinken auf Anker (`#contact`, `#pricing`, `#process`), die im aktuellen `index.html` nicht mehr existieren; das Formular in `script.js` ist nur ein Fake-Submit.
- `archiv/index_backup_20260810_173150.html` – alte unbündelte Version, nicht live verlinkt.
- `assets/icons/` – Favicon-PNGs (referenziert in allen Seiten, im `index.html`-Template, im Favicon-Reset-JS und in `site.webmanifest`). `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`, `CNAME` bleiben bewusst im Root.
- `assets/img/` – `logo.jpg` (Legacy-Seiten), `nils-avatar.png` (`danke.html`); `assets/img/kunden/` – Kundenlogos, derzeit nirgends eingebunden (im `index.html` sind Bilder als Base64 im Manifest).
- `docs/` – Dokumente/Anleitungen (z. B. Cloudflare-Worker-PDF). Achtung: alles im Repo ist öffentlich unter `zyntrix.co/…` erreichbar.
- HTML-Seiten bleiben im Root, damit ihre öffentlichen URLs stabil bleiben.
- Meta Pixel (ID `1392514952248366`) ist in jeder Seite im `<head>` eingebunden – bei neuen Seiten übernehmen.
