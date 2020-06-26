import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HeaderContainer,
  HyperLink,
  User,
  Username,
  Profile,
} from "../../styles/headers";

interface NotLoggedInProps {
  username: string;
}

const NotLoggedInHeader: React.FC<NotLoggedInProps> = (props) => {
  const { username } = props;
  const [userFullName, setUserFullName] = useState("");

  useEffect(() => {
    async function getUserFullName() {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/getUserFullName",
          { params: { username } }
        );
        setUserFullName(response.data.userFullName);
      } catch (e) {
        // Theoretically we should never come here because Homepage has already checked that the username is valid, and fullName is a required field to user
        console.log(e);
      }
    }
    getUserFullName();
  }, [username]);

  return (
    <HeaderContainer>
      <HyperLink href="/">
        <p>Bookshelf</p>
      </HyperLink>
      <User>
        <Username>{userFullName}</Username>
        <Profile>{userFullName[0]}</Profile>
      </User>
    </HeaderContainer>
  );
};

export default React.memo(NotLoggedInHeader);
