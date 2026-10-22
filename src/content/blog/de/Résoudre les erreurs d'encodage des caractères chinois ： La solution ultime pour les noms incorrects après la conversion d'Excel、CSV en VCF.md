---
title: "Zeichensatz-Fehler beheben: Namen nach Excel/CSV zu VCF"
description: "Namen nach Excel/CSV zu VCF unlesbar? So beheben Sie Zeichensatz-Fehler und importieren UTF-8 korrekt in iCloud, Google Kontakte und Outlook."
pubDate: 2025-12-01
author: "Excel2VCF Team"
tags: ["Zeichensatz-Fehler", "UTF-8", "vCard reparieren", "Fehlerbehebung"]
---

Ihr Adressbuch zeigt statt „Müller“ plötzlich „MÃ¼ller“, und aus einem chinesischen Namen wird eine Kette aus Fragezeichen und Sonderzeichen? Nach der Umwandlung von Excel/CSV in VCF ist das kein Datenverlust, sondern eine **Fehlinterpretation der Bytes**: Die Zeichen sind noch vorhanden, das empfangende Programm liest sie jedoch im falschen Zeichensatz.

Dieser Leitfaden zeigt, wie Zeichensatz-Fehler auf dem Weg von der Tabelle zur vCard entstehen, wie Sie die Ursache in wenigen Minuten eingrenzen und wie Sie eine VCF-Datei aufbauen, deren UTF-8-Kodierung auch auf iPhone, Android und in Outlook ankommt.

## Warum aus Namen plötzlich Kauderwelsch wird

Eine VCF-Datei ist reiner Text. Jedes Zeichen wird als Bytefolge gespeichert, und erst der **Zeichensatz** legt fest, welche Bytefolge welches Zeichen bedeutet. Wird dieselbe Bytefolge mit einer anderen Kodierung gelesen, entsteht das bekannte Muster aus Sonderzeichen. **Beispiel:** „Müller“ erscheint als „MÃ¼ller“, weil die UTF-8-Bytes fälschlich als Windows-1252 interpretiert wurden. Dasselbe passiert bei chinesischen, japanischen und koreanischen Namen – **als Beispiel** wird der chinesische Name 张伟 dann zu `å¼ ä¼Ÿ`. Die Daten sind also nicht verloren, nur falsch interpretiert.

In der Praxis gibt es dafür drei typische Auslöser:

* **Quelldatei nicht in UTF-8:** Speichert Excel die CSV im ANSI-Modus, landen Umlaute und chinesische, japanische oder koreanische Zeichen in der Systemkodepage (Windows-1252, GBK, Shift-JIS). Der Konverter reicht diese Bytes weiter, statt sie umzuwandeln.
* **Fehlendes BOM:** Ohne Byte Order Mark raten manche Programme den Zeichensatz – und raten falsch.
* **Empfangsseite ignoriert die Angabe:** Viele Importeure lesen die VCF einfach in der Standardkodepage des Systems, obwohl die Datei korrekt ist.

Genau hier entscheidet die **VCF-Version**. In **vCard 2.1** wird der Zeichensatz pro Feld über den Parameter `CHARSET` übergeben (etwa `FN;CHARSET=UTF-8:…`); fehlt er, greifen ältere Programme auf die Systemkodepage zurück. In **vCard 3.0** ist UTF-8 der vorgegebene Zeichensatz, viele Werkzeuge schreiben den Parameter aber weiterhin mit – auch Excel2VCF setzt bei VCF 3.0 `CHARSET=UTF-8` an Textfelder wie Name, Organisation oder Notiz. **vCard 4.0** schreibt UTF-8 verbindlich vor und erlaubt `CHARSET` nicht mehr. Ein falsch gesetzter oder fehlender Parameter kann daher selbst eine sauber gespeicherte Datei beim Import kippen.

## Schritt 1: Quelldatei als UTF-8 speichern

Die zuverlässigste Reparatur beginnt vor der Konvertierung. Ziel ist eine Tabelle, die nachweislich UTF-8 enthält:

1.  **Excel:** „Datei“ → „Speichern unter“ und als Dateityp **„CSV UTF-8 (durch Trennzeichen getrennt)“** wählen. Der Eintrag ohne UTF-8 schreibt in der Systemkodepage – dort entsteht der Großteil der Fehler.
2.  **Vorhandene CSV:** In einem Editor öffnen, der die Kodierung anzeigt (Notepad unter Windows, TextEdit unter macOS, Visual Studio Code). Beim Speichern **UTF-8** wählen; verlangt der Empfänger ein BOM, wählen Sie die Variante **UTF-8 mit BOM**.
3.  **Gegenprobe:** Die Datei im Editor prüfen. Stehen Umlaute und asiatische Zeichen dort korrekt, ist die Quelle in Ordnung. Steht schon hier „MÃ¼ller“, hilft keine Einstellung im Konverter – dann muss zuerst die Quelldatei neu gespeichert werden.

Ein Konverter, der Kodierungen wie UTF-8 oder GBK automatisch erkennt, nimmt Ihnen einen Teil der Arbeit ab, ersetzt die Gegenprobe im Editor aber nicht.

## Schritt 2: Konverter und VCF-Version richtig einstellen

1.  **UTF-8 als Ausgabe:** Achten Sie darauf, dass der Konverter die VCF in UTF-8 schreibt. Excel2VCF erzeugt standardmäßig eine UTF-8-kodierte VCF im Format 3.0; eine zusätzliche Einstellung ist dafür nicht nötig.
2.  **Version bewusst wählen:** VCF 3.0 ist für iPhone, Android, Google Kontakte und iCloud der sicherste Kompromiss. Outlook liest 2.1 und 3.0, mit 4.0 kommt es nicht zurecht.
3.  **Nicht doppelt kodieren:** Öffnen Sie die fertige VCF nicht in einem Editor, der beim Speichern ANSI als Standard setzt. Genau so wird aus einer korrekten Datei eine fehlerhafte.

## Schritt 3: Nach dem Import gegenprüfen

Prüfen Sie das Ergebnis dort, wo UTF-8 zuverlässig erkannt wird, und erst danach auf dem Telefon:

* **iCloud und Google Kontakte:** Beide Dienste erkennen UTF-8 automatisch. Importieren Sie die VCF zuerst dort und kontrollieren Sie zwei oder drei Namen mit Umlauten und asiatischen Zeichen. Erst wenn das passt, synchronisieren Sie aufs Gerät.
* **iPhone:** Der Import über iCloud am Computer ist die stabilste Variante; der direkte Import auf dem Gerät scheitert gelegentlich an der Kodierungserkennung.
* **Android:** Die Datei im Dateimanager antippen, „Öffnen mit“ → „Kontakte“. Fragt das System nach der Kodierung, wählen Sie **UTF-8**.
* **Outlook:** Der Sonderfall. Ältere Versionen ignorieren den `CHARSET`-Parameter häufig und lesen die Datei in der Windows-Kodepage; VCF 4.0 wird gar nicht unterstützt. Der zuverlässigste Weg ist der Umweg über Google Kontakte oder iCloud. Bleibt es bei Outlook, hilft oft eine Kopie mit BOM – manche Importeure stolpern allerdings über das BOM, weshalb Sie diese Variante nur gezielt testen sollten.

Ob die Zeichen wirklich sauber angekommen sind, sehen Sie am schnellsten in einer Tabelle: Der [VCF-zu-Excel-Konverter](/de/vCard-to-Excel/) schreibt die reparierte Datei zurück in Excel/CSV, sodass Sie Namen und Sonderzeichen spaltenweise prüfen können.

## Fazit

Zeichensatz-Fehler in VCF-Dateien sind fast immer eine Frage der Kette: Quelldatei, Konverter und Empfänger müssen dieselbe Kodierung erwarten – **UTF-8 von Anfang bis Ende**. Wer die CSV bereits als UTF-8 speichert, beim Konvertieren die passende VCF-Version wählt und das Ergebnis zunächst in iCloud oder Google Kontakte prüft, umgeht den Zeichensalat zuverlässig.

Bleibt ein Name trotzdem falsch, lohnt der Blick in die Datei selbst: Steht in der VCF schon Kauderwelsch, ist die Konvertierung schiefgelaufen; steht dort der richtige Name und nur das Adressbuch zeigt Unsinn, liegt es am Importeur. Wer die Kontakte anschließend aufs Telefon bringen will, findet die passenden Schritte in unserer Anleitung zum [sicheren Import von Excel- und CSV-Kontakten ins Telefon](/de/blog/csv-kontakte-sicher-und-effizient-in-ihr-telefon/).
