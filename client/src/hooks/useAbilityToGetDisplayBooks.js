import { useEffect } from "react";
import axios from "axios";

export async function useAbilityToGetDisplayBooks(
  username,
  validUsername,
  shelf,
  dispatch,
  type,
  shelfUpdates,
  bookModalUpdates
) {
  useEffect(() => {
    async function getBookIsbns() {
      try {
        const response = await axios.get(
          "http://localhost:5000/book/getDisplayBooks",
          {
            params: { username, shelf },
            withCredentials: true,
          }
        );
        dispatch({ type, payload: response.data.isbn.slice(0, 6) });
      } catch (e) {
        console.log(
          `Failed at getting books for the following shelf: ${shelf}`
        );
        console.log(e);
      }
    }
    if (validUsername) {
      getBookIsbns();
    }
  }, [username, validUsername, shelfUpdates, bookModalUpdates]);
}
