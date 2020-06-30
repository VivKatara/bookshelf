import { useEffect, Dispatch } from "react";
import axios from "axios";

export const useUsernameValidityCheck = (
  username: string,
  setValidUsername: any
): void => {
  useEffect(() => {
    async function checkUsername(): Promise<void> {
      try {
        await axios.get("http://localhost:5000/user/checkUsername", {
          params: { username },
        });
        // Assuming here that we got a success(200) -> anything between 200 - 300 axios by default treats as success
        setValidUsername(true);
      } catch (e) {
        console.log("Username could not be found");
        setValidUsername(false);
      }
    }
    checkUsername();
  }, [username]);
};
