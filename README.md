# Zyntrix Website

Marketing-Website für **Zyntrix** – live unter [zyntrix.co](https://zyntrix.co), gehostet auf GitHub Pages.
Rein statisch: kein Build, keine Abhängigkeiten. Push auf `main` = Deployment.

## Projektstruktur

```
zyntrix-co/
├── index.html              Startseite (gebündelter Claude-Design-Export)
├── danke.html              Danke-Seite nach Formularversand
├── leistungen.html         ┐
├── team.html               ├ Legacy-Seiten („Zyntrix v3“-Design)
├── use-cases.html          ┘
│
├── favicon.ico             ┐
├── apple-touch-icon.png    ├ Müssen im Root liegen (Browser/iOS rufen sie dort direkt ab)
├── site.webmanifest        │
├── CNAME                   ┘ Domain-Konfiguration für GitHub Pages
│
├── assets/
│   ├── icons/              Favicons in allen Größen
│   ├── img/                Logo, Nils-Avatar
│   │   └── kunden/         Kundenlogos (aktuell nicht eingebunden)
│   └── legacy/             style.css + script.js der Legacy-Seiten
│
├── docs/                   Anleitungen & Dokumente (PDF)
├── archiv/                 Alte Versionen, nicht verlinkt
└── telegram-worker/        Cloudflare Worker: Leads → Telegram-Gruppe
```

> Hinweis: Alles im Repo ist öffentlich unter `zyntrix.co/<pfad>` abrufbar – keine vertraulichen Dokumente ablegen.

## Lokale Vorschau

```bash
python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen (root-relative Pfade wie `/favicon.ico` funktionieren nur über einen Server).

## Weiterführend

- Technische Details zu `index.html` und dem Formular-Flow: [CLAUDE.md](CLAUDE.md)
- Telegram-Worker einrichten & deployen: [telegram-worker/README.md](telegram-worker/README.md)
- Schritt-für-Schritt-Anleitung als PDF: [docs/Cloudflare-Worker-Einrichtung.pdf](docs/Cloudflare-Worker-Einrichtung.pdf)
