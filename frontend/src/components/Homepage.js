import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";

function Homepage() {
  return (
    <MainContainer>
      <Header />
      <Shelf />
      <Shelf />
      <Shelf />
    </MainContainer>
  );
}

export default Homepage;

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #222222;
`;
