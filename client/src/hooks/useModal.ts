import { useState } from "react";
import { ModalDisplayHook } from "../types/hooks";

export const useModal = (): ModalDisplayHook => {
  const [show, setModal] = useState(false);

  const toggleModal: ModalDisplayHook[1] = () => {
    setModal((prev) => !prev);
  };

  return [show, toggleModal];
};
