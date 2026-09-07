# Lead → Telegram-Gruppe

Die Seite läuft auf GitHub Pages und ist damit rein statisch: Ein Bot-Token
darf dort **nicht** im Quelltext stehen, sonst kann jeder mit dem Token in
Ihrem Namen posten, Nachrichten mitlesen oder den Bot aus der Gruppe werfen.

Deshalb geht die Anfrage über einen winzigen Cloudflare Worker (kostenloser
Plan reicht: 100.000 Anfragen/Tag). Der Worker kennt den Token, das Formular
kennt nur die Worker-URL.

```
Formular (GitHub Pages)  ──POST JSON──▶  Cloudflare Worker  ──▶  Telegram-Gruppe
```

## 1. Telegram-Bot anlegen

1. In Telegram **@BotFather** öffnen → `/newbot` → Namen und Usernamen vergeben.
2. BotFather antwortet mit dem Token (`8123456789:AAH…`) — das ist `TELEGRAM_BOT_TOKEN`.
3. Den Bot in die gewünschte Gruppe einladen (bei Gruppen mit Themen zusätzlich
   Adminrechte geben, damit er in ein bestimmtes Topic posten darf).
4. Wichtig, damit der Bot Nachrichten sehen kann: bei BotFather
   `/setprivacy` → Bot wählen → **Disable**. (Nur zum Auslesen der Chat-ID nötig.)

## 2. Chat-ID der Gruppe herausfinden

Irgendeine Nachricht in die Gruppe schreiben, dann im Browser aufrufen:

```
https://api.telegram.org/bot<TOKEN>/getUpdates
```

In der Antwort steht `"chat":{"id":-1001234567890,…}` — diese Zahl **inklusive
Minus** ist `TELEGRAM_CHAT_ID`. Nutzt die Gruppe Themen, steht dort zusätzlich
`message_thread_id` → optional als `TELEGRAM_TOPIC_ID` in `wrangler.toml`.

## 3. Worker deployen

```bash
cd telegram-worker
npx wrangler login
npx wrangler secret put TELEGRAM_BOT_TOKEN   # Token einfügen
npx wrangler secret put TELEGRAM_CHAT_ID     # z. B. -1001234567890
npx wrangler deploy
```

`wrangler deploy` gibt die URL aus, z. B.
`https://zyntrix-lead.ihr-name.workers.dev`.

## 4. URL im Formular eintragen

In `index.html` steht im Komponenten-Skript (`<script type="text/x-dc">`) die
Zeile:

```js
leadEndpoint = 'https://zyntrix-lead.DEIN-SUBDOMAIN.workers.dev';
```

Dort die URL aus Schritt 3 eintragen, committen, pushen — fertig. GitHub Pages
veröffentlicht die Änderung nach ein bis zwei Minuten.

## 5. Testen

Formular auf der Seite ausfüllen und absenden. In der Gruppe sollte sofort eine
Nachricht erscheinen. Kommt nichts an:

```bash
npx wrangler tail          # Live-Logs des Workers
```

* `403 forbidden_origin` → Origin fehlt in `ALLOWED_ORIGINS` (`wrangler.toml`).
* `500 not_configured` → Secrets fehlen.
* `502 telegram_failed` → Token/Chat-ID falsch, oder der Bot ist nicht in der Gruppe.

## Schutz vor Spam

* Der Worker nimmt nur Anfragen von den in `ALLOWED_ORIGINS` gelisteten
  Domains an.
* Das Formular enthält ein unsichtbares Honeypot-Feld (`website`). Ist es
  ausgefüllt, antwortet der Worker mit `200`, verschickt aber nichts.
* Bei Missbrauch lässt sich in Cloudflare zusätzlich eine Rate-Limiting-Regel
  auf die Worker-Route legen (Security → WAF → Rate limiting rules).

## Alternativen

* **Vercel/Netlify Function:** gleicher Code-Aufbau, nur anderes Handler-Format.
* **Zapier/Make + Formspree:** ohne eigenen Code, dafür Abo-Kosten und ein
  Dienst mehr, der die Leaddaten sieht.
* **Token direkt im Frontend:** funktioniert technisch, ist aber öffentlich
  einsehbar — nicht empfohlen.
