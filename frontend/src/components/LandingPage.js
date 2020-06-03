import React from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

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
  color: white;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 48px;
  margin-top: 50px;
`;

const Caption = styled.div`
  width: 50%;
  min-height: 100px;
  margin-left: auto;
  margin-right: auto;
  font-size: 24px;
  text-align: left;
`;

const NavButtons = styled.div`
  width: 80%;
  min-height: 100px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
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

const LoginButton = styled.button`
  height: 40px;
  width: 100px;
  margin: 10px;
  outline: none;
  border: none;
  border-radius: 10px;
  background-color: #ffffff;
  color: #287bf8;

  &:hover {
    cursor: pointer;
  }
`;
