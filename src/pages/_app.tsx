import "@datx/core/disable-mobx";

import type { AppProps } from "next/app";
import { DatxProvider, createFetcher, useInitialize } from "@datx/swr";
import { ChakraProvider } from "@chakra-ui/react";
import { createClient } from "@/datx/createClient";
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }: AppProps) {
  const client = useInitialize(createClient);

  return (
    <DatxProvider client={client}>
      <SWRConfig value={{ fetcher: createFetcher(client) }}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </SWRConfig>
    </DatxProvider>
  );
}
