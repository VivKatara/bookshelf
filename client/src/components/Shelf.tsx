import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";
import Book from "./Book";

export const ShelfContext = React.createContext("");

type Props = {
  shelfBooks: any;
  shelf: string;
  children?: React.ReactNode;
  handleModalUpdate: () => void;
};

const Shelf: FunctionComponent<Props> = (props) => {
  const { shelfBooks, shelf, children, handleModalUpdate } = props;
  const books = shelfBooks.map((shelfBook: any) => (
    <Book
      key={shelfBook.details.isbn}
      display={shelfBook.display}
      title={shelfBook.details.title}
      authors={shelfBook.details.authors}
      isbn={shelfBook.details.isbn}
      description={shelfBook.details.description}
      coverImage={shelfBook.details.coverImage}
      handleModalUpdate={handleModalUpdate}
    />
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
};

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
