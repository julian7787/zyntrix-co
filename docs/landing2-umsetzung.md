# Landingpage 2

**Seit 15.09.2026 die Startseite (`index.html`).** `landing2.html` leitet auf `/` weiter; die alte gebündelte Startseite liegt unter `archiv/index_bundle_20260915.html`. Meta-Pixel, Weiterleitung auf `danke.html` (Lead-Event) und Telegram-Worker sind wie auf der alten Startseite eingebunden (siehe CLAUDE.md). Assets liegen unter `assets/landing2/`.

## Aktuelle Überarbeitung

- Neuer Header und Hero: „Nils. Ihr neuer Mitarbeiter.“ / „Arbeitet rund um die Uhr. Damit Sie es nicht müssen.“
- Großzügige Typografie, runder Nils-Kopf im Header, Teal/Lime und lokale Fonts.
- Ursprüngliches Handy-/Box-Element mit Chat-Beispiel und Pause-Funktion wieder rechts im Hero.
- Kein Cookie-Hinweis (wie bisherige Startseite). Meta-Pixel (PageView + Lead über `danke.html`) wieder eingebunden, Datenschutz-Dialog entsprechend angepasst.
- FAQ steht wieder unmittelbar vor dem Kontaktbereich.
- Check, Formular und Bestätigung teilen eine stabile Rasterfläche. Die Karte verändert ihre Größe beim Schrittwechsel nicht; auch Fehlertexte haben reservierten Platz. Zurück-Buttons stehen in allen Schritten fest unten links (im ersten Schritt deaktiviert).
- Keine vorausgewählten Optionen. Zurück löscht die Auswahl des erneut besuchten Schritts und aller Folgeschritte. „Antworten ändern“ setzt den Check zurück. Bereits eingetragene Kontaktdaten bleiben erhalten.
- Die Branchenauswahl im Check verändert den Hero nicht mehr. Für Kanzleien wird lokal als Datenschutzvariante eingestellt; die zusätzliche Formularfrage zur Verschwiegenheitspflicht wurde entfernt.
- FAQ als exklusives Accordion: maximal eine Antwort geöffnet, inklusive Fallback für Browser ohne native Unterstützung.

## Varianten und Funktionen

Lokale Vorschau: `python3 -m http.server 8000`, danach `http://localhost:8000/` öffnen.

URL-Varianten: `?b=handwerk` (Standard), `?b=gastro`, `?b=immo`, `?b=hausverwaltung`, `?b=kanzlei`. Der neue Nils-Haupttitel bleibt für alle Varianten gleich; Beschreibung, Beispiele und Referenzen passen zur Branche. Unbekannte Parameter fallen auf Handwerk zurück.

Der ROI-Rechner berechnet Wochenstunden × Stundensatz × 52 / 12 als Arbeitswert, ausdrücklich keine garantierte Ersparnis. Datenschutzvarianten, vorhandene Kundenstimmen, Eigentumsargument und acht FAQ bleiben erhalten.

## Anfrage

Vier Klicks, danach Name, Firma, E-Mail und Telefonnummer (Pflichtfeld). Mobile: Name/Firma nebeneinander, E-Mail und Telefon volle Breite. Alle Texte siezen die Kunden. Pflichtfelder, Honeypot, Telefonnummer-Normalisierung, Schutz gegen paralleles Absenden und Fehler-/Erfolgsmeldungen sind eingebaut. Vorwahl-Dropdown wie auf `index.html` (AT +43, DE +49, CH +41, IT +39, Andere); `vorwahl` wird in `telefon` zusammengeführt und vor dem Senden entfernt. Bei „Andere“ ist die Nummer mit + einzugeben.

Web3Forms stellt die Anfrage per E-Mail zu. Erst nach bestätigtem Erfolg wird sie zusätzlich an das vorhandene Telegram-Relay geschickt, ohne Web3Forms-Zugangsschlüssel. Rechnerwerte, Check-Antworten und Datenschutzvariante sind enthalten. Nach Erfolg Weiterleitung auf `danke.html`; die Bestätigung auf der Seite dient nur als Rückfall. Zyntrix kontaktiert den Lead persönlich; kein Kalender oder automatischer Terminversand.

## Offene Originalinhalte

- Originalvideos, Produkt-/Teamfotos und vollständige freigegebene Betreiber-/Datenschutzangaben sind weiterhin nicht im Projekt verfügbar.
- Kein verbindlicher Preis ergänzt: Der Plan nennt unterschiedliche Beträge und eine offene Entscheidung zur Veröffentlichung. Förderung wird ohne schriftliche Bestätigung nicht beworben.
- Bestehende Referenzen übernommen; keine neuen Zahlen, Sterne oder WKO-Abzeichen ergänzt.
- Kein CAPI-Backend oder Lead-Sheet eingerichtet. Der bestehende Worker bleibt unverändert.

## Prüfung

Lokale Chrome-Tests mit abgefangenen externen Requests: responsive Darstellung von 320 bis 1440 px, alle fünf Branchen, feste Kartenhöhe über alle Schritte, Zurücksetzen der Antworten, Erhalt der Kontaktdaten, Entfernung der Zusatzfrage und des Trackings, FAQ-Accordion, Formularfehler/erneuter Versuch/Erfolg, Telefonnummer und Telegram-Payload. Keine echten Testanfragen verschickt.
