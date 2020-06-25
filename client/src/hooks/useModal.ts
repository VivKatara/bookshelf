import { useState } from "react";

export function useModal() {
  const [show, setModal] = useState(false);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  return [show, toggleModal];
}
