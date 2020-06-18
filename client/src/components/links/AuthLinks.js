import React from "react";
import styled from "@emotion/styled";

function AuthLinks() {
  return (
    <AuthLinksContainer>
      <SignUp href="/register">Sign Up</SignUp>/
      <Login href="/login">Login</Login>
    </AuthLinksContainer>
  );
}

export default AuthLinks;

export const AuthLinksContainer = styled.div`
  margin-left: 80%;
  margin-top: 20px;
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
  color: white;
`;

export const Link = styled.a`
  color: #287bf8;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const SignUp = styled(Link)`
  margin-right: 5px;
`;

export const Login = styled(Link)`
  margin-left: 5px;
`;
