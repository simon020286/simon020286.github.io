// import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import 'highlight.js/styles/devibeans.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }: AppProps) {
  return (
  <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
    <Component {...pageProps} />
  </ThemeProvider>
  );
}

export default MyApp
