import React from "react";
import styled from "@emotion/styled";
import Book from "./Book";

function Shelf() {
  return (
    <ShelfContainer>
      <ShelfTitle>
        <p>Reading</p>
      </ShelfTitle>
      <Books>
        <Book />
        <Book />
        <Book />
        <Book />
        <Book />
        <Book />
        <Book />
      </Books>
      <Links>
        <Add>Add</Add>
        <SeeAll>See All</SeeAll>
      </Links>
    </ShelfContainer>
  );
}

export default Shelf;

const ShelfContainer = styled.div`
  width: 80%;
  height: 200px;
  margin-top: 50px;
  margin-left: 10%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid white;
`;

const ShelfTitle = styled.div`
  width: 5%;
  color: #ffffff;
`;

const Books = styled.div`
  width: 85%;
  display: flex;
  flex-direction: row;
  //   background-color: yellow;
`;
const Links = styled.div`
  width: 10%;
  color: #287bf8;
  text-align: center;
`;

const Add = styled.p``;

const SeeAll = styled.p`
  margin-top: 130px;
`;
