import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

import { MainContainer, CentralDiv, Button } from "../styles/mainPages";

interface Props {}

const LandingPage: React.FC<Props> = () => {
  return (
    <MainContainer>
      <CentralDiv>
        <Title>Bookshelf</Title>
        <Caption>
          <p>
            A virtual bookshelf to share what you’re reading, have read, and
            want to read in the future.
          </p>
        </Caption>
        <NavButtons>
          <Link to="/register">
            <RegisterButton>Register</RegisterButton>
          </Link>
          <Link to="/login">
            <LoginButton>Login</LoginButton>
          </Link>
        </NavButtons>
      </CentralDiv>
    </MainContainer>
  );
};

export default LandingPage;

const Title = styled.h3`
  font-size: 48px;
  margin-top: 50px;
`;

const Caption = styled.div`
  width: 50%;
  min-height: 100px;
  text-align: left;
  font-size: 24px;
  @media (max-width: 500px) {
    width: 80%;
  }
`;

const NavButtons = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  // background-color: yellow;
`;

const RegisterButton = styled(Button)`
  height: 40px;
  width: 100px;
  margin: 10px;
  background-color: #287bf8;
  color: #ffffff;
`;

const LoginButton = styled(RegisterButton)`
  background-color: #ffffff;
  color: #287bf8;
`;
