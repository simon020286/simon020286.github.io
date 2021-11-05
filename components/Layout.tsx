import React from 'react';
import { MetaProps } from '../types/layout';
import Head from './Head';
import Navigation from './Navigation';
import ThemeSwitch from './ThemeSwitch';

type LayoutProps = {
  children: React.ReactNode;
  customMeta?: MetaProps;
};

export const WEBSITE_HOST_URL = 'https://nextjs-typescript-mdx-blog.vercel.app';

const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  return (
    <>
      <Head customMeta={customMeta} />
      <div className="flex flex-col min-h-screen">
        <header>
          <div className="max-w-5xl px-8 mx-auto">
            <div className="flex items-center justify-between py-6">
              <Navigation />
              <ThemeSwitch />
            </div>
          </div>
        </header>
        <main className="mb-0 flex-grow">
          <div className="max-w-5xl px-8 py-4 mx-auto">{children}</div>
        </main>
        <footer className="py-8">
          <div className="max-w-5xl px-8 mx-auto">Built by T-Dev</div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
