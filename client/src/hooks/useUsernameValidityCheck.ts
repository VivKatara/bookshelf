import { useQuery } from "@apollo/react-hooks";
import { CHECK_USERNAME_QUERY } from "../graphql/queries";
import { useEffect } from "react";
import axios from "axios";

export const useUsernameValidityCheck = (
  username: string,
  setValidUsername: any
): void => {
  const { loading, error, data } = useQuery(CHECK_USERNAME_QUERY, {
    variables: { username },
  });
  useEffect(() => {
    if (error) setValidUsername(false);
    if (data && data.userExists) setValidUsername(true);
  }, [loading, error, data]);
  // useEffect(() => {
  //   async function checkUsername(): Promise<void> {
  //     try {
  //       await axios.get("http://localhost:5000/user/checkUsername", {
  //         params: { username },
  //       });
  //       // Assuming here that we got a success(200) -> anything between 200 - 300 axios by default treats as success
  //       setValidUsername(true);
  //     } catch (e) {
  //       console.log("Username could not be found");
  //       setValidUsername(false);
  //     }
  //   }
  //   checkUsername();
  // }, [username]);
};
