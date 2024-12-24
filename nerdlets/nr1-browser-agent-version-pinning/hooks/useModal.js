import { useContext } from "react";
import { ModalContext } from "../context";

export default function useModal() {
  const { openModal, closeModal } = useContext(ModalContext);
  return { openModal, closeModal };
}
