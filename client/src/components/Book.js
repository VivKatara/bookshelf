import React, { useReducer, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";

const initialState = {
  foundBook: false,
  coverImage: "",
  title: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FOUND_BOOK": {
      return {
        ...state,
        foundBook: action.payload.foundBook,
        coverImage: action.payload.coverImage,
        title: action.payload.title,
      };
    }
  }
};

function Book(props) {
  const [bookState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getImage() {
      const response = await axios.get("http://localhost:5000/book/getCover", {
        params: { isbn: props.isbn },
        withCredentials: true,
      });
      if (response.status === 200) {
        dispatch({
          type: "FOUND_BOOK",
          payload: {
            foundBook: true,
            coverImage: response.data.coverImage,
            title: response.data.title,
          },
        });
      }
    }
    getImage();
  }, []);
  return (
    <BookContainer>
      {bookState.foundBook && (
        <img
          src={bookState.coverImage}
          alt={bookState.title}
          width="120"
          height="160"
        ></img>
      )}
    </BookContainer>
  );
}

export default React.memo(Book);

const BookContainer = styled.div`
  width: 120px;
  height: 150px;
  margin-top: 20px;
  margin-left: 25px;
  background-color: blue;
`;
