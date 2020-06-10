import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";

function FullShelf() {
  const [isbns, setIsbns] = useState([]);
  const shelf = "currentBooks";
  useEffect(() => {
    async function getIsbns() {
      const response = await axios.get("http://localhost:5000/book/getBooks", {
        params: { shelf },
        withCredentials: true,
      });
      setIsbns(response.data.isbn);
    }
    getIsbns();
  });
  return (
    <MainContainer>
      <Shelf isbns={isbns} />
      <Shelf isbns={isbns} />
      <Shelf isbns={isbns} />
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
