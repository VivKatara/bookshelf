import { useState } from "react";
import { BookModalUpdatesHook } from "../types/hooks";

export const useBookModalUpdates = (): BookModalUpdatesHook => {
  const [bookModalUpdates, setBookModalUpdates] = useState(0);

  const triggerBookModalUpdate: BookModalUpdatesHook[1] = () => {
    setBookModalUpdates((prev) => prev + 1);
  };

  return [bookModalUpdates, triggerBookModalUpdate];
};
