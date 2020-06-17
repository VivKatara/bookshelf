import React from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import Register from "./Register";

function LandingPage() {
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
}

export default LandingPage;

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #222222;
`;

const CentralDiv = styled.div`
  width: 50%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  // background-color: blue;
  color: white;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const Title = styled.h3`
  font-size: 48px;
  margin-top: 50px;
`;

const Caption = styled.div`
  width: 50%;
  min-height: 100px;
  text-align: left;
  font-size: 24px;
  // background-color: red;
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

const RegisterButton = styled.button`
  height: 40px;
  width: 100px;
  margin: 10px;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: #287bf8;
  color: #ffffff;
  &:hover {
    cursor: pointer;
  }
`;

const LoginButton = styled(RegisterButton)`
  background-color: #ffffff;
  color: #287bf8;
`;
