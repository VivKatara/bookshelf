import { useQuery } from "@apollo/react-hooks";
import { CHECK_USERNAME_QUERY } from "../graphql/queries";
import { useEffect } from "react";

export const useUsernameValidityCheck = (
  username: string,
  setValidUsername: any
): void => {
  const { loading, error, data } = useQuery(CHECK_USERNAME_QUERY, {
    variables: { username },
  });
  useEffect(() => {
    if (error) setValidUsername(false);
    else if (data) setValidUsername(data.userExists);
  }, [loading, error, data]);
};
