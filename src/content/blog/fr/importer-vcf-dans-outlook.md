---
title: "Importer des contacts VCF dans Outlook : 3 cas"
description: "Outlook classique, nouveau Outlook, web et Mac n'importent pas les VCF de la même façon. La bonne route, et pourquoi VCF vers CSV reste la plus fiable."
pubDate: 2026-10-25
topic: "import-vcf-outlook"
author: "Équipe Excel2VCF"
tags: ["VCF", "Outlook", "Import", "CSV"]
---

Vous avez exporté votre répertoire en `contacts.vcf`. Dans Outlook classique, le double-clic donne une seule fiche et les quatre cents autres disparaissent sans un mot ; dans le nouveau Outlook, aucun menu n'accepte la `.vcf`.

Le fichier n'est pas abîmé. « Outlook » désigne quatre clients, dont une partie seulement lit le vCard. La version installée décide : assistant de deux minutes, ou conversion préalable.

## Quelle version d'Outlook avez-vous ?

- **Outlook classique (Windows)** – le programme de bureau de Microsoft 365 Apps ou d'Office 2016–2021. Son menu *Fichier* contient *Ouvrir et exporter → Importer/Exporter* : seul ce client embarque l'assistant complet.
- **Nouveau Outlook (Windows)** – préinstallé sur Windows 11, accessible via *Essayer le nouveau Outlook*. Ruban simplifié, aucun Importer/Exporter pour les contacts.
- **Outlook sur le web** – outlook.com ou outlook.office.com, icône *Contacts* à gauche ; l'import se trouve sous *Paramètres → Gérer les contacts*.
- **Outlook pour Mac** – macOS uniquement, *Fichier → Importer* dans la barre de menus.

Le menu *Fichier* tranche : un assistant d'import signifie Outlook classique, où la `.vcf` s'importe directement ; sans import de contacts, vous êtes dans le nouveau Outlook ou sur le web, où seul le CSV passe.

## Importer un VCF dans Outlook classique

1. *Fichier → Ouvrir et exporter → Importer/Exporter*.
2. *Importer à partir d'un autre programme ou fichier* → *Suivant*.
3. *Fichier vCard (.vcf)* → *Suivant*.
4. Choisir le fichier ; sous *Options*, régler le sort des doublons (*Autoriser les doublons*, *Remplacer les doublons*) → *Suivant*.
5. *Terminer*. Les contacts arrivent dans *Contacts*, souvent dans un dossier *Importés*.

Cela vaut pour une fiche unique. Un export de téléphone entasse souvent des centaines de fiches dans un `.vcf` ; dans de nombreuses versions, l'assistant lit la première, l'importe et s'arrête sans erreur. D'autres traitent le fichier entier. Le comportement variant selon la version et le canal de mise à jour, « un contact sur 400 » est un résultat connu, pas un fichier endommagé.

Deux issues : découper en un bloc `BEGIN:VCARD … END:VCARD` par fichier `.vcf` – mécanique, d'où les imports par paquets de vingt – ou contourner l'assistant et laisser un convertisseur produire un CSV que tous les clients acceptent.

## Nouveau Outlook et Outlook sur le web : passez au CSV

Le nouveau Outlook pour Windows et le client web n'ont pas d'import vCard ; le leur prend un CSV, via *Contacts → Gérer les contacts → Importer des contacts*. Outlook classique passe le même fichier par *Importer/Exporter → Valeurs séparées par des virgules (CSV)*.

Le [convertisseur VCF vers Excel](/fr/vCard-to-Excel/) fait donc l'analyse en quatre étapes :

1. **Ajouter les fichiers.** Un `.vcf` ou vingt sélectionnés ensemble, ou déposés sur la zone de dépôt.
2. **Vérifier l'aperçu.** Chaque fiche devient une ligne : `FN`, `TELs`, `EMAILs`, `ORG`, `TITLE`, `ADRs`, avec en option `N_First` et `N_Last`.
3. **Exporter.** XLSX pour un classeur, ou CSV pour Outlook – en UTF-8 avec marque d'ordre des octets et fins CRLF.
4. **Importer.** *Contacts → Gérer les contacts → Importer des contacts*, choisir le CSV, confirmer le mappage, importer.

Un détail : les en-têtes portent les noms vCard, pas les libellés d'Outlook. Dans la boîte de mappage, `FN` devient *Nom*, `EMAILs` *Adresse électronique*, `ORG` *Société* ; vérifiez ces trois correspondances et aucune colonne ne se perd. Tout se passe dans le navigateur : lecture locale en JavaScript, aucun téléversement ni compte.

## Importer dans Outlook pour Mac

La version actuelle d'Outlook pour Mac (Microsoft 365 / 2024) traite les VCF fiche par fiche : un double-clic sur un `.vcf` l'ouvre dans Contacts. Si le fichier contient plusieurs fiches, la fenêtre d'import n'en affiche qu'une, mais Outlook enregistre chaque fiche séparément : les contacts arrivent bien. En revanche, il n'existe **pas** d'import en masse d'un dossier de fichiers `.vcf`, et cette version n'importe pas non plus de CSV — Microsoft le précise explicitement. Les anciennes versions (Outlook 2016/2019 pour Mac) proposent encore *Fichier → Importer → Contacts à partir d'un fichier vCard*, un chemin plus ancien.

Comme la prise en charge Mac est limitée dans les deux sens, la voie pratique pour une longue liste reste la même que sous Windows : convertir le VCF en CSV avec le convertisseur de ce site, puis importer ce CSV dans le client web (Personnes → Gérer les contacts → Importer des contacts), qui fait partie du même compte Microsoft 365.

## Problèmes fréquents

**Un seul contact est arrivé.** Le comportement « une fiche » décrit plus haut, pas un fichier abîmé. Découpez le VCF ou convertissez en CSV.

**Tout est en double.** Les doublons se décident à l'import, la valeur par défaut étant souvent *Autoriser les doublons*. Deux imports du même CSV doublent la liste ; nettoyez la feuille avant, ou fusionnez les exports avec la [fusion de fichiers VCF](/fr/blog/fusionner-fichiers-vcf/).

**La société, le poste ou les notes restent vides.** Presque toujours une lacune de mappage : vérifiez que la colonne existe et mappez-la – Outlook ne devine pas que `ORG` signifie *Société*.

**Les accents ou les noms chinois deviennent des symboles.** Le CSV doit être en UTF-8 ; le convertisseur ajoute une marque d'ordre des octets. Réenregistré dans Excel en *CSV (séparateur : point-virgule)*, un Windows français écrit en ANSI et détruit les caractères. Importez le fichier du convertisseur, ou réenregistrez en *CSV UTF-8*.

**Une seule colonne au lieu de plusieurs.** Là où le séparateur de liste est le point-virgule, un tel CSV arrive en une colonne, car l'importateur d'Outlook attend des virgules. Exportez à nouveau depuis le convertisseur.

## FAQ

### Peut-on importer un VCF contenant plusieurs contacts d'un coup ?

Cela dépend du client. Outlook classique peut n'importer que la première fiche, le nouveau Outlook et le client web ne savent pas importer de VCF, et la version Mac prend généralement le fichier entier. Le CSV supprime la question.

### Mes contacts sont-ils envoyés à un serveur ?

Non. La conversion s'exécute dans votre navigateur : les fichiers sont lus en JavaScript sur votre machine, et le résultat revient en téléchargement. Rien n'est transmis, aucun compte n'est demandé, et la page fonctionne hors ligne.

### Peut-on réexporter les contacts en VCF plus tard ?

Dans Outlook classique, un contact s'enregistre en `.vcf`, souvent un fichier par contact ; le nouveau Outlook et le web exportent du CSV. Pour l'aller-retour en volume, repassez le tableau en vCards avec le [convertisseur Excel vers vCard](/fr/Excel-to-vCard/).

### Pourquoi le CSV est-il plus fiable que le VCF pour Outlook ?

Parce que c'est le seul format que les quatre clients acceptent : un fichier contient tout le répertoire, les colonnes sont nommées, l'encodage est maîtrisé par la marque d'ordre des octets, et aucun découpage n'est nécessaire. Le compromis est réel – photos et type de chaque numéro se perdent, alors qu'une vCard les transporte.

## Conclusion

À la question « comment importer un VCF dans Outlook », la réponse dépend de la version : Outlook classique possède un assistant qui peut s'arrêter après la première fiche, le nouveau Outlook et le web veulent du CSV, et la version Mac importe le vCard directement. Une conversion en CSV règle les quatre cas, et le convertisseur ci-dessus est le plus court chemin – local, multi-fichiers, encodé pour les accents et les noms chinois.
