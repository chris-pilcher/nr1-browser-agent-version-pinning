import { renderHook } from "@testing-library/react";
import { ENTITY_GUID, NerdGraphMutation } from "../../__mocks__/nr1";
import { PINNED_VERSION_QUERY_KEY } from "../queryKeys";
import usePinnedVersionMutation from "../usePinnedVersionMutation";
import { createQueryClientWrapper, queryClient } from "./__utils__/queryClient";

describe("usePinnedVersionMutation", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("mutates pinned version successfully", async () => {
    // Arrange
    const expectedPinnedVersion = "1.277.0";
    const mockResponse = {
      data: {
        agentApplicationSettingsUpdate: {
          browserSettings: {
            browserMonitoring: {
              pinnedVersion: expectedPinnedVersion,
            },
          },
        },
      },
    };
    NerdGraphMutation.mutate.mockResolvedValueOnce(mockResponse);

    // Act
    const { result } = renderHook(() => usePinnedVersionMutation(), { wrapper: createQueryClientWrapper });
    await result.current.mutateAsync(expectedPinnedVersion);

    // Assert
    expect(NerdGraphMutation.mutate).toHaveBeenCalledWith({
      mutation: expect.any(Array),
      variables: {
        guid: ENTITY_GUID,
        pinnedVersion: expectedPinnedVersion,
      },
    });
    expect(queryClient.getQueryData(PINNED_VERSION_QUERY_KEY)).toBe(expectedPinnedVersion);
  });

  it("handles mutation error", async () => {
    // Arrange
    const error = new Error("Mutation failed");
    NerdGraphMutation.mutate.mockRejectedValueOnce(error);

    // Act
    const { result } = renderHook(() => usePinnedVersionMutation(), { wrapper: createQueryClientWrapper });

    // Assert
    await expect(result.current.mutateAsync("1.277.0")).rejects.toThrow("Mutation failed");
  });
});
