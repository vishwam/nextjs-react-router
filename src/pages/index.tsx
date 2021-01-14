import Head from 'next/head';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import classnames from 'classnames/bind';

import styles from './index.module.scss';
const cx = classnames.bind(styles);

import LogoSrc, { ReactComponent as Logo } from './vercel.svg';

export default function Home() {
  return (
    <div className={cx('container')}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={cx('title')}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <img src={LogoSrc} />

        <p className={cx('description')}>
          Get started by editing <code>pages/index.tsx</code>
        </p>

        <button
          onClick={() => {
            window.alert('With typescript and Jest');
          }}
        >
          Test Button
        </button>

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Root />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Redirect from="/foo" to="/dashboard" />
        </Switch>

        <div className={cx('grid')}>
          <a href="https://nextjs.org/docs" className={cx('card')}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={cx('card')}>
            <h3>Learn &rarr;</h3>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={cx('card')}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={cx('card')}
          >
            <h3>Deploy &rarr;</h3>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <Logo height="1em" className={cx('logo')} />
        </a>
      </footer>
    </div>
  );
}

function Root() {
  return <h2>Root</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Dashboard() {
  return <h2>Dashboard</h2>;
}
