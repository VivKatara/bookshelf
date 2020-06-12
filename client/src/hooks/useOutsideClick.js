import { useEffect } from "react";

export function useOutsideClick(modalRef, buttonRef, handleEvent) {
  // In order to use the callback function to call on the outside click event, we have to declare it in this scope
  const callback = handleEvent;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [modalRef]);
}
