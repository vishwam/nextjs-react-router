import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import type { Response } from 'express';
import { Stylesheet, InjectionMode } from '@uifabric/merge-styles';
import { resetIds } from '@uifabric/utilities';
import { ReactRouterContext } from './_app';

// Do this in file scope to initialize the stylesheet before Fluent UI React components are imported.
const stylesheet = Stylesheet.getInstance();

// Set the config.
stylesheet.setConfig({
  injectionMode: InjectionMode.none,
  namespace: 'server',
});

interface CustomDocumentProperties extends DocumentProps {
  styleTags?: string;
}

export default class CustomDocument extends Document<CustomDocumentProperties> {
  static async getInitialProps(ctx: DocumentContext) {
    stylesheet.reset();
    resetIds();

    // get the react router context from the query (populated by _app's getInitialProps):
    const reactRouterContext = (ctx.query as any)[ReactRouterContext];
    const res = ctx.res as Response;

    // override the render function and handle react-router redirects:
    const originalRender = ctx.renderPage;
    ctx.renderPage = async (options) => {
      const result = await originalRender(options);

      if (reactRouterContext.url) {
        // react-router emitted a redirect:
        res.redirect(reactRouterContext.url);
        return {
          html: null,
        };
      } else {
        return {
          ...result,
          styleTags: stylesheet.getRules(true),
        };
      }
    };

    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html>
        <Head>
          <style
            type="text/css"
            dangerouslySetInnerHTML={{ __html: this.props.styleTags }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
