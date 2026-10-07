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
├── assets/                 css/, fonts/, img/, logo/, referenzen/, team/, icons/, video/
└── telegram-worker/        Cloudflare Worker für interne Lead-Benachrichtigungen
```

> Hinweis: Alte Versionen, Backups und sonstige nicht benötigte Dateien liegen außerhalb des Repos im Nachbarordner `zyntrix-co archiv/`. `telegram-worker/` und die Markdown-Dateien sind per `.vercelignore` vom Deployment ausgenommen. Alles andere ist öffentlich unter `zyntrix.co/<pfad>` abrufbar; das GitHub-Repo selbst ist ebenfalls öffentlich – keine vertraulichen Dokumente ablegen.

## Lokale Vorschau

```bash
python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen (root-relative Pfade wie `/favicon.ico` funktionieren nur über einen Server).

## Weiterführend

- Technische Details zu `index.html` und dem Formular-Flow: [CLAUDE.md](../CLAUDE.md)
- Telegram-Worker einrichten & deployen: [telegram-worker/README.md](../telegram-worker/README.md)

