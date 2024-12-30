import { renderHook, waitFor } from "@testing-library/react";
import { ENTITY_GUID, NerdGraphQuery } from "../../__mocks__/nr1";
import usePinnedVersionQuery from "../usePinnedVersionQuery";
import { createQueryClient } from "./__utils__/queryClient";

describe("usePinnedVersionQuery", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("fetches pinned version successfully", async () => {
    // Arrange
    const { wrapper } = createQueryClient();
    const expectedVersion = "1.277.0";
    const mockResponse = {
      data: {
        actor: {
          entity: {
            browserSettings: {
              browserMonitoring: {
                pinnedVersion: expectedVersion,
              },
            },
          },
        },
      },
    };
    NerdGraphQuery.query.mockResolvedValueOnce(mockResponse);

    // Act
    const { result } = renderHook(() => usePinnedVersionQuery(), { wrapper });

    // Assert
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(NerdGraphQuery.query).toHaveBeenCalledWith({
      query: expect.any(Array),
      variables: { browserAppGuid: ENTITY_GUID },
    });
    expect(result.current.data).toBe(expectedVersion);
  });

  it("handles query error", async () => {
    // Arrange
    const { wrapper } = createQueryClient();
    const mockResponse = {
      data: null,
      errors: ["Failed to fetch pinned version"],
    };
    NerdGraphQuery.query.mockResolvedValueOnce(mockResponse);

    // Act
    const { result } = renderHook(() => usePinnedVersionQuery(), {
      wrapper,
    });

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
