import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";

function FullShelf() {
  return (
    <MainContainer>
      <Header />
      <div></div>
    </MainContainer>
  );
}

export default FullShelf;

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #222222;
`;
