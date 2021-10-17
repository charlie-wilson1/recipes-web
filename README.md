# Recipes Web

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project combined with the [recipes-studio](https://github.com/ajax2012/recipes-studio) app should give you an almost free method of hosting and managing your favorite recipes. Amount of users for CMS: 3. I _highly_ recommend adding whitelisted emails to your Magic link application. This will make it so only people you give permission to have read-only access to your recipes. __I do not accept fault if you add copyrighted material and host it on your own project; I do not have control over your personal CMS.__

Please note that this project is not necssary if you don't require an easier viewing experience or don't wish to share your recipes with your friends. If you _just_ need a CMS, the [recipes-studio](https://github.com/ajax2012/recipes-studio) app will be all you will need

DEV NOTE: the mobile version of this works, but it has some bugs with the "side nav". Please ignore this for now - will be fixed in a future update.

## Dependencies

- [Sanity CMS](https://sanity.io) with [recipes-studio](https://github.com/ajax2012/recipes-studio)
- [Magic link](https://magic.link) (I added google and facebook authentication, but feel free to remove or alter those from the social-logins.js file)
- [Netlify](https://netlify.com) for deployments (optional)

## Getting Started

First, set up your dependencies for the [recipes-studio](https://github.com/ajax2012/recipes-studio) and create an app with [Magic](https://magic.link).

Once your dependencies have been taken care of, create and edit your .env file with the following:

```env
NEXT_PUBLIC_SANITY_DATASET='production'
NEXT_PUBLIC_SANITY_PROJECT_ID='...'
SANITY_API_TOKEN='...'
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=pk_live_...
MAGIC_SECRET_KEY=sk_live_...
```

Then, run the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel (from default readme)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## TODOs

- fix mobile side nav.
- add print button for recipes
- add theming if requested.
