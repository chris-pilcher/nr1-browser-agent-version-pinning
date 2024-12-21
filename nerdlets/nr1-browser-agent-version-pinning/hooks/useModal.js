import { useContext } from "react";
import { ModalContext } from "../context";

export function useModal() {
  return useContext(ModalContext);
}
