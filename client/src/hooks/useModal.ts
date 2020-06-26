import { useState } from "react";
import { ModalHook } from "../types/ModalHook";

export const useModal = (): ModalHook => {
  const [show, setModal] = useState(false);

  const toggleModal: ModalHook[1] = () => {
    setModal((prev) => !prev);
  };

  return [show, toggleModal];
};
