import React from "react";
import styled from "@emotion/styled";

function Book() {
  return <BookContainer />;
}

export default Book;

const BookContainer = styled.div`
  width: 120px;
  height: 150px;
  margin-top: 40px;
  margin-left: 25px;
  background-color: blue;
`;
