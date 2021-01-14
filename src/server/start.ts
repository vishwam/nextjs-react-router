import express, { NextFunction } from 'express';
import path from 'path';
import { parse } from 'url';
import next from 'next';
import BowserDetector from 'bowser';

const enum Browser {
  IE = 'Internet Explorer',
  SAFARI = 'Safari',
}

const PublicPath = path.resolve(process.cwd(), './public');
const UnsupportedBrowserPagePath = 'static/unsupported_browser.html';
const Error500PagePath = 'static/error_500.html';

function isUnsupportedBrowser(userAgent: string) {
  if (!userAgent) {
    return false;
  }

  const browserInfo = BowserDetector.getParser(userAgent).getBrowser();
  switch (browserInfo.name) {
    case Browser.IE:
      return true;
    case Browser.SAFARI:
      const version = browserInfo.version?.substring(0, 2);
      // Exclude Safari version < 14 since we see dashboard crashes because IntersectionObserver is not available
      return parseInt(version, 10) < 14;
    default:
      return false;
  }
}

async function main() {
  const dev = process.env.NODE_ENV !== 'production';
  const app = next({
    dev,
  });

  const server = express();

  server.use(
    express.static(PublicPath, {
      maxAge: 0, // don't cache long-term: we can't guarantee the content is immutable.
      index: false,
      redirect: false,
      fallthrough: true, // match create-react-app's behavior and render with react if file not found.
    })
  );

  await app.prepare();
  server.use(async (req, res, next) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);

      const userAgent = req.get('user-agent');
      if (isUnsupportedBrowser(userAgent)) {
        // give users a static page that says we don't support their browser
        // https://msazure.visualstudio.com/One/_workitems/edit/2834498
        res.sendFile(path.resolve(PublicPath, UnsupportedBrowserPagePath));
        return;
      }

      await app.render(req, res, '/', parsedUrl.query, parsedUrl);
    } catch (err) {
      next(err);
    }
  });

  server.use(async (error, _req, res, _next) => {
    res
      .status(error.status || 500)
      .sendFile(path.resolve(PublicPath, Error500PagePath));
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}

main();
