import { useContext } from "react";
import { ModalContext } from "../context";

export default function useModal() {
  // TODO: Consider only returning the "openModal" (and possibly "closeModal") functions
  return useContext(ModalContext);
}
