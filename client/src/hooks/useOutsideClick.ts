import { useEffect } from "react";

export function useOutsideClick(
  modalRef: React.MutableRefObject<HTMLElement | null>,
  buttonRef: React.MutableRefObject<HTMLElement | null>,
  handleEvent: () => void
): void {
  // In order to use the callback function to call on the outside click event, we have to declare it in this scope
  const callback = handleEvent;

  useEffect(() => {
    function handleOutsideClick(event: any): void {
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
