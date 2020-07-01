import React, { FunctionComponent } from "react";
import {
  HeaderContainer,
  HyperLink,
  User,
  Username,
  Profile,
} from "../../styles/headers";
import { useQuery } from "@apollo/react-hooks";
import { GET_USER_FULL_NAME } from "../../graphql/queries";

type Props = {
  username: string;
};

const NotLoggedInHeader: FunctionComponent<Props> = (props) => {
  const { username } = props;
  const { loading, error, data } = useQuery(GET_USER_FULL_NAME, {
    variables: { username },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error...</h1>;

  // Safe to assume here that data must be good
  return (
    <HeaderContainer>
      <HyperLink href="/">
        <p>Bookshelf</p>
      </HyperLink>
      <User>
        <Username>{data.user.fullName}</Username>
        <Profile>{data.user.fullName[0]}</Profile>
      </User>
    </HeaderContainer>
  );
};

export default React.memo(NotLoggedInHeader);
