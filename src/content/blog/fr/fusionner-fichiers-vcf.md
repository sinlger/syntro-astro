---
title: "Fusionner plusieurs fichiers VCF : 3 méthodes"
description: "Plusieurs fichiers VCF, aucun bouton « fusionner » ? Réunissez les contacts dans un tableau local, dédoublonnez, puis exportez un seul VCF en deux étapes."
pubDate: 2026-10-22
topic: "merge-vcf-files"
author: "Équipe Excel2VCF"
tags: ["VCF", "Fusion", "Excel", "Tutoriel"]
---

Votre ancien téléphone a exporté 310 contacts, le nouveau en apporte 240, le CRM un troisième fichier. Trois `.vcf`, trois carnets qui se chevauchent, aucune commande évidente pour les réunir : un VCF est pourtant du texte brut, aux fiches toutes bâties pareil.

Fusionner cache deux tâches : réunir les fiches dans une liste, puis décider quelle entrée quasi identique garder quand la même personne apparaît trois fois avec un numéro différent. Sauter la seconde laisse plus de désordre qu'avant.

## Pourquoi fusionner des fichiers VCF est plus difficile qu'il n'y paraît

Un VCF est une suite de blocs vCard — `BEGIN:VCARD`, version, champs, `END:VCARD` — et rien n'englobe le fichier, d'où la concaténation possible.

Une fiche n'est pas une ligne : un contact peut porter trois `TEL` et deux `EMAIL`, le suivant `FN` et un mobile. La 2.1 code les accents en quoted-printable, la 3.0 replie les lignes longues, la 4.0 suppose l'UTF-8 et intègre parfois une photo en base64.

Copier-coller dans un éditeur casse souvent le fichier : un enregistrement ANSI détruit les accents et les noms chinois, un BOM au milieu devient des octets parasites, un saut de ligne manquant colle `END:VCARD` au `BEGIN:VCARD` suivant. Aucune erreur pendant la fusion ; les dégâts apparaissent sur le téléphone.

## Méthode 1 (recommandée) : fusionner via un tableur

Pas de bouton « fusionner » ici. Le chemin se fait en deux étapes — plusieurs VCF en entrée, un tableau, un VCF nettoyé en sortie — et le tableau est l'étape clé : il rend les doublons visibles.

1. **Charger tous les fichiers.** Ouvrez le [convertisseur VCF vers Excel](/fr/vCard-to-Excel/), glissez tous les `.vcf` dans la zone de dépôt ou sélectionnez-les ensemble. Chaque fichier est lu et ajouté à un seul tableau : 310, 240 et 90 fiches donnent 640 lignes, doublons compris.
2. **Vérifier l'aperçu.** Nom, téléphones, e-mails, société, fonction, adresses et notes s'affichent ; désactivez l'inutile et ajoutez des colonnes prénom/nom. Un fichier qui n'a rien apporté se repère ici — mauvais encodage ou fausse extension.
3. **Nettoyer.** Triez par nom puis par téléphone, puis *Données → Supprimer les doublons*. Les doublons exacts partent ; les quasi-doublons (`+33 6 12 34 56 78` contre `06 12 34 56 78`) restent, donc normalisez les numéros et tranchez à la main. [Ouvrir un VCF dans Excel](/fr/blog/ouvrir-vcf-dans-excel/) montre comment le tableau se construit.
4. **Exporter, puis reconvertir.** Téléchargez le tableau en `.xlsx` (l'option CSV ajoute un BOM UTF-8). Ouvrez le [convertisseur Excel vers VCF](/fr/Excel-to-vCard/), chargez le classeur, associez nom et téléphone, choisissez vCard 3.0 et générez : un seul VCF avec les seules lignes valides, celles sans nom ou téléphone étant ignorées. Pour un CSV, la page CSV vers vCard s'en charge.

Les deux outils travaillent dans le navigateur : JavaScript lit les fichiers et écrit le XLSX et le VCF en local. Rien n'est envoyé, aucun compte requis — ce qui compte avec des données clients.

## Méthode 2 : fusionner dans un carnet d'adresses

L'autre voie se passe de tableur. Importez chaque fichier dans un carnet : sur iPhone, ouvrez le `.vcf` et ajoutez tous les contacts, ou iCloud.com → Contacts → *Importer une vCard* ; sur Mac, *Fichier → Importer* ; dans Google Contacts, *Importer* ; dans Outlook, *Fichier → Ouvrir et exporter*. Puis sélectionnez tout et exportez : Apple et Google écrivent généralement la sélection dans un seul `.vcf`.

Deux limites. Le carnet ne réconcilie pas : il ne tranche pas entre l'ancien et le nouveau numéro. Et il est réducteur : Google écarte les champs qu'il ne modélise pas, redimensionne les photos, puis exporte sa propre version de la fiche.

## Méthode 3 : concaténer les fichiers texte

Un VCF est une suite de blocs, donc la concaténation octet par octet est légale :

```bash
cat contacts-1.vcf contacts-2.vcf contacts-3.vcf > fusion.vcf
```

Sous Windows : `copy /b contacts-1.vcf+contacts-2.vcf fusion.vcf`. Évitez `Get-Content`/`Set-Content` de PowerShell, qui peuvent réencoder et ajouter un BOM ; un copier-coller suffit pour deux fichiers.

Le résultat est valide mais pas fusionné : tous les doublons restent. Trois détails décident de l'import :

- **Saut de ligne final.** Un fichier finissant par `END:VCARD` sans saut de ligne colle le `BEGIN:VCARD` suivant sur la même ligne, et les parseurs s'arrêtent là.
- **BOM.** Inoffensif en tête du premier fichier, il devient des octets parasites au milieu : à retirer des fichiers suivants.
- **Encodage.** Quoted-printable 2.1 et UTF-8 4.0 cohabitent, mais un enregistrement ANSI produit un mojibake irréparable.

Correct pour deux exports, pas pour dix fichiers hétérogènes.

## Comment vérifier la fusion et supprimer les doublons

Copiez d'abord les originaux ailleurs : le nettoyage modifie la seule copie des données fusionnées.

Vérifiez à deux niveaux. Comparez le nombre de lignes aux occurrences de `BEGIN:VCARD` (`grep -c BEGIN:VCARD *.vcf`) ; un écart signale un fichier non lu. Pour le contenu, triez par nom et surlignez les numéros répétés après avoir isolé les chiffres. Vérifiez qu'un contact à trois numéros les a toujours, et que les accents et les noms chinois sont corrects aux deux extrémités. *Supprimer les doublons* compare des lignes entières : deux lignes qui ne diffèrent que par le format du téléphone survivent.

## FAQ

### La fusion fait-elle perdre des champs ?

Le tableur garde les champs que le convertisseur associe — nom, téléphones, e-mails, société, fonction, adresse, notes — et perd photos, anniversaires et libellés, absents du tableau. Le carnet garde davantage mais réécrit la fiche ; la concaténation garde tout, sans nettoyage.

### Peut-on réimporter le VCF fusionné sur son téléphone ?

Oui. Ouvrez-le depuis un e-mail, ou importez-le via Google Contacts, iCloud ou Outlook. vCard 3.0 est le plus sûr ; 4.0 seulement si l'appareil l'exige. Si un téléphone refuse le fichier, c'est souvent un saut de ligne manquant ou un encodage mixte.

### Y a-t-il une limite au nombre de fichiers ?

Aucun nombre fixe n'est intégré. La lecture se fait dans le navigateur : la limite est la mémoire de l'appareil, pas un quota serveur. Les fichiers avec photos grossissent vite ; si l'onglet ralentit, fusionnez par lots.

### Mes données de contact sont-elles envoyées quelque part ?

Non. Le navigateur lit les fichiers, construit l'aperçu, écrit le XLSX et génère le VCF en local — aucun envoi, aucun compte.

## Conclusion

Fusionner des VCF, c'est deux opérations et non une : rassembler les fiches, puis les réconcilier. Seul un tableau rend les deux visibles, et l'aller-retour coûte quelques minutes pour un résultat vérifiable. Commencez par le convertisseur VCF vers Excel ci-dessus, chargez tous les fichiers, nettoyez la feuille, puis écrivez le VCF final.
