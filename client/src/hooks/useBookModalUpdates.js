import { useState } from "react";

export function useBookModalUpdates() {
  const [bookModalUpdates, setBookModalUpdates] = useState(0);

  const triggerBookModalUpdate = () => {
    setBookModalUpdates((prev) => prev + 1);
  };

  return [bookModalUpdates, triggerBookModalUpdate];
}
