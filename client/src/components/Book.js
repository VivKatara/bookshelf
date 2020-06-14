import React, { useState, useReducer, useEffect, useRef } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import BookModal from "./BookModal";

const initialState = {
  foundBook: false,
  title: "",
  authors: [],
  coverImage: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FOUND_BOOK": {
      return {
        ...state,
        foundBook: action.payload.foundBook,
        title: action.payload.title,
        authors: action.payload.authors,
        coverImage: action.payload.coverImage,
      };
    }
  }
};

function Book(props) {
  const { isbn, handleModalUpdate } = props;
  const [bookState, dispatch] = useReducer(reducer, initialState);
  const [show, setShowModal] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    async function getImage() {
      const response = await axios.get(
        "http://localhost:5000/book/getBookDetails",
        {
          params: { isbn },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch({
          type: "FOUND_BOOK",
          payload: {
            foundBook: true,
            title: response.data.title,
            authors: response.data.authors,
            coverImage: response.data.coverImage,
          },
        });
      }
    }
    getImage();
  }, [isbn]);

  const changeModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <>
      <BookContainer ref={buttonRef} onClick={changeModal}>
        {bookState.foundBook && (
          <img
            src={bookState.coverImage}
            alt={bookState.title}
            width="120"
            height="160"
          ></img>
        )}
      </BookContainer>
      {show && (
        <BookModal
          isbn={isbn}
          title={bookState.title}
          authors={bookState.authors}
          description="Description is yet to come"
          handleClose={changeModal}
          buttonRef={buttonRef}
          handleModalUpdate={handleModalUpdate}
        />
      )}
    </>
  );
}

export default React.memo(Book);

const BookContainer = styled.div`
  width: 120px;
  height: 160px;
  margin-top: 20px;
  margin-left: 25px;
  // background-color: blue;

  &:hover {
    cursor: pointer;
  }
`;
