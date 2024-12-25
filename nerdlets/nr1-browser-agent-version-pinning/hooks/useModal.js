import { useContext } from "react";
import { ModalContext } from "../context";

export default function useModal() {
  const { setNewVersion, setHidden } = useContext(ModalContext);

  const openModal = (version) => {
    setNewVersion(version);
    setHidden(false);
  };

  return { openModal };
}
