import type { AppProps } from "next/app";
import "nextra-theme-docs/style.css"; // Importez les styles Nextra

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
