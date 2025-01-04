import { renderHook, waitFor } from "@testing-library/react";
import { URLS } from "../../constants";
import useVersionListQuery from "../useVersionListQuery";
import { createQueryClient } from "./__utils__/queryClient";

describe("useVersionListQuery", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches and returns version list data", async () => {
    // Arrange
    const { wrapper } = createQueryClient();
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
    global.fetch.mockResolvedValueOnce({
      json: async () => mockData,
    });

    // Act
    const { result } = renderHook(() => useVersionListQuery(), { wrapper });

    // Assert
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(global.fetch).toHaveBeenCalledWith(URLS.EOL.DATA);
    expect(result.current.data).toEqual(mockData);
  });

  it("handles fetch error", async () => {
    // Arrange
    const { wrapper } = createQueryClient();
    const error = new Error("Failed to fetch");
    global.fetch.mockRejectedValueOnce(error);

    // Act
    const { result } = renderHook(() => useVersionListQuery(), { wrapper });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
