import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useVersionListQuery from "../useVersionListQuery";
import { URLS } from "../../constants";

const mockData = [
  {
    version: "1.277.0",
    startDate: "2024-12-18T00:00:00.000Z",
    endDate: "2025-12-18T00:00:00.000Z",
  },
  {
    version: "1.276.0",
    startDate: "2024-12-16T00:00:00.000Z",
    endDate: "2025-12-16T00:00:00.000Z",
  },
];

const wrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: { log: () => {}, error: () => {}, warn: () => {} },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe("useVersionListQuery", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches and returns version list data", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => mockData,
    });

    const { result } = renderHook(() => useVersionListQuery(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith(URLS.EOL.DATA);
    expect(result.current.data).toEqual(mockData);
  });

  it("handles fetch error", async () => {
    const error = new Error("Failed to fetch");
    global.fetch.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useVersionListQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
