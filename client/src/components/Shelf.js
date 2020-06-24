import React from "react";
import styled from "@emotion/styled";
import Book from "./Book";

export const ShelfContext = React.createContext();

function Shelf(props) {
  const { isbns, shelf, children, handleModalUpdate } = props;
  const books = isbns.map((isbn) => (
    <Book key={isbn} isbn={isbn} handleModalUpdate={handleModalUpdate} />
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
  height: 200px;
  // margin-top: 20px;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid white;
  // background-color: white;
`;

const ShelfItems = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  // background-color: yellow;
`;
