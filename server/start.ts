import express from 'express'
import { parse } from 'url'
import next from 'next'
import { url } from 'inspector'

async function main() {
  const dev = process.env.NODE_ENV !== 'production'
  const app = next({
    dev,
  })

  const server = express()
  server.use(
    express.static('./public', {
      maxAge: 0, // don't cache long-term: we can't guarantee the content is immutable.
      index: false,
      redirect: false,
      fallthrough: true, // match create-react-app's behavior and render with react if file not found.
    })
  )

  const assetPrefix = '/platformassets/ux-renderer/v2'
  await app.prepare()
  server.use(async (req, res, next) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      let rawUrl = req.url
      if (rawUrl.startsWith(assetPrefix)) {
        rawUrl = req.url = rawUrl.substring(assetPrefix.length)
      }

      const parsedUrl = parse(rawUrl, true)
      await app.render(req, res, '/', parsedUrl.query, parsedUrl)
    } catch (err) {
      next(err)
    }
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
}

main()
