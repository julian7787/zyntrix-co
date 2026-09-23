# Zyntrix Website

Marketing-Website für **Zyntrix** – live unter [zyntrix.co](https://zyntrix.co), gehostet auf GitHub Pages.
Rein statisch: kein Build, keine Abhängigkeiten. Push auf `main` = Deployment.

## Projektstruktur

```
zyntrix-co/
├── index.html              Startseite mit Branchenvarianten und Potenzialcheck
├── danke.html              Danke-Seite nach Formularversand
├── impressum.html          Anbieterinformationen
├── datenschutz.html        Datenschutzhinweise
├── agb.html                Allgemeine Geschäftsbedingungen
├── site.css                Gemeinsames Design aller fünf Seiten
├── assets/                 Lokale Fonts, Bilder, Logos und Favicons
├── docs/                   Design-Abgleich und technische Dokumentation
├── archiv/                 Alte, nicht verlinkte Versionen
└── telegram-worker/        Cloudflare Worker für interne Lead-Benachrichtigungen
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

- Design-Referenz und übernommene CSS-Werte: [docs/design-refresh.md](docs/design-refresh.md)
