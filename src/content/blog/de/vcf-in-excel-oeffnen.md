---
title: "VCF in Excel öffnen: 3 Wege, die funktionieren"
description: "VCF-Dateien zeigen sich in Excel als eine Spalte voller Text. Drei Wege zur echten Tabelle – inklusive lokaler Umwandlung ohne Upload."
pubDate: 2026-10-22
topic: "open-vcf-in-excel"
author: "Excel2VCF Team"
tags: ["VCF", "Excel", "Anleitung", "Import"]
---

Sie haben Ihre Kontakte vom Handy exportiert, die Datei heißt `kontakte.vcf`, und beim Doppelklick passiert in Excel nichts Sinnvolles: Windows übergibt die Datei meist an die Personen-App. Erzwingen Sie den Start über *Öffnen mit → Excel*, sehen Sie eine einzige schmale Spalte mit Zeilen wie `BEGIN:VCARD`, `VERSION:3.0` und `TEL;TYPE=CELL:+49…` – ohne Kopfzeile, ohne Spalten, nichts zu sortieren.

Das ist kein kaputter Export, sondern die Datei, wie sie geschrieben wurde. Excel besitzt keinen VCF-Import, deshalb muss die Tabelle entstehen, bevor Excel die Datei sieht. Hier sind die drei Wege – und wofür jeder taugt.

## Warum Excel VCF-Dateien nicht direkt öffnen kann

VCF ist die Dateiendung des vCard-Standards: reiner Text, ein Kontakt pro Block, der mit `BEGIN:VCARD` beginnt und mit `END:VCARD` endet. Darin stehen Felder wie `FN` (Anzeigename), `N` (Namensbestandteile), `TEL`, `EMAIL`, `ADR`, `ORG` und `NOTE`, teils mit Parametern wie `TYPE=CELL` oder `PREF`.

Eine Karte ist aber keine Zeile. Ein Kontakt kann drei Telefonnummern und zwei Mailadressen enthalten, der nächste nur einen Namen und eine Mobilnummer – die Zahl der Felder wechselt von Block zu Block. Excel importiert CSV oder TSV, weil Komma oder Tabulator jede Zellgrenze markieren; bei einer VCF gibt es nichts zu trennen, deshalb landet beim Textimport alles in Spalte A.

Dazu kommen Eigenheiten der Versionen: vCard 3.0 (typisch für Android und Outlook) und 4.0 brechen lange Werte mit führendem Leerzeichen über mehrere Zeilen um und betten Fotos als Base64-Blöcke ein.

## Methode 1: VCF in Excel umwandeln (empfohlen)

Lassen Sie einen Konverter die vCard-Datensätze auslesen und eine echte Arbeitsmappe schreiben, in der jeder Kontakt eine Zeile belegt. Der [VCF-zu-Excel-Konverter](/de/vCard-to-Excel/) auf dieser Seite macht genau das – vollständig in Ihrem Browser.

1. **Konverter öffnen.** Rufen Sie die Seite VCF zu Excel auf; die Richtung steht bereits auf VCF → Excel.
2. **Dateien hinzufügen.** Ziehen Sie eine oder mehrere `.vcf`-Dateien in den Ablagebereich oder wählen Sie sie zusammen über *Datei auswählen*. Ihr Browser liest sie lokal: Es wird nichts hochgeladen, ein Konto ist nicht nötig.
3. **Vorschau prüfen.** Die Kontakte erscheinen als Tabelle, bevor etwas heruntergeladen wird. Schalten Sie Felder an oder aus – Name, Telefonnummern, E-Mails, Firma, Adressen, Notizen – und ergänzen Sie getrennte Spalten wie Vor- und Nachname.
4. **Herunterladen und öffnen.** Wählen Sie *Excel* für eine `.xlsx`-Datei oder *CSV* für andere Systeme. Die Arbeitsmappe öffnet sich als normales Blatt mit Kopfzeile; die CSV enthält eine UTF-8-BOM, damit Umlaute erhalten bleiben.

Der Parser verarbeitet vCard 2.1, 3.0 und 4.0 und deckt damit Exporte von iPhone, Android, Outlook, Google Kontakte und den meisten CRM-Systemen ab. Mehrere Dateien lassen sich gleichzeitig auswählen: Ihre Kontakte landen in einer Vorschau und einer Arbeitsmappe. Verschachtelte Werte werden flach in eine Zelle geschrieben: Ein Kontakt mit Mobil-, Büro- und Faxnummer zeigt alle drei in der Telefonspalte.

In Excel wird die Liste handhabbar: nach Firma sortieren, nach Land filtern, Duplikate entfernen – die Tabelle ist zugleich ein besseres Backup als eine unlesbare Datei.

## Methode 2: VCF zuerst in Outlook / Google Kontakte importieren

Die Alternative ist der Import in ein Adressbuch statt in eine Tabelle. In Outlook für Windows führt *Datei → Öffnen und Exportieren → Importieren/Exportieren* über *Datei importieren* zur Option *vCard-Datei (.vcf)*; dort die Datei wählen und Felder zuordnen. In Google Kontakte öffnen Sie kontakte.google.com und nutzen links *Importieren*. Auf dem Mac geht iCloud.com → Kontakte → *vCard importieren*, oder die Kontakte-App über *Ablage → Importieren*.

Das löst ein anderes Problem: Die Kontakte landen dort, wo Sie sie anrufen und anschreiben können, nicht dort, wo Sie sie als Zeilen prüfen. Für eine Tabelle müssen Sie erneut exportieren – Google Kontakte als *Google CSV*, Outlook als CSV über den eigenen Zuordnungsdialog; iCloud exportiert nur vCard, liefert also nie eine Tabelle. Wenn es nur darum geht, die Kontakte in Excel zu sehen, ist Methode 1 ein Schritt statt drei.

## Methode 3: Die VCF als reinen Text öffnen

Manchmal wollen Sie nur nachsehen. Rechtsklick, *Öffnen mit*, dann Notepad, Notepad++, VS Code oder TextEdit. Sie sehen die echte Struktur: `BEGIN:VCARD`, `VERSION`, danach `FN`, `N`, `TEL`, `EMAIL` und was der Export sonst mitgegeben hat, bis zum abschließenden `END:VCARD`.

Für wenige Kontakte ist das nützlich: prüfen, ob die Datei Kontakte enthält, welche Felder der Export behalten hat, ob eine Adresse aufgeteilt ist. Bei Hunderten Kontakten scheitert es – tausende Zeilen, umbrochene Werte, Base64-Fotos, und sortieren oder zählen können Sie nichts. Speichern Sie die Datei außerdem nie aus einem Editor mit ANSI-Kodierung: Das zerstört Umlaute und chinesische Namen.

## FAQ

### Warum landet die ganze VCF in einer einzigen Spalte?

Weil kein Trennzeichen existiert. Eine VCF trennt Datensätze mit `BEGIN:VCARD`/`END:VCARD` und Felder mit Zeilenumbrüchen; ein Textimport macht daraus eine Zelle pro Zeile. Spalten entstehen erst, wenn ein vCard-fähiger Parser die Felder zuordnet.

### Nach der Umwandlung sind Umlaute oder chinesische Namen kaputt – was hilft?

Prüfen Sie zuerst das Format: Eine `.xlsx`-Datei trägt Unicode selbst und kann Text nicht verfälschen; eine CSV braucht die BOM, die der Konverter automatisch setzt. Wurde die CSV als ANSI neu gespeichert, exportieren Sie erneut oder öffnen sie über *Daten → Aus Text/CSV* mit UTF-8.

### Kann ich mehrere VCF-Dateien gleichzeitig umwandeln?

Ja. Wählen Sie mehrere `.vcf`-Dateien zusammen aus; die Kontakte werden gemeinsam ausgelesen und erscheinen in einer Vorschau, die als eine Arbeitsmappe exportiert wird.

### Kann ich die Tabelle wieder aufs Handy bringen?

Ja – und das ist der eigentliche Grund, die Tabelle zu behalten. Bearbeiten Sie die Daten in Excel, speichern Sie als `.xlsx` oder `.csv` und wandeln Sie die Datei wieder in eine VCF um; wie das geht, zeigt die Anleitung [Excel zu VCF: Kontakte sicher aufs Handy importieren](/de/blog/csv-kontakte-sicher-und-effizient-in-ihr-telefon/).

## Fazit

Excel kann eine VCF nicht öffnen, weil eine VCF keine Tabelle ist: Erst ein vCard-Parser macht aus den Datensätzen Spalten. Die Umwandlung liefert in einem Schritt ein echtes Arbeitsblatt, der Import ins Adressbuch bringt Kontakte zum Telefonieren statt Zeilen zum Auswerten, und der Texteditor taugt nur für einen kurzen Blick. Beginnen Sie mit dem oben verlinkten VCF-zu-Excel-Konverter – er arbeitet lokal in Ihrem Browser, Ihre Kontaktdaten verlassen den Rechner nicht.
