import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  logger: { log: () => {}, error: () => {}, warn: () => {} },
});

export function createQueryClientWrapper({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
