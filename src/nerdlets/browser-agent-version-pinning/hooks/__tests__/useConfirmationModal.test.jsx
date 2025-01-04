import { renderHook } from "@testing-library/react";
import { ModalContext } from "../../context";
import useConfirmationModal from "../useConfirmationModal";

describe("useConfirmationModal", () => {
  const mockSetNewVersion = jest.fn();
  const mockSetHidden = jest.fn();

  const wrapper = ({ children }) => (
    <ModalContext.Provider
      value={{
        setNewVersion: mockSetNewVersion,
        setHidden: mockSetHidden,
      }}>
      {children}
    </ModalContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("confirmPin sets version and shows modal", () => {
    // Arrange
    const version = "1.277.0";

    // Act
    const { result } = renderHook(() => useConfirmationModal(), { wrapper });
    result.current.confirmPin(version);

    // Assert
    expect(mockSetNewVersion).toHaveBeenCalledWith(version);
    expect(mockSetHidden).toHaveBeenCalledWith(false);
  });

  it("confirmRemovePin clears version and shows modal", () => {
    // Act
    const { result } = renderHook(() => useConfirmationModal(), { wrapper });
    result.current.confirmRemovePin();

    // Assert
    expect(mockSetNewVersion).toHaveBeenCalledWith(null);
    expect(mockSetHidden).toHaveBeenCalledWith(false);
  });
});
