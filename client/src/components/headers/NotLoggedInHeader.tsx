import React, { FunctionComponent } from "react";
import {
  HeaderContainer,
  HyperLink,
  User,
  Username,
  Profile,
} from "../../styles/headers";

type Props = {
  username: string;
  fullName: string;
};

const NotLoggedInHeader: FunctionComponent<Props> = (props) => {
  const { username, fullName } = props;

  return (
    <HeaderContainer>
      <HyperLink href="/">
        <p>Bookshelf</p>
      </HyperLink>
      <User>
        <Username>{fullName}</Username>
        <Profile>{fullName[0]}</Profile>
      </User>
    </HeaderContainer>
  );
};

export default React.memo(NotLoggedInHeader);
