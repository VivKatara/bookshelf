import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";

function Book(props) {
  const [foundBook, setFoundBook] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    async function getImage() {
      const response = await axios.get("http://localhost:5000/book/getCover", {
        params: { isbn: props.isbn },
        withCredentials: true,
      });
      if (response.status === 200) {
        setFoundBook(true);
        setCoverImage(response.data.coverImage);
        setTitle(response.data.title);
      }
    }
    getImage();
  }, []);
  return (
    <BookContainer>
      {foundBook && (
        <img src={coverImage} alt={title} width="120" height="160"></img>
      )}
    </BookContainer>
  );
}

export default Book;

const BookContainer = styled.div`
  width: 120px;
  height: 150px;
  margin-top: 20px;
  margin-left: 25px;
  background-color: blue;
`;
