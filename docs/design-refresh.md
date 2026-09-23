# Design-Abgleich mit der Referenz

Referenz: https://github.com/AARON-Ventures/zyntrix-website
Stand: `0e403f0781e07df73ceaab6b5805c3e5d1e319a4`.

Die aktuelle Referenz-Startseite enthält das Design in einem JSON-kodierten HTML-Template (`__bundler/template`). Die separate `style.css` im Referenz-Repository gehört zur älteren, dunklen Website. Grundlage dieser Überarbeitung ist deshalb das helle Design des eingebetteten Startseiten-Templates, abgeglichen mit der Zyntrix CI V 1-1-0.

## Übernommene Gestaltung

- Inhaltsbreite bis 1200 px, seitliche Abstände `clamp(20px, 5vw, 56px)`.
- Abschnittsabstände `clamp(64px, 7vw, 112px)` statt 34 px auf Mobilgeräten bzw. 64 px auf Desktop.
- Space Grotesk für Überschriften mit weniger enger Laufweite (-0.03 em); Inter für Fließtext, überwiegend 16–17 px und 1.65-fachem Zeilenabstand.
- Auf Nutzerwunsch wieder die ursprünglichen Hintergrundfarben: weiße und hellgraue Abschnitte, Petrol für Rechner und Kontakt, aufgehelltes Petrol für die Ergebniskarte. Im Rechner stehen Werte wieder in Limette. Die neuen Abstände bleiben erhalten.
- Karten mit feiner Kontur und 10 px Radius; großzügige Abstände vor Kartenrastern und zwischen Formularfeldern.
- Datenschutz-Auswahl wieder mit weißer aktiver Schaltfläche auf hellgrauem Hintergrund; der Header-Kontaktbutton wieder weiß.

## Integration

`index.html`, `danke.html`, `impressum.html`, `datenschutz.html` und `agb.html` verwenden ausschließlich `site.css` für das gemeinsame Design. Die mehrfach kopierten Inline-Styles wurden entfernt. URLs, Seiteninhalte und Formularfunktionen bleiben erhalten. Die Hero-Demo wurde anschließend um mehrere Beispiele erweitert. Archivseiten und ungenutzte Legacy-Dateien sind keine aktiven Designquellen.

Das responsive Layout verwendet einspaltige Inhaltsbereiche bis 800 px und größere, einspaltige Quiz-Antworten bis 600 px. Das Formular behält seine gemeinsame Rasterzelle für Quiz, Kontaktdaten und Bestätigung. Eingabefelder haben mindestens 16 px Schriftgröße; Animationen respektieren reduzierte Bewegung.

## Prüfung

Alle fünf aktiven Seiten wurden in Headless Chrome bei 320, 390, 768, 1024 und 1440 px geprüft: keine horizontalen Überläufe, keine fehlenden Bilder, gemeinsame CSS-Datei geladen. Desktop- und Mobilansichten von Startseite, Danke-Seite und Impressum sowie die Formularansichten wurden visuell kontrolliert.

Funktionsprüfung bei 390 und 1440 px: Rechnerwerte, Datenschutz-Umschalter, FAQ, Demo-Pause, vier Quiz-Schritte, Antworten ändern, Datenschutzdialog und erfolgreicher Formularabschluss mit Weiterleitung. Web3Forms-Antworten wurden simuliert; externe Tracking- und Benachrichtigungsdienste waren blockiert. Zusätzlich wurden alle fünf Branchenvarianten geprüft. Keine JavaScript-Laufzeitfehler. Bei diesem ersten Design-Abgleich blieben Inhalte und Skripte unverändert; die anschließende Erweiterung der Hero-Demo ist unten dokumentiert.


## Erweiterung der Hero-Demo

Inhaltliche Quelle: AARON Zyntrix Client Pitch Deck V 2-1-1, Seiten 2 sowie 13–16. Die Chat-Texte sind kurze illustrative Beispiele, keine echten Kundenkonversationen. Die Demo zeigt branchenspezifisch zuerst das vorhandene Beispiel, danach Bewertungsantworten, Reservierungen, Social Posts, Zahlungserinnerungen, Morgenbriefings, Meeting-Protokolle und interne Wissensabfragen. Doppelte Beispiele werden vermieden. Bei Kanzlei-Aufrufen erscheinen ausschließlich Beispiele mit internem Zugang.

Wechsel alle 12 Sekunden mit Vor-/Zurück-Buttons und Pause. Manuelle Auswahl pausiert die Wiedergabe; bei reduzierter Bewegung startet die Demo pausiert. Fokus, Mauszeiger, unsichtbarer Browser-Tab und Verlassen des sichtbaren Bereichs unterbrechen den Timer. Der Beispielwechsel beeinflusst weder Branche noch Formular- oder Datenschutzdaten. Die Demo zeigt ihre Beispiele sofort vollständig und reserviert eine feste Höhe gegen Layoutsprünge.


## Kompakter Hero und Kontaktbereich

Die Navigationsleiste behält ihre ursprüngliche Höhe (80 px, mobil 72 px). Hero-Abstände und Demo-Fläche wurden verkürzt. Die Beschriftungen „Ihr Alltag. Mit Nils.“ und „Die Box gehört Ihnen / Produktillustration“ sowie der Pause-Button entfallen. Beispiele wechseln ausschließlich über die Vor-/Zurück-Pfeile; die automatische Wiedergabe wurde entfernt.

Die Kontaktkarte richtet sich jetzt nach dem sichtbaren Quiz- oder Formularschritt. Unsichtbare Schritte und leere Fehlermeldungen reservieren keinen Platz mehr; Zusammenfassungen umbrechen platzsparend. Farben, Schriften und Eingabegrößen bleiben erhalten. Die früher beschriebene gemeinsame Höhenreservierung und automatische Demo-Wiedergabe sind damit abgelöst.

Geprüft bei 320, 390, 768, 1024 und 1440 px: fünf Seiten ohne horizontalen Überlauf, sämtliche Demo-Beispiele in allen Branchen ohne abgeschnittene Inhalte. Quiz, Antworten ändern, Datenschutzdialog und Formularabschluss mit simuliertem Versand erfolgreich geprüft.


### Gleichbleibende Kontaktkartenhöhe

Auf Nutzerwunsch bleibt die Kontaktkarte wieder über alle Schritte gleich hoch. Quiz, Kontaktdaten und Bestätigung teilen sich eine Rasterzelle; unsichtbare Panels bleiben höhenwirksam und unsichtbare Fehlertexte reservieren drei Zeilen. Der letzte Screen verzichtet dafür auf den wiederholten Einleitungstext und die Antwort-Tags. „Antworten ändern“ bleibt verfügbar. Die Antwortdaten werden weiterhin mitgesendet. Bei 320, 390, 768, 1024 und 1440 px wurde die unveränderte Kartenhöhe über alle Fragen, fünf Branchen, Kontaktdateneingabe, Zurückgehen und einen simulierten Versandfehler geprüft.

### Hero: Nachricht, Aufgaben und Ergebnis

Die Smartphone-/Dokumentillustration wurde durch eine kombinierte Chat- und Aufgabenansicht ersetzt. Eine Nachricht startet drei nachvollziehbare Arbeitsschritte. Fortschrittsbalken, Bearbeitungsstatus und Häkchen zeigen den Ablauf; anschließend erscheint die Ergebnisantwort. Entwürfe bleiben ausdrücklich zur Prüfung oder Freigabe. Die Darstellung nutzt weiterhin Petrol, Limette, die lokalen Schriften und den Nils-Avatar.

Jedes Beispiel läuft einmal in drei Schritten à 2,2 Sekunden. Pause, Fortsetzen und erneutes Abspielen sind möglich; der Beispielwechsel bleibt manuell. Außerhalb des sichtbaren Bereichs und bei verborgenem Browser-Tab pausiert der Ablauf. Bei reduzierter Bewegung und ohne JavaScript wird direkt das fertige Ergebnis dargestellt. Die fünf Branchen behalten ihre passenden Einstiegsbeispiele; Kanzlei-Beispiele nutzen ausschließlich den internen Zugang. Auf schmalen Tablets bis 900 px stehen Text und Demo untereinander.

Geprüft in Chrome: sämtliche Beispiele aller fünf Branchen bei 320, 390, 768, 850, 940, 1024 und 1440 px ohne horizontalen Überlauf oder JavaScript-Fehler. Pause, Fortsetzen, Wiederholen, Pause außerhalb des sichtbaren Bereichs sowie Wechsel zu reduzierter Bewegung funktionieren. Rechner und vier Quiz-Schritte wurden ebenfalls geprüft; externe Requests waren blockiert.

### Unterschiedliche Hero-Karten

Die Beispiele nutzen jetzt vier eigenständige Darstellungen: Aufgabenliste, Chat ohne Dokumentanhang, Reservierung mit Kalender und Erinnerung sowie Morgenbriefing mit Kennzahlen, Terminen und Priorität. Reiter erlauben die direkte Auswahl einer Darstellung; die Pfeile führen weiterhin durch die einzelnen Beispiele. Chatnachrichten, Kalenderdetails und Briefing-Elemente erscheinen schrittweise mit demselben Pause-/Wiederholungsmechanismus. Inaktive Ansichten sind für Bedienung und Screenreader gesperrt. Die Kanzlei-Variante zeigt nur Aufgaben, internen Chat und Überblick.

Alle Beispiele aller fünf Branchen wurden bei 320, 390, 768, 940, 1024 und 1440 px auf Überläufe und Laufzeitfehler geprüft. Zusätzlich geprüft: direkte Auswahl aller vier Darstellungen, Chat-Ablauf, Pause, Wiederholung und reduzierte Bewegung. Die lokale Vorschau wurde aktualisiert.
