import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

type Props = {};

const AuthLinks: FunctionComponent<Props> = (props) => {
  return (
    <AuthLinksContainer>
      <SignUp href="/register">Sign Up</SignUp>/
      <Login href="/login">Login</Login>
    </AuthLinksContainer>
  );
};

export default React.memo(AuthLinks);

export const AuthLinksContainer = styled.div`
  margin-top: 20px;
  margin-left: auto;
  margin-right: 11%;
  flex-direction: row;
  align-items: flex-start;
  color: white;
  // background-color: white;
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
