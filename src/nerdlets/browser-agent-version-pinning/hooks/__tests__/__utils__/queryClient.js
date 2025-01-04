import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: { log: () => {}, error: () => {}, warn: () => {} },
  });

  function wrapper({ children }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return { queryClient, wrapper };
}
