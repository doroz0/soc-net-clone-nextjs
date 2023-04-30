import "@datx/core/disable-mobx";

import type { AppProps } from "next/app";
import { SessionProvider, useSession } from "next-auth/react";
import { DatxProvider, createFetcher, useInitialize } from "@datx/swr";
import { ChakraProvider } from "@chakra-ui/react";
import { createClient } from "@/datx/createClient";
import { SWRConfig } from "swr";
import { FC, ReactNode, useEffect } from "react";
import { config } from "@datx/jsonapi";

export default function Session({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <App>
        <Component {...pageProps} />
      </App>
    </SessionProvider>
  );
}

export const App: FC<{ children?: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const client = useInitialize(createClient);

  // TODO: There has to be a better way
  useEffect(() => {
    console.log({ session });
    const { accessToken } = (session || {}) as any;
    config.defaultFetchOptions = {
      ...(config.defaultFetchOptions || {}),
      headers: {
        ...(config.defaultFetchOptions?.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }, [session]);

  if (status === "loading" || (status === "authenticated" && !session)) {
    return null;
  }

  return (
    <DatxProvider client={client}>
      <SWRConfig value={{ fetcher: createFetcher(client) }}>
        <ChakraProvider>{children}</ChakraProvider>
      </SWRConfig>
    </DatxProvider>
  );
};
