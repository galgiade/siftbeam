---
slug: siftbeam-quick-start-guide
title: "Comment utiliser siftbeam : Guide complet du flux de service"
description: "Apprenez le flux complet du traitement des données avec siftbeam, expliqué de manière facile à comprendre pour les débutants. Guide étape par étape de la création de compte à la configuration de la politique, la création de groupes, le traitement de fichiers et le téléchargement des résultats."
author: Équipe éditoriale siftbeam
publishedAt: 2025-01-16
category: tutorial
tags:
  - Tutoriel
  - Mode d'emploi
  - Guide débutant
  - Guide complet
  - Traitement de données
readingTime: 15 min
---

# Comment utiliser siftbeam : Guide complet du flux de service

## Table des matières

1. [Ce que vous apprendrez](#ce-que-vous-apprendrez)
2. [Vue d'ensemble du flux de service](#vue-densemble-du-flux-de-service)
3. [Prérequis](#prérequis)
4. [Étape 1 : Création de compte et enregistrement de l'entreprise](#étape-1--création-de-compte-et-enregistrement-de-lentreprise)
5. [Étape 2 : Demander une politique via une nouvelle commande](#étape-2--demander-une-politique-via-une-nouvelle-commande)
6. [Étape 3 : Créer des groupes](#étape-3--créer-des-groupes)
7. [Étape 4 : Traiter les fichiers sur la page de service](#étape-4--traiter-les-fichiers-sur-la-page-de-service)
8. [Étape 5 : Examiner et télécharger les résultats](#étape-5--examiner-et-télécharger-les-résultats)
9. [Prochaines étapes](#prochaines-étapes)

## Ce que vous apprendrez

En lisant cet article, vous pourrez :

- ✅ Comprendre le flux complet du service siftbeam
- ✅ Créer un compte et enregistrer les informations de l'entreprise
- ✅ Demander une politique (configuration de traitement) via une nouvelle commande
- ✅ Créer des groupes et lier les utilisateurs aux politiques
- ✅ Télécharger des fichiers et exécuter le traitement sur la page de service
- ✅ Examiner et télécharger les résultats du traitement

**Temps requis** : La configuration initiale prend plusieurs jours à 1 semaine (y compris la consultation de politique), le traitement ultérieur prend quelques minutes

**Difficulté** : ★★☆☆☆ (Convient aux débutants)

## Vue d'ensemble du flux de service

siftbeam est un service B2B qui fournit un traitement de données personnalisé pour chaque entreprise. Le flux pour commencer à utiliser le service est le suivant :

```
1. Création de compte et enregistrement de l'entreprise
   ↓
2. Demander une politique (configuration de traitement) via une nouvelle commande
   ↓
3. Finalisation de la politique (configurée par notre équipe)
   ↓
4. Créer des groupes (lier les utilisateurs aux politiques)
   ↓
5. Télécharger des fichiers et traiter sur la page de service
   ↓
6. Télécharger les résultats du traitement
```

**Points clés** :
- La caractéristique clé de siftbeam est la "personnalisation par client"
- La configuration initiale nécessite une consultation de politique (configuration de traitement)
- Une fois la politique configurée, vous pouvez traiter les données de manière répétée

## Prérequis

Avant de commencer, préparez les éléments suivants :

### Éléments nécessaires

- **Adresse e-mail** : Utilisée pour l'enregistrement du compte
- **Informations sur l'entreprise** : Nom de l'entreprise, adresse et autres informations de base
- **Fichiers de données à traiter** : CSV, JSON, Excel, etc. (comme fichiers d'exemple)

### Environnement recommandé

- **Navigateur** : Chrome, Firefox, Safari, Edge (dernière version)
- **Connexion Internet** : Environnement de connexion stable

## Étape 1 : Création de compte et enregistrement de l'entreprise

### 1-1. Inscription

Visitez la [page d'inscription siftbeam](https://siftbeam.com/fr/signup/auth).

**Informations requises** :
- **Adresse e-mail** : Adresse e-mail professionnelle
- **Mot de passe** : 8 caractères ou plus, incluant lettres, chiffres et symboles

Après vérification de l'e-mail, vous serez redirigé vers l'écran de connexion.

### 1-2. Enregistrer les informations de l'entreprise

L'enregistrement des informations de l'entreprise est requis lors de la première connexion.

**Champs obligatoires** :
- Nom de l'entreprise
- Pays
- Code postal
- État/Province
- Ville
- Adresse ligne 1
- Numéro de téléphone
- E-mail de facturation

**Champs facultatifs** :
- Adresse ligne 2 (Nom du bâtiment, numéro de chambre, etc.)

### 1-3. Créer un compte administrateur

Après l'enregistrement des informations de l'entreprise, créez un compte administrateur.

- Nom
- Adresse e-mail
- Mot de passe

La création du compte est maintenant terminée. Vous pouvez accéder au tableau de bord.

## Étape 2 : Demander une politique via une nouvelle commande

Une politique définit "quel type de traitement de données effectuer". Étant donné que siftbeam fournit un traitement personnalisé pour chaque client, vous devez d'abord demander une consultation de politique.

### 2-1. Accéder à la page Nouvelle commande

1. Cliquez sur "Nouvelle commande" dans le tableau de bord
2. Cliquez sur le bouton "Créer"

### 2-2. Demander la configuration du traitement

Remplissez les informations suivantes dans le formulaire de nouvelle commande :

**Champs obligatoires** :
- **Type de données** : Sélectionnez parmi Données structurées, Données non structurées, Mixte ou Autre
- **Type de modèle** : Sélectionnez parmi Classification, Régression, Clustering ou Autre
- **Sujet** : Brève description des besoins de traitement
- **Détails** : Description spécifique du traitement de données requis

**Exemple** :
```
Type de données : Données structurées
Type de modèle : Classification
Sujet : Transformation de données de fichier CSV

Détails :
- Entrée : CSV de données client (nom, adresse, numéro de téléphone, etc.)
- Traitement : Normalisation des adresses, standardisation du format des numéros de téléphone
- Sortie : Fichier CSV formaté
- Fréquence : Environ une fois par semaine
- Volume de données : Environ 10 000 enregistrements par lot
```

### 2-3. Joindre des fichiers d'exemple (Facultatif)

Joindre des fichiers d'exemple des données que vous souhaitez traiter permet des estimations plus précises.

- Maximum 10 fichiers
- Jusqu'à 50 Mo par fichier

### 2-4. Soumettre et examiner

Après avoir soumis le formulaire, notre équipe examinera le contenu et :

1. **Confirmer les exigences de traitement** : Audition des besoins
2. **Fournir une estimation** : Coûts de traitement approximatifs
3. **Créer une politique** : Configurer le flux de traitement
4. **Exécution de test** : Vérifier le fonctionnement avec des données d'exemple

**Temps requis** : Généralement 2-5 jours ouvrables

### 2-5. Finalisation de la politique

Une fois que notre équipe a créé et finalisé la configuration de la politique, le statut de la nouvelle commande sera mis à jour. Vous pouvez vérifier la progression sur la page "Nouvelle commande" du tableau de bord.

Une fois la politique finalisée, vous pouvez passer à l'étape suivante.

## Étape 3 : Créer des groupes

Une fois la politique finalisée, créez des groupes. Les groupes sont un mécanisme pour gérer "quels utilisateurs peuvent utiliser quelles politiques".

### 3-1. Accéder à la page Gestion des groupes

1. Cliquez sur "Gestion des groupes" dans le tableau de bord
2. Cliquez sur le bouton "Créer"

### 3-2. Entrer les informations du groupe

**Champs obligatoires** :
- **Nom du groupe** : Définir un nom facile à comprendre (par exemple, Département des ventes, Équipe d'analyse de données)
- **Description** : Objectif ou utilisation du groupe (facultatif)

### 3-3. Sélectionner les politiques

Sélectionnez les politiques que ce groupe utilisera parmi les politiques créées.

- Plusieurs politiques peuvent être sélectionnées
- Peuvent être ajoutées ou supprimées ultérieurement

### 3-4. Ajouter des utilisateurs

Ajoutez les utilisateurs qui appartiendront au groupe.

**Méthode 1 : Ajouter des utilisateurs existants**
- Sélectionner les utilisateurs déjà créés dans la Gestion des utilisateurs

**Méthode 2 : Créer et ajouter de nouveaux utilisateurs**
- Entrer le nom et l'adresse e-mail
- Un e-mail d'invitation sera envoyé

### 3-5. Création du groupe terminée

Une fois que vous créez le groupe, les utilisateurs membres peuvent traiter les données en utilisant les politiques sélectionnées.

## Étape 4 : Traiter les fichiers sur la page de service

Une fois la configuration du groupe terminée, vous pouvez exécuter le traitement des données.

### 4-1. Accéder à la page de service

1. Cliquez sur "Service" dans le tableau de bord
2. Sélectionnez la politique à utiliser

### 4-2. Télécharger des fichiers

**Méthode 1 : Glisser-déposer**
- Glissez et déposez les fichiers dans la zone de téléchargement

**Méthode 2 : Sélection de fichiers**
- Cliquez sur "Sélectionner des fichiers" et choisissez dans le navigateur de fichiers

**Limites** :
- Maximum 10 fichiers
- Recommandé 100 Mo ou moins par fichier
- Formats pris en charge : Formats configurés dans la politique

### 4-3. Démarrer le traitement

1. Une fois les fichiers téléchargés, cliquez sur le bouton "Démarrer le traitement"
2. Le traitement démarre automatiquement

### 4-4. Surveiller l'état du traitement

Vous pouvez vérifier l'état du traitement :

- **Statut** : "En cours", "Terminé", "Erreur"
- **Temps de traitement** : Temps écoulé depuis le début du traitement
- **Informations sur le fichier** : Nom du fichier, taille

**Temps estimé** :
- Varie en fonction du volume de données et du contenu du traitement
- Généralement quelques secondes à quelques minutes

### 4-5. Traitement en arrière-plan

Pendant le traitement, vous pouvez :

- ✅ Télécharger d'autres fichiers
- ✅ Vérifier l'historique de traitement passé
- ✅ Fermer l'écran (le traitement continue)

## Étape 5 : Examiner et télécharger les résultats

Une fois le traitement terminé, examinez et téléchargez les résultats.

### 5-1. Vérifier l'historique de traitement

Vous pouvez vérifier l'historique de traitement sur la page de service ou le tableau de bord.

**Informations affichées** :
- **Statut** : Traitement terminé, En cours, Erreur
- **Date/Heure de traitement** : Date et heure d'exécution du traitement
- **Nom du fichier** : Nom du fichier traité
- **Temps de traitement** : Temps pris pour le traitement
- **Volume de données** : Taille des données traitées

### 5-2. Télécharger les résultats

Vous pouvez télécharger les fichiers terminés avec les étapes suivantes :

1. Sélectionnez le fichier cible dans l'historique de traitement
2. Cliquez sur le bouton "Télécharger"
3. Le fichier se télécharge automatiquement

**Fichiers téléchargeables** :
- **Fichier d'entrée** : Fichier original téléchargé
- **Fichier de sortie** : Fichier après traitement

### 5-3. Période de conservation des données

- **Période de conservation** : 1 an à partir du téléchargement
- **Suppression automatique** : Automatiquement supprimé après 1 an
- **Re-téléchargement** : Peut être téléchargé plusieurs fois pendant la période de conservation

**Important** : 
Sauvegardez toujours les données nécessaires localement.

### 5-4. En cas d'erreurs de traitement

Si une erreur se produit, vérifiez les éléments suivants :

1. **Vérifier le message d'erreur** : Identifier la cause
2. **Vérifier le format du fichier** : Est-ce le format spécifié dans la politique ?
3. **Vérifier la taille du fichier** : Est-elle dans les limites ?
4. **Contacter le support** : Si non résolu, contactez le support par chat

## Questions fréquemment posées

Pour plus d'informations détaillées et de réponses aux questions courantes, veuillez visiter notre [page FAQ](https://siftbeam.com/fr/faq).

Les sujets couverts incluent :
- Sécurité et protection des données
- Tarification et facturation
- Formats de fichiers pris en charge
- Système de support
- Fonctionnalités supplémentaires

Et bien plus encore.

## Prochaines étapes

### Pour une utilisation plus avancée

Une fois que vous comprenez les bases de siftbeam, passez aux étapes suivantes :

#### 1. Gestion des utilisateurs

- Ajouter des membres de l'équipe
- Contrôler l'accès avec les paramètres d'autorisation
- Créer des groupes par département

#### 2. Intégration API

- Émettre des clés API
- Créer des scripts d'automatisation
- Intégrer avec les systèmes existants

#### 3. Configurer le traitement planifié

- Configurer le traitement planifié
- Configurer les téléchargements automatiques
- Créer des rapports périodiques

#### 4. Paramètres avancés

- Consulter sur les flux de traitement personnalisés
- Optimiser pour les gros volumes de données
- Renforcer les paramètres de sécurité

### Si vous rencontrez des problèmes

Si des problèmes surviennent, utilisez les ressources suivantes :

- **FAQ** : Consultez les solutions sur la [page FAQ](https://siftbeam.com/fr/faq)
- **Demande de support** : Soumettez des demandes depuis Support dans votre tableau de bord
- **Temps de réponse** : Répond généralement dans les 3 jours ouvrables

## Résumé

Cet article a expliqué le flux complet du traitement des données avec siftbeam :

1. ✅ **Création de compte et enregistrement de l'entreprise** : Inscription avec e-mail et mot de passe, saisie des informations de l'entreprise
2. ✅ **Demander une politique via une nouvelle commande** : Consulter notre équipe sur le traitement de données requis
3. ✅ **Créer des groupes** : Lier les utilisateurs aux politiques pour préparer l'utilisation
4. ✅ **Traiter les fichiers sur la page de service** : Télécharger des fichiers, exécuter le traitement, surveiller l'état
5. ✅ **Examiner et télécharger les résultats** : Vérifier l'historique, télécharger les fichiers de résultats

siftbeam est un service de traitement de données personnalisable pour les entreprises. Optimisez le traitement des données de votre entreprise avec des flux de travail adaptés à chaque client.

### Commencez maintenant

Lorsque vous êtes prêt, commencez avec siftbeam aujourd'hui.

[Commencer avec siftbeam](https://siftbeam.com/fr/signup/auth)

---

**Cet article vous a-t-il été utile ?** Nous attendons vos commentaires.

