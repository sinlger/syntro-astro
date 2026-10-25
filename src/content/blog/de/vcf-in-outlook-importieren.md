---
title: "VCF-Kontakte in Outlook importieren: alle Versionen"
description: "Klassisches Outlook, neues Outlook, Web und Mac importieren VCF unterschiedlich. Welche Route trägt – und warum VCF zu CSV für alle vier zuverlässig ist."
pubDate: 2026-10-25
topic: "import-vcf-outlook"
author: "Excel2VCF Team"
tags: ["VCF", "Outlook", "Import", "CSV"]
---

Sie haben Ihr Telefonbuch als `kontakte.vcf` exportiert. Ein Doppelklick im klassischen Outlook liefert genau eine Kontaktkarte, die übrigen vierhundert verschwinden stillschweigend; auf einem Rechner mit dem neuen Outlook nimmt kein Menü die `.vcf` an.

Beides ist kein Defekt: „Outlook“ sind vier Programme mit vier Importeuren, und nur ein Teil versteht vCard. Die Version entscheidet den Weg.

## Welche Outlook-Version haben Sie?

- **Outlook classic (Windows)** – das Desktop-Programm aus Microsoft 365 Apps oder Office 2016–2021. Sein Menü *Datei* enthält *Öffnen und exportieren → Importieren/Exportieren*, und dieser Eintrag ist das Erkennungszeichen: Nur dieser Client bringt den vollständigen Import-Assistenten mit.
- **Neues Outlook (Windows)** – auf Windows 11 vorinstalliert, auch über *Neues Outlook testen* im klassischen Client erreichbar. Vereinfachtes Menüband, kein Importieren/Exportieren für Kontakte.
- **Outlook im Web** – outlook.com oder outlook.office.com, mit dem Symbol *Personen* in der linken Leiste; der Kontaktimport liegt unter *Einstellungen → Kontakte verwalten*.
- **Outlook für Mac** – nur unter macOS, mit *Datei → Importieren* in der Menüleiste.

Ein Blick ins Menü *Datei* genügt: Import-Assistent heißt classic, wo eine `.vcf` direkt importierbar ist; fehlt der Kontaktimport ganz, sind Sie im neuen Outlook oder Web, wo CSV das Format ist.

## VCF in Outlook classic importieren

1. *Datei → Öffnen und exportieren → Importieren/Exportieren*.
2. *Aus einem anderen Programm oder einer anderen Datei importieren* → *Weiter*.
3. *vCard-Datei (.vcf)* auswählen → *Weiter*.
4. Datei auswählen; unter *Optionen* die Duplikatbehandlung festlegen – meist *Duplikate zulassen* oder *Duplikate ersetzen* – dann *Weiter*.
5. *Fertig stellen*. Die Kontakte landen in *Personen*, in der Regel in einem Ordner namens *Importiert*.

Für eine Ein-Karten-Datei ist das zuverlässig. Ein Handy-Export packt jedoch meist hunderte Karten in eine `.vcf`, und in vielen Builds liest der Assistent die erste Karte, importiert sie und hört auf: keine Fehlermeldung, die übrigen Kontakte erscheinen einfach nie. Andere Builds verarbeiten die ganze Datei. Weil das Verhalten je nach Version und Update-Kanal schwankt, ist „ein Kontakt von 400“ ein bekanntes Ergebnis, kein Defekt.

Zwei Auswege. Erstens aufteilen: pro Datei ein Block `BEGIN:VCARD … END:VCARD`, gespeichert mit der Endung `.vcf` – mechanisch, weshalb viele in Zwanzigerpaketen importieren. Zweitens den Assistenten umgehen und einen Konverter eine CSV schreiben lassen, die jeder Outlook-Client akzeptiert.

## Neues Outlook und Outlook im Web: besser CSV

Das neue Outlook für Windows und der Web-Client haben keinen vCard-Import; ihr Kontaktimport nimmt eine CSV über *Personen → Kontakte verwalten → Kontakte importieren*. Dieselbe Datei erreicht das klassische Outlook über *Importieren/Exportieren → Durch Trennzeichen getrennte Werte (CSV)*.

Also zuerst konvertieren. Der [VCF zu Excel-Konverter](/de/vCard-to-Excel/) erledigt das in vier Schritten:

1. **Dateien hinzufügen.** Eine `.vcf` oder zwanzig gemeinsam auswählen oder auf die Ablagefläche ziehen.
2. **Vorschau prüfen.** Aus jeder Karte wird eine Zeile: `FN`, `TELs`, `EMAILs`, `ORG`, `TITLE`, `ADRs`, dazu optionale Spalten wie `N_First` und `N_Last`.
3. **Exportieren.** XLSX für eine Arbeitsmappe oder CSV für Outlook – als UTF-8 mit Byte-Order-Mark und CRLF-Zeilenenden.
4. **Importieren.** *Personen → Kontakte verwalten → Kontakte importieren*, CSV wählen, Zuordnung bestätigen, importieren.

Ein Detail: Die Spaltenköpfe heißen wie vCard-Felder, nicht wie Outlook-Beschriftungen. Das ist normal. Der Zuordnungsdialog macht aus `FN` den *Namen*, aus `EMAILs` die *E-Mail-Adresse* und aus `ORG` die *Firma* – prüfen Sie diese drei, dann geht keine Spalte verloren. Alles läuft im Browser: JavaScript liest die Dateien lokal, nichts wird hochgeladen, ein Konto ist nicht nötig.

## Import in Outlook für Mac

Outlook für Mac hat einen direkten vCard-Import behalten, und der Weg ist kürzer: *Datei → Importieren → Kontakte aus einer vCard-Datei*, dann die `.vcf` auswählen. Mac-Builds kommen mit Mehrkarten-Dateien meist besser zurecht als der klassische Windows-Assistent, sehr große Exporte brauchen trotzdem Zeit – eine Datei, die am PC nur einen Kontakt liefert, kann auf dem Mac vollständig ankommen.

Stockt der Import, bleibt die CSV-Route: Die Datei aus dem Konverter lässt sich im Web-Client importieren, der dieselbe Kontaktliste zeigt.

## Typische Probleme

**Nur ein Kontakt ist angekommen.** Das Ein-Karten-Verhalten von oben, keine defekte Datei. VCF aufteilen oder in CSV umwandeln.

**Alles ist doppelt.** Über Duplikate entscheidet man beim Import, und die Voreinstellung ist oft *Duplikate zulassen*. Zweimal dieselbe CSV importiert heißt doppelte Liste; räumen Sie die Tabelle vorher auf oder führen Sie Exporte mit dem [Zusammenführen von VCF-Dateien](/de/blog/vcf-dateien-zusammenfuehren/) zusammen.

**Firma, Position oder Notizen bleiben leer.** Fast immer eine Lücke in der Zuordnung. Prüfen Sie, ob die Spalte existiert, und ordnen Sie sie ausdrücklich zu – Outlook errät `ORG` nicht als *Firma*.

**Umlaute oder chinesische Namen werden zu Sonderzeichen.** Die CSV muss UTF-8 sein; der Konverter setzt ein Byte-Order-Mark. Speichern Sie die Datei in Excel als reines *CSV (durch Trennzeichen getrennt)*, schreibt ein deutsches Windows ANSI und zerstört die Zeichen. Importieren Sie die Datei aus dem Konverter oder speichern Sie als *CSV UTF-8*.

**Eine Spalte statt vieler.** Wo das Listentrennzeichen das Semikolon ist, kann eine Semikolon-CSV als eine einzige Spalte ankommen, weil Outlooks Importeur Kommas erwartet. Exportieren Sie erneut aus dem Konverter, statt lokal umzuspeichern.

## FAQ

### Kann ich eine VCF mit mehreren Kontakten auf einmal importieren?

Das hängt vom Client ab. Classic importiert unter Umständen nur die erste Karte, das neue Outlook und der Web-Client können VCF gar nicht importieren, und die Mac-Version nimmt meist die ganze Datei. CSV nimmt die Frage aus dem Spiel, weil jeder Client CSV importiert und jeder Kontakt schon eine Zeile ist.

### Werden meine Kontakte auf einen Server hochgeladen?

Nein. Die Umwandlung läuft in Ihrem Browser: JavaScript liest die Dateien auf Ihrem Rechner und gibt das Ergebnis als Download zurück. Nichts wird übertragen, kein Konto ist nötig, und die Seite funktioniert auch offline.

### Kann ich Kontakte später wieder als VCF exportieren?

Im klassischen Outlook lässt sich ein Kontakt als `.vcf` speichern, meist eine Datei pro Kontakt; neues Outlook und Web exportieren CSV. Für den umgekehrten Weg wandeln Sie die Tabelle mit dem [Excel zu vCard-Konverter](/de/Excel-to-vCard/) zurück.

### Warum ist CSV für Outlook zuverlässiger als VCF?

Weil es das einzige Format ist, das alle vier Clients akzeptieren: eine Datei enthält das ganze Adressbuch, die Spalten sind ausdrücklich benannt, die Kodierung steuert das BOM, und kein Aufteilungsschritt ist nötig. Der Preis ist klein, aber real – Fotos und Typangaben pro Nummer gehen in einer Tabelle verloren, während eine vCard sie mitführt.

## Fazit

Auf die Frage „wie importiere ich eine VCF in Outlook“ gibt es keine einzige Antwort, nur eine versionsabhängige: Classic hat einen Assistenten, der nach der ersten Karte aufhören kann, neues Outlook und Web wollen CSV, und die Mac-Version importiert vCard direkt. Einmal in CSV umwandeln erledigt alle vier Fälle, und der Konverter oben ist der kürzeste Weg dorthin – lokal, mehrfachdateifähig und so kodiert, dass Umlaute und chinesische Namen erhalten bleiben.
