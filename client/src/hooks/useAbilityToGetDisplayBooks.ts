import { useEffect, Dispatch } from "react";
import axios from "axios";
import { HomepageIsbnType, HomepageActionTypes } from "../types/actions";

export const useAbilityToGetDisplayBooks = async (
  username: string,
  validUsername: boolean | null,
  shelf: string,
  dispatch: Dispatch<HomepageActionTypes>,
  type: HomepageIsbnType,
  shelfUpdates: number,
  bookModalUpdates: number
) => {
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
        dispatch({ type, payload: { isbns: response.data.isbn.slice(0, 6) } });
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
};
