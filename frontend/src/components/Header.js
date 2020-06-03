import React from "react";
import styled from "@emotion/styled";

function Header() {
  return (
    <HeaderContainer>
      <HyperLink href="/home">
        <p>Bookshelf</p>
      </HyperLink>
      <User>
        <p>Vivek Katara</p>
      </User>
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.div`
  width: 100%;
  min-height: 50px;
  border-bottom: 1px solid white;
  display: flex;
  flex-direction: row;
  color: #ffffff;
  font-size: 20px;
`;

const HyperLink = styled.a`
  margin-left: 10%;
  color: white;
  text-decoration: none;

  &:hover {
    color: #287bf8;
  }
`;

const User = styled.div`
  margin-left: auto;
  margin-right: 10%;
  //   background-color: green;
`;
