---
title: "Import VCF Contacts into Outlook: Classic, New & Web"
description: "Outlook imports VCF differently in classic, new, web and Mac. Which route still works, and why converting VCF to CSV is the reliable path for all four."
pubDate: 2026-10-25
topic: "import-vcf-outlook"
author: "Excel2VCF Team"
tags: ["VCF", "Outlook", "Import", "CSV"]
---

Your phone exported the address book as `contacts.vcf`. Double-clicking it in Outlook classic gives you one contact card and quietly drops the other four hundred; on a machine running the new Outlook, no menu accepts a `.vcf` at all.

Neither result means a damaged file. "Outlook" now covers four clients with four importers, and only some of them read vCard. The version in front of you decides whether importing is a two-minute wizard or needs a conversion step first.

## Which Outlook version do you have?

- **Outlook classic (Windows)** — the desktop program from Microsoft 365 Apps or Office 2016–2021. Its *File* menu contains *Open & Export → Import/Export*, and that entry is the tell: only this client still ships the full import wizard.
- **New Outlook (Windows)** — preinstalled on Windows 11, also reached through *Try the new Outlook* in classic. Simplified ribbon, no Import/Export for contacts.
- **Outlook on the web** — outlook.com or outlook.office.com, with the *People* icon in the left rail; contact import sits under *Settings → Manage contacts*.
- **Outlook for Mac** — macOS only, with *File → Import* in the Apple menu bar.

Open the *File* menu. An Import/Export wizard means classic, where a `.vcf` is importable; no contact import at all means the new Outlook or the web, where the accepted format is CSV.

## Import a VCF in Outlook classic

1. *File → Open & Export → Import/Export*.
2. Choose *Import from another program or file* → *Next*.
3. Select *vCard File (.vcf)* → *Next*.
4. Pick the file; under *Options* choose duplicate handling — usually *Allow duplicates to be created* or one of the *Replace duplicates* entries — then *Next*.
5. *Finish*. The contacts land in People, generally in a folder called *Imported*.

For a single-card file this works. A phone export usually packs hundreds of cards into one `.vcf`, and in many builds the wizard reads the first card, imports it and stops: no error message, the remaining contacts simply never appear. Other builds take the whole file. Because behaviour varies by version and update channel, treat "one contact out of 400" as a known outcome, not damage.

There are two ways out. Split the file into one `BEGIN:VCARD … END:VCARD` block per `.vcf` in a text editor — mechanical, which is why people end up importing in batches of twenty. Or skip the wizard and let a converter write a CSV, which every Outlook client accepts.

## New Outlook and Outlook on the web: use CSV instead

The new Outlook for Windows and the web client have no vCard import at all; their contact import takes a CSV, reached through *People → Manage contacts → Import contacts*. Classic opens the same file via *Import/Export → Comma Separated Values*.

So convert first. The [VCF to Excel converter](/en/vCard-to-Excel/) does the parsing in four steps:

1. **Add the files.** Select one `.vcf` or twenty together, or drag them onto the drop area.
2. **Check the preview.** Every card becomes a row: `FN`, `TELs`, `EMAILs`, `ORG`, `TITLE`, `ADRs`, plus optional split columns such as `N_First` and `N_Last`.
3. **Export.** XLSX for a workbook, or CSV for Outlook — written as UTF-8 with a byte-order mark and CRLF line endings.
4. **Import.** *People → Manage contacts → Import contacts*, choose the CSV, confirm the mapping, import.

One detail: the exported headers are vCard field names, not Outlook labels. That is normal. The mapping dialog is where `FN` becomes *Name*, `EMAILs` *E-mail Address* and `ORG` *Company* — check those three and no column is lost. Everything runs in the browser: JavaScript reads the files locally, nothing is uploaded, no account is needed.

## Import on Outlook for Mac

The current Microsoft 365 / 2024 Outlook for Mac handles VCF one card at a time: double-click a `.vcf` and it opens in Contacts. When the file holds several cards, the import window shows only the first one, but Outlook saves each card separately, so the contacts do arrive. What it does **not** do is bulk-import a folder of `.vcf` files, and this version does not import CSV either — Microsoft's documentation states that limitation explicitly. Older Outlook 2016/2019 for Mac builds still expose *File → Import → Contacts from a vCard file*, which is a different, older import path.

Because Mac support is limited in both directions, the practical route for a large list is the same as on Windows: convert the VCF to CSV with the converter on this site, then import that CSV into the web client (People → Manage contacts → Import contacts), which belongs to the same Microsoft 365 account.

## Common problems

**Only one contact appeared.** The single-card behaviour above, not a broken file. Split the VCF, or convert to CSV where every card becomes a row.

**Everything is duplicated.** Duplicate handling is decided once, at import, and the default is often *Allow duplicates*. Importing the same CSV twice doubles the list; clean the sheet first, or merge several exports with the [VCF merge step](/en/blog/merge-vcf-files/).

**Company, job title or notes are empty.** Almost always a mapping gap. Confirm the column exists, then map it explicitly — Outlook will not guess that `ORG` means *Company*.

**Accented or Chinese names turn into symbols.** The CSV must be UTF-8; the converter adds a byte-order mark so both Excel and Outlook recognise it. Re-saving in Excel as plain *CSV (Comma delimited)* on a European Windows writes ANSI instead and destroys the characters. Import the converter's file, or re-save as *CSV UTF-8*.

**One column instead of many.** Where the list separator is a semicolon, a semicolon CSV can arrive as a single column, because Outlook's importer expects commas. Export again from the converter rather than re-saving locally.

## FAQ

### Can I import a multi-contact VCF in one go?

Depends on the client. Classic may import only the first card, the new Outlook and the web client cannot import VCF at all, and the Mac version usually takes the whole file. CSV removes the question, because every client imports CSV and every contact is already a row.

### Does the conversion upload my contacts to a server?

No. The converter runs in your browser, reads files with JavaScript on your machine and returns a download. Nothing is transmitted, no account is required, and the page works offline.

### Can I export contacts back to VCF afterwards?

From Outlook classic a contact can be saved as `.vcf`, usually one file per contact; the new Outlook and the web client export CSV. For the reverse in bulk, edit the sheet and turn it into vCards with the [Excel to vCard converter](/en/Excel-to-vCard/).

### Why is CSV more reliable than VCF for Outlook?

It is the only format all four clients accept: one file holds the whole address book, columns are named explicitly, encoding is controlled by the BOM, and no splitting is needed. The trade-off is small but real — photos and per-number type labels flatten in a spreadsheet, while a vCard carries them.

## Conclusion

"How do I import a VCF into Outlook" has no single answer, only a version-dependent one: classic has a wizard that may stop after the first card, the new Outlook and the web client want CSV, and the Mac version imports vCard directly. Converting to CSV once settles all four cases, and the converter above is the shortest way there — local, multi-file, and encoded so that German umlauts and Chinese names survive.
