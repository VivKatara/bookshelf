import { useEffect } from "react";
import axios from "axios";

export function useUsernameValidityCheck(username, callback) {
  const setValidUsername = callback;
  useEffect(() => {
    async function checkUsername() {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/checkUsername",
          { params: { username } }
        );
        if (response.status === 200) setValidUsername(true);
      } catch (e) {
        console.log("Username could not be found");
      }
    }
    checkUsername();
  }, [username]);
}
