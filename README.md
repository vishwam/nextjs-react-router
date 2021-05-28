# NextJS React-Router

This is an experiment to find out how to migrate an existing react app (with typescript/react-router/server-side-rendering/jest/eslint etc.) to Next.JS.

## Usage

1. Clone the repo
2. Run `npm run dev`, which spins up the server code (`server/start.ts`)
3. Run `npm run build` to build the production code, which can be started with `npm start`

## Structure

- The main nextjs app is in `pages/`, with the output javascript in `.next/`

  - `pages/_app.tsx` is the startpoint of the application, and sets up react-router for both client and server-side.

    Since we're not using the default nextjs router, we're forced to opt out of the static site generation and specify a `getInitialProps` method here so nextjs populates the actual request path correctly.

  - `pages/index.tsx` contains a `Home` component that sets up the react-router routes
  - `pages/_document.tsx` handles the redirects triggered by react-router

- The server-side bootstrap code is in `server/`, with the output javascript in `dist/`
  - `server/start.ts` sets up the nextjs application
