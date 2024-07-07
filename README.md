# Exercice Technique - The Wokies
Cet exercice a pour but d'évaluer vos compétences en développement avec React, Typescript, Supabase, Ant Design, et Tailwind CSS, en reproduisant la stack utilisée par The Wokies.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants :
- Node.js
- npm, yarn ou autre ...
- Un compte et un projet [Supabase](https://supabase.com/) (gratuit)

## Installation

1. Installez les dépendances du projet :
    ```sh
    npm install
    ```

2. Créez un projet sur Supabase et configurez les tables et types nécessaires. Ajoutez les informations de connexion dans `src/config/supabase.ts`.

## Structure du Projet

Le projet est organisé comme suit :

```
/src
  /pages          # Pages de l'application
  /shared         # Composants et services partagés
  /config         # Configuration de l'application
    supabase.ts   # Configuration Supabase
  router.tsx      # Router de l'application
  index.tsx       # Point d'entrée de l'application
```

## Styles et Bibliothèques UI

- **Ant Design** et **Tailwind CSS** sont inclus pour la structuration et le style de l'application. Vous êtes libre d'utiliser d'autres bibliothèques pour le style, mais React doit rester la librairie principal.

## Instructions Supabase

1. Créez un compte Supabase gratuit.
2. Créez un nouveau projet Supabase.
3. Initialisez les tables et types nécessaires à votre application. Vous pouvez utiliser toute la puissance de PostgreSQL/Supabase pour cela.
4. Mettez à jour `src/config/supabase.ts` avec les informations de votre projet Supabase.
5. **Comme on n'utilise pas l'authentification/la sécurité pensez à désactiver le RLS (Row Level Security) pour les tables que vous créez. Ou d'utiliser la clé admin (service_role) de supabase pour bypass la sécurité.**

## Objectif de l'Exercice

Vous devez créer trois vues principales pour cette application :

1. **Home** : Permet d'inscrire de nouveaux joueurs et de leur envoyer une invitation.
2. **Invite** : Page permettant de répondre à une invitation reçue. Chaque joueur reçoit une invitation pour accepter sa participation **(pas besoin de gérer l'envoi réel par mail)**.
3. **Dashboard** : Voir les états de tous les joueurs.

### Détails des Fonctionnalités

#### Home
- Formulaire d'inscription pour les nouveaux joueurs.
- Envoi d'une invitation à un joueur inscrit.

#### Invite
- Interface permettant à un joueur de répondre à une invitation reçue.
- Gestion de l'acceptation de la participation.

#### Dashboard
- Affichage de l'état de chaque joueur (reçu/accepté/non-accepté).

## Contraintes / Conseils

- **React** doit être utilisé pour la structure de l'application.
- **Supabase** doit être utilisé pour les opérations CRUD (Create, Read, Update, Delete). Pas besoin de gérer l'authentification, ni les sécurités, ni les permissions.
- Respectez le sujet du test, **mais vous pouvez prendre des libertés dans l'implémentation et la structure du projet** si cela améliore l'UI/UX ou facilite l'implémentation technique. Par exemple vous pouvez très bien fusionner les pages Home et Dashboard, si ça se justifie en terme UI/UX ou bien d'implémentation technique.
- Vous n'êtes pas UI/UX designer, un design simple et fonctionnel est suffisant. Un style CSS minimal est attendu, mais qui est déjà fourni par Tailwind CSS et Ant-Design.

## Lancer l'Application

Pour lancer l'application en mode développement, utilisez la commande suivante :
```sh
npm start
```

## Fonctionnalités supplémentaires

Si vous avez le temps vous pouvez ajouter des fonctionnalités supplémentaires à votre guise, comme :
- Système d'équipe : Chaque joueur peut être assigné à une équipe (de 0 à 5 joueurs)

## Livrables

1. Un lien vers votre repository Git contenant le code de votre projet.

Nous vous souhaitons bonne chance pour cet exercice et sommes impatients de voir votre implémentation !
