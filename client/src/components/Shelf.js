import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import Book from "./Book";

export const ShelfContext = React.createContext();

function Shelf(props) {
  const { isbns, shelf, children } = props;
  const books = isbns.map((isbn) => (
    <Book key={isbn} isbn={isbn} shelf={shelf} />
  ));

  return (
    <ShelfContainer>
      <ShelfItems>
        <ShelfContext.Provider value={shelf}>
          {books}
          {children}
        </ShelfContext.Provider>
      </ShelfItems>
    </ShelfContainer>
  );
}

export default React.memo(Shelf);

const ShelfContainer = styled.div`
  width: 80%;
  height: 235px;
  // margin-top: 20px;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid white;
  // background-color: red;
`;

const ShelfTitle = styled.div`
  // margin-top: 20px;
  font-size: 14px;
  color: #ffffff;
  // background-color: black;
`;

const ShelfItems = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  // background-color: yellow;
`;
const Links = styled.div`
  position: absolute;
  width: 10%;
  display: flex;
  flex-direction: column;
  margin-left: 70%;
  margin-top: 20px;
  color: #287bf8;
  text-align: center;
  // background-color: white;
`;

const Add = styled.a`
  &:hover {
    cursor: pointer;
  }
`;

const SeeAll = styled.a`
  margin-top: 140px;
  &:hover {
    cursor: pointer;
  }
`;
