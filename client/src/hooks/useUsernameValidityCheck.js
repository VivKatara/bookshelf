import { useEffect } from "react";
import axios from "axios";

export function useUsernameValidityCheck(username, setValidUsername) {
  useEffect(() => {
    async function checkUsername() {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/checkUsername",
          { params: { username } }
        );
        // Assuming here that we got a success(200) -> anything between 200 - 300 axios by default treats as success
        setValidUsername(true);
      } catch (e) {
        console.log("Username could not be found");
        setValidUsername(false);
      }
    }
    checkUsername();
  }, [username]);
}
