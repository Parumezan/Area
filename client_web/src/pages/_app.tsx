import "../styles/global.css";

import type { AppProps } from "next/app";

const ClientWeb = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default ClientWeb;
