---
title: "VCF-Dateien zusammenführen: 3 Methoden im Vergleich"
description: "Mehrere VCF-Dateien, kein Zusammenführen-Knopf? Kontakte lokal in einer Tabelle bündeln, Duplikate entfernen, eine VCF exportieren – in zwei Schritten."
pubDate: 2026-10-22
topic: "merge-vcf-files"
author: "Excel2VCF Team"
tags: ["VCF", "Zusammenführen", "Excel", "Anleitung"]
---

Ihr altes Handy hat 310 Kontakte exportiert, das neue bringt 240 mit, und das CRM liefert eine dritte Datei. Drei `.vcf`-Dateien, drei überlappende Adressbücher, kein Befehl, der sie offensichtlich zusammenführt. Die Form hilft: Eine VCF ist reiner Text, und jede Karte folgt demselben Muster.

Das Zusammenführen verbirgt zwei Aufgaben: alle Karten in eine Liste bringen und entscheiden, welcher fast identische Eintrag bleibt, wenn dieselbe Person dreimal mit anderer Nummer auftaucht. Wer den zweiten Schritt überspringt, hat danach mehr Durcheinander als vorher.

## Warum das Zusammenführen von VCF-Dateien schwieriger ist, als es aussieht

Eine VCF ist eine Folge von vCard-Blöcken — `BEGIN:VCARD`, Versionszeile, Felder, `END:VCARD` — und nichts umschließt die Datei. Deshalb funktioniert das simple Aneinanderhängen überhaupt.

Eine Karte ist keine Zeile: Ein Kontakt kann drei `TEL`- und zwei `EMAIL`-Zeilen tragen, der nächste nur `FN` und ein Mobil. Version 2.1 kodiert Umlaute als Quoted-Printable, 3.0 bricht lange Zeilen um, 4.0 setzt auf UTF-8 und bettet Fotos als Base64 ein. Zwei Dateien, die im Explorer gleich aussehen, können sich in all dem unterscheiden.

Kopieren und Einfügen im Texteditor ist die naheliegende Idee und der häufigste Weg, eine Datei zu zerstören. ANSI-Kodierung killt Umlaute und chinesische Namen, eine BOM wird mitten in der Datei zu fremden Bytes, ein fehlender Zeilenumbruch klebt `END:VCARD` an das nächste `BEGIN:VCARD`. Kein Fehler beim Zusammenführen; der Schaden zeigt sich auf dem Handy.

## Methode 1 (empfohlen): Über eine Tabelle zusammenführen

Einen einzelnen Knopf zum Zusammenführen gibt es hier nicht. Der Weg besteht aus zwei Schritten — mehrere VCF-Dateien hinein, eine Tabelle, eine bereinigte VCF hinaus — und die Tabelle ist der Kern: Nur dort sind Duplikate sichtbar, bevor Sie sich festlegen.

1. **Alle Dateien auf einmal laden.** Den [VCF-zu-Excel-Konverter](/de/vCard-to-Excel/) öffnen und alle `.vcf` hineinziehen oder gemeinsam auswählen. Jede Datei wird gelesen und an eine Vorschautabelle angehängt: aus 310, 240 und 90 Karten werden 640 Zeilen, Duplikate inklusive.
2. **Vorschau prüfen.** Die Tabelle zeigt Name, Telefonnummern, E-Mails, Firma, Titel, Adressen und Notizen; abschalten, was nicht gebraucht wird, und Vor- und Nachname-Spalten ergänzen, wenn nach Nachnamen sortiert werden soll. Eine Datei ohne Beitrag fällt hier auf — meist falsche Kodierung oder keine echte vCard.
3. **Tabelle bereinigen.** Nach Nachname und Telefonnummer sortieren, dann *Daten → Duplikate entfernen*. Exakte Doppelgänger verschwinden; Fast-Duplikate (`+49 170 555…` gegen `0170 555…`) nicht, also Nummern zuerst vereinheitlichen und den Verlierer von Hand löschen. Wie aus einer VCF überhaupt eine Tabelle wird, erklärt [VCF in Excel öffnen](/de/blog/vcf-in-excel-oeffnen/).
4. **Exportieren, dann zurückwandeln.** Die Tabelle als `.xlsx` herunterladen; die CSV-Option setzt eine UTF-8-BOM. Dann den [Excel-zu-VCF-Konverter](/de/Excel-to-VCard/) öffnen, die Arbeitsmappe hochladen, Name und Telefon zuordnen, vCard 3.0 wählen und erzeugen. Das Ergebnis ist eine VCF mit genau den überlebenden Zeilen; Zeilen ohne Namen oder Telefonnummer werden übersprungen. Für eine CSV gibt es die separate Seite CSV zu vCard.

Beide Werkzeuge laufen im Browser: JavaScript liest die Dateien und schreibt XLSX und VCF lokal. Nichts wird hochgeladen, kein Konto ist nötig — was zählt, wenn Kunden- oder Mitarbeiterdaten in den Dateien stecken.

## Methode 2: Im Adressbuch zusammenführen

Importieren Sie jede Datei in ein Adressbuch und lassen Sie das Adressbuch die Vereinigung halten: auf dem iPhone die `.vcf` öffnen, oder iCloud.com → Kontakte → *vCard importieren*; auf dem Mac *Ablage → Importieren*; in Google Kontakte *Importieren*; in Outlook *Datei → Öffnen und Exportieren*. Danach alles auswählen und exportieren — Apple und Google schreiben die Auswahl meist als eine `.vcf`.

Zwei Einschränkungen. Das Adressbuch gleicht nicht ab: Es entscheidet nicht, ob die alte oder neue Nummer stimmt. Und es ist verlustbehaftet: Google verwirft Felder, die es nicht kennt, verkleinert oder löscht Fotos und exportiert seine eigene Fassung der Karte. Praktisch zum Telefonieren, schwach zum Prüfen.

## Methode 3: Die Textdateien aneinanderhängen

Eine VCF ist eine Folge von Blöcken, also ist das byteweise Aneinanderhängen zulässig:

```bash
cat kontakte-1.vcf kontakte-2.vcf kontakte-3.vcf > zusammen.vcf
```

Unter Windows: `copy /b kontakte-1.vcf+kontakte-2.vcf zusammen.vcf`. PowerShells `Get-Content`/`Set-Content` besser meiden, weil sie neu kodieren und eine BOM setzen können; für zwei kleine Dateien reicht Copy-and-paste.

Das Ergebnis ist gültig, aber nicht zusammengeführt: Alle Duplikate bleiben. Drei Details entscheiden, ob die Datei importiert wird:

- **Zeilenumbruch am Ende.** Endet eine Datei mit `END:VCARD` ohne Zeilenumbruch, klebt das nächste `BEGIN:VCARD` in derselben Zeile, und Parser hören dort auf.
- **BOM.** Eine BOM am Anfang der ersten Datei ist harmlos; mitten in der Datei wird sie zu fremden Bytes. Bei allen folgenden Dateien entfernen.
- **Kodierung.** Quoted-Printable-2.1 und UTF-8-4.0 vertragen sich, aber eine als ANSI gespeicherte Datei erzeugt Mojibake, das kein späterer Schritt repariert.

Für zwei Exporte vom selben Handy in Ordnung; bei zehn Dateien aus verschiedenen Systemen ist eine Tabelle der schnellere Weg.

## So prüfen Sie das Ergebnis und entfernen Duplikate

Sichern Sie zuerst die Originale — die Bereinigung bearbeitet die einzige Kopie der zusammengeführten Daten.

Dann zweimal prüfen. Vergleichen Sie die Zeilenzahl mit den `BEGIN:VCARD`-Vorkommen (`grep -c BEGIN:VCARD *.vcf`); fehlt etwas, wurde eine Datei nicht gelesen. Für den Inhalt nach Nachnamen sortieren, eine Hilfsspalte nur mit Ziffern anlegen und doppelte Nummern per bedingter Formatierung markieren. Prüfen Sie, ob ein Kontakt mit drei Nummern noch alle drei hat, und ob Umlaute und chinesische Namen oben und unten stimmen. *Duplikate entfernen* vergleicht ganze Zeilen; Zeilen, die sich nur im Telefonformat unterscheiden, überleben beide.

## FAQ

### Gehen beim Zusammenführen Felder verloren?

Der Tabellenweg behält die Felder, die der Konverter abbildet — Name, Telefonnummern, E-Mails, Firma, Titel, Adresse, Notizen — und verliert, was die Tabelle nicht mitführt: Fotos, Geburtstage, eigene Labels. Der Adressbuch-Import behält mehr, schreibt die Karte aber neu; das Aneinanderhängen behält alles und bereinigt nichts.

### Kann ich die zusammengeführte VCF wieder aufs Handy importieren?

Ja. Schicken Sie sich die Datei und öffnen Sie sie, oder importieren Sie sie über Google Kontakte, iCloud oder Outlook. vCard 3.0 ist die sicherste Wahl; 4.0 nur auf Verlangen des Zielgeräts. Lehnt ein Handy ab, fehlt meist ein Zeilenumbruch zwischen den Blöcken oder die Kodierung ist gemischt.

### Gibt es eine Grenze für die Zahl der Dateien?

Eine feste Zahl ist nicht eingebaut. Das Lesen passiert im Browser; die Grenze sind Arbeitsspeicher und Tab, kein Serverkontingent. Dateien mit Fotos wachsen schnell; wird der Tab träge, in Stapeln zusammenführen.

### Werden meine Kontaktdaten hochgeladen?

Nein. Der Browser liest die Dateien, baut die Vorschau, schreibt die XLSX und erzeugt die VCF lokal — kein Upload, kein Konto.

## Fazit

VCF-Dateien zusammenzuführen heißt zwei Vorgänge, nicht einen: Karten sammeln, dann abgleichen. Nur eine Tabelle macht beides sichtbar, und der Umweg kostet Minuten für ein prüfbares Ergebnis. Beginnen Sie mit dem VCF-zu-Excel-Konverter oben, laden Sie alle Dateien auf einmal, bereinigen Sie die Tabelle und schreiben Sie erst dann die endgültige VCF.
