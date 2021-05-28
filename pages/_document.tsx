import Document, { DocumentContext } from 'next/document'
import type { Response } from 'express'
import { ReactRouterContext } from './_app'

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    // get the react router context from the query (populated by _app's getInitialProps):
    const reactRouterContext = (ctx.query as any)[ReactRouterContext]
    const res = ctx.res as Response

    // override the render function and handle react-router redirects:
    const originalRender = ctx.renderPage
    ctx.renderPage = async (options) => {
      const result = await originalRender(options)
      if (reactRouterContext.url) {
        // react-router emitted a redirect:
        res.redirect(reactRouterContext.url)
        return {
          html: null,
        }
      } else {
        return result
      }
    }

    return Document.getInitialProps(ctx)
  }
}
