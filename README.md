Ce projet est un projet [Next.js](https://nextjs.org) initialisé avec [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Démarrage

Tout d'abord, clonez le dépôt et naviguez vers le répertoire du projet :

```bash
git clone https://github.com/your-username/node-packer.git
cd node-packer
```

Ensuite, installez les dépendances :

```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

Ensuite, initialisez Prisma :

```bash
npx prisma init
```

Définissez le `DATABASE_URL` dans le fichier `.env` pour pointer vers votre base de données existante. Si votre base de données n'a pas encore de tables, lisez le [guide de démarrage de Prisma](https://pris.ly/d/getting-started).

Définissez le fournisseur du bloc datasource dans `prisma/schema.prisma` pour correspondre à votre base de données : `postgresql`, `mysql`, `sqlite`, `sqlserver`, `mongodb` ou `cockroachdb`.

Exécutez les commandes suivantes pour configurer Prisma :

```bash
npx prisma db pull
npx prisma generate
```

Enfin, lancez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.

Vous pouvez commencer à éditer la page en modifiant `app/page.tsx`. La page se met à jour automatiquement lorsque vous modifiez le fichier.

Ce projet utilise [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement [Geist](https://vercel.com/font), une nouvelle famille de polices pour Vercel.

## En savoir plus

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) - apprenez-en plus sur les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn) - un tutoriel interactif Next.js.

Vous pouvez consulter [le dépôt GitHub de Next.js](https://github.com/vercel/next.js) - vos retours et contributions sont les bienvenus !

## Déployer sur Vercel

Le moyen le plus simple de déployer votre application Next.js est d'utiliser la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) des créateurs de Next.js.

Consultez notre [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.
