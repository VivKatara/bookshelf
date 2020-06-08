import React from "react";
import styled from "@emotion/styled";
import Book from "./Book";

function Shelf(props) {
  return (
    <ShelfContainer>
      <ShelfTitle>
        <p>{props.shelfName}</p>
      </ShelfTitle>
      <ShelfItems>
        <Book />
        <Book />
        <Book />
        <Book />
        <Book />
        <Book />
        <Book />
        <Links>
          <Add>Add</Add>
          <SeeAll>See All</SeeAll>
        </Links>
      </ShelfItems>
    </ShelfContainer>
  );
}

export default Shelf;

const ShelfContainer = styled.div`
  width: 80%;
  height: 235px;
  margin-top: 10px;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid white;
  // background-color: red;
`;

const ShelfTitle = styled.div`
  margin-top: 20px;
  font-size: 14px;
  color: #ffffff;
  // background-color: black;
`;

const ShelfItems = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  // background-color: yellow;
`;
const Links = styled.div`
  width: 10%;
  margin-left: 10%;
  color: #287bf8;
  text-align: center;
  // background-color: white;
`;

const Add = styled.p``;

const SeeAll = styled.p`
  margin-top: 110px;
`;
