import { useContext } from "react";
import { ModalContext } from "../context";

export default function useConfirmationModal() {
  const { setNewVersion, setHidden } = useContext(ModalContext);

  const confirmPin = (version) => {
    setNewVersion(version);
    setHidden(false);
  };

  const confirmRemovePin = () => {
    setNewVersion(null);
    setHidden(false);
  };

  return { confirmPin, confirmRemovePin };
}
