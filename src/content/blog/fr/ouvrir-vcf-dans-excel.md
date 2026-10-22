---
title: "Ouvrir un fichier VCF dans Excel : 3 méthodes"
description: "Un VCF ouvert dans Excel n'affiche qu'une colonne de texte. Trois méthodes pour obtenir un vrai tableau, dont une conversion locale, sans envoi."
pubDate: 2026-10-22
topic: "open-vcf-in-excel"
author: "Équipe Excel2VCF"
tags: ["VCF", "Excel", "Tutoriel", "Import"]
---

Vous avez exporté vos contacts, le fichier s'appelle `contacts.vcf`, et le double-clic dans Excel ne donne rien : sous Windows, le fichier part dans l'application Contacts, et si vous forcez *Ouvrir avec → Excel*, vous obtenez une seule colonne de lignes `BEGIN:VCARD`, `VERSION:3.0` ou `TEL;TYPE=CELL:+33…`, sans en-tête ni colonnes.

Ce n'est pas un export cassé, c'est le fichier tel qu'il a été écrit. Excel ne sait pas importer un VCF : le tableau doit donc exister avant qu'Excel l'ouvre. Voici trois méthodes, et ce que chacune vaut.

## Pourquoi Excel ne peut pas ouvrir un fichier VCF directement

VCF est l'extension du standard vCard : du texte brut, un contact par bloc qui commence par `BEGIN:VCARD` et se termine par `END:VCARD`. Le bloc contient des champs comme `FN` (nom affiché), `N`, `TEL`, `EMAIL`, `ADR`, `ORG` ou `NOTE`, parfois avec des paramètres du type `TYPE=CELL` ou `PREF`.

Or une fiche n'est pas une ligne : un contact peut contenir trois numéros et deux e-mails, le suivant seulement un nom et un mobile. Excel importe du CSV ou du TSV parce que la virgule ou la tabulation marque chaque limite de cellule ; dans un VCF, il n'y a rien à découper, d'où la colonne A unique.

Les versions compliquent tout : vCard 3.0 (Android, Outlook) et 4.0 replient les valeurs longues sur plusieurs lignes avec un espace en tête et peuvent intégrer des photos en base64.

## Méthode 1 : convertir le VCF en Excel (recommandé)

Laissez un convertisseur lire les fiches et produire un classeur où chaque contact occupe une ligne. Le [convertisseur VCF vers Excel](/fr/vCard-to-Excel/) de ce site le fait entièrement dans votre navigateur.

1. **Ouvrez le convertisseur.** Le sens est déjà réglé sur VCF → Excel.
2. **Ajoutez les fichiers.** Glissez un ou plusieurs `.vcf` dans la zone de dépôt, ou cliquez sur *Choisir un fichier* pour les sélectionner ensemble. Votre navigateur les lit en local : rien n'est envoyé, aucun compte n'est requis.
3. **Vérifiez l'aperçu.** Les contacts s'affichent en tableau avant tout téléchargement. Activez ou désactivez des champs — nom, téléphones, e-mails, société, adresses, notes — et ajoutez des colonnes prénom et nom.
4. **Téléchargez et ouvrez.** Choisissez *Excel* (`.xlsx`) ou *CSV*. Le classeur s'ouvre comme une feuille avec en-têtes ; le CSV contient un BOM UTF-8 pour préserver les accents.

Le parseur traite les vCard 2.1, 3.0 et 4.0 : exports d'iPhone, d'Android, d'Outlook, de Google Contacts et de la plupart des CRM. Plusieurs fichiers peuvent être sélectionnés ensemble : leurs contacts sont réunis dans un seul aperçu et un seul classeur. Les valeurs imbriquées sont aplaties : mobile, fixe et fax d'un même contact tiennent dans une seule cellule.

Dans Excel, la liste devient exploitable : trier par société, filtrer par pays, supprimer les doublons. Le [guide complet de VCF vers Excel](/fr/blog/le-guide-complet-de-vcf-vers-excel--comment-organiser-vos-fichiers-de-contacts-dans-un-tableau-clair/) montre comment trier, dédoublonner et archiver le tableau obtenu.

## Méthode 2 : importer le VCF dans Outlook / Google Contacts d'abord

L'autre option est d'importer le VCF dans un carnet d'adresses. Dans Outlook pour Windows, *Fichier → Ouvrir et exporter → Importer/Exporter* propose *Importer depuis un autre programme ou fichier*, puis *Fichier vCard (.vcf)*. Dans Google Contacts, ouvrez contacts.google.com et cliquez sur *Importer*. Sur Mac : iCloud.com → Contacts → *Importer une vCard*, ou l'application Contacts via *Fichier → Importer*.

Cette voie règle un autre problème : elle place vos contacts là où vous les appelez, pas là où vous les inspectez ligne par ligne. Pour un tableau, il faut réexporter — Google en *Google CSV*, Outlook en CSV via sa boîte de correspondance ; iCloud n'exporte qu'en vCard. Pour voir les contacts dans Excel, la méthode 1 reste une étape au lieu de trois.

## Méthode 3 : ouvrir le VCF en texte brut

Parfois vous voulez seulement regarder : clic droit, *Ouvrir avec*, puis Notepad, VS Code ou TextEdit. Vous voyez la structure réelle — `BEGIN:VCARD`, `VERSION`, `FN`, `N`, `TEL`, `EMAIL` — jusqu'au `END:VCARD` final.

Utile pour vérifier qu'un fichier contient bien des contacts ou quels champs l'export a gardés. À l'échelle de centaines de contacts, c'est inutilisable : des milliers de lignes, des valeurs repliées, des photos base64, aucun tri possible. Ne réenregistrez jamais depuis un éditeur en ANSI : les accents et les noms chinois seraient détruits.

## FAQ

### Pourquoi le VCF entier arrive-t-il dans une seule colonne ?

Il n'y a aucun séparateur. Un VCF sépare les fiches par `BEGIN:VCARD`/`END:VCARD` et les champs par des retours à la ligne : un import texte met chaque ligne dans une seule cellule. Les colonnes n'apparaissent qu'après passage dans un parseur vCard.

### Les accents ou les noms chinois sont illisibles après conversion. Que faire ?

Vérifiez le format téléchargé. Un `.xlsx` porte lui-même l'Unicode ; un CSV a besoin du BOM, que le convertisseur ajoute. Si le CSV a été réenregistré en ANSI, exportez-le à nouveau ou ouvrez-le via *Données → À partir d'un fichier texte/CSV* en UTF-8.

### Peut-on convertir plusieurs fichiers VCF d'un coup ?

Oui. Sélectionnez plusieurs `.vcf` en une fois : les contacts sont lus ensemble et réunis dans un seul aperçu, exporté en un classeur unique.

### Peut-on renvoyer le tableau sur le téléphone ?

Oui, et c'est la raison de garder la feuille. Modifiez les données dans Excel, enregistrez en `.xlsx` ou `.csv`, reconvertissez en VCF avec le convertisseur Excel vers VCF, puis importez sur le téléphone.

## Conclusion

Excel ne peut pas ouvrir un VCF parce qu'un VCF n'est pas un tableau : il faut un parseur vCard pour en faire des colonnes. La conversion donne une vraie feuille en une étape, l'import dans un carnet d'adresses donne des contacts à appeler, et l'éditeur de texte ne sert qu'à jeter un œil. Commencez par le convertisseur VCF vers Excel cité plus haut : il travaille en local, vos données ne quittent pas votre ordinateur.
