import { initializeIcons } from '@fluentui/react';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import { useEffect } from 'react';
import { StaticRouter, BrowserRouter } from 'react-router-dom';
import 'theme/normalize.scss';

export const ReactRouterContext = Symbol('React Router Context');

initializeIcons();

export default function App(props: AppProps) {
  const { Component, pageProps, router } = props;
  useEffect(() => {
    // disable nextjs's router: react-router will handle page transitions instead:
    router.beforePopState(() => {
      return false;
    });
  }, []);

  if (typeof window === 'undefined') {
    return (
      <StaticRouter
        location={router.asPath}
        context={(router.query as any)[ReactRouterContext]}
      >
        <Component {...pageProps} />
      </StaticRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Component {...pageProps} />
      </BrowserRouter>
    );
  }
}

App.getInitialProps = async (
  appContext: AppContext
): Promise<AppInitialProps> => {
  // Specify getInitialProps so nextjs populates the router.asPath with the
  // actual request path. Then, create the react-router context in the router
  // query object (which is the only object here also accessible in  _document)
  (appContext.router.query as any)[ReactRouterContext] = {};
  return {
    pageProps: {},
  };
};
