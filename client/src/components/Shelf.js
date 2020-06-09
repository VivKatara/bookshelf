import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import Book from "./Book";

function Shelf(props) {
  const [isbns, setIsbns] = useState([]);
  const { updates } = props;
  useEffect(() => {
    async function getIsbns() {
      const response = await axios.get(
        "http://localhost:5000/book/getBooks",
        {
          params: { shelf: props.shelfType },
          withCredentials: true,
        },
        []
      );
      setIsbns(response.data.isbn);
    }
    getIsbns();
  }, [updates]);

  const books = isbns.map((isbn) => <Book key={isbn} isbn={isbn} />);
  return (
    <ShelfContainer>
      <ShelfTitle>
        <p>{props.shelfName}</p>
      </ShelfTitle>
      <ShelfItems>
        {books}
        <Links>
          <SeeAll onClick={() => console.log("Yes")}>See All</SeeAll>
        </Links>
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
  // background-color: yellow;
`;
const Links = styled.div`
  width: 10%;
  display: flex;
  flex-direction: column;
  margin-left: 10%;
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
