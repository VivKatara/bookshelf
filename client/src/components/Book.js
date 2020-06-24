import React, { useReducer, useEffect, useRef } from "react";
import axios from "axios";
import styled from "@emotion/styled";

import BookModal from "./modals/BookModal";

import { useModal } from "../hooks/useModal";

const initialState = {
  foundBook: false,
  title: "",
  authors: "",
  description: "",
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
        description: action.payload.description,
        coverImage: action.payload.coverImage,
      };
    }
    default:
      return state;
  }
};

function Book(props) {
  const { isbn, handleModalUpdate } = props;
  const [bookState, dispatch] = useReducer(reducer, initialState);
  const [showModal, toggleModal] = useModal();
  const buttonRef = useRef(null);

  useEffect(() => {
    // Get the details of book with given ISBN
    // TODO Try Catch error logic here
    async function getBookDetails() {
      const response = await axios.get(
        "http://localhost:5000/book/getBookDetails",
        {
          params: { isbn },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        let splitAuthors = response.data.authors;
        if (response.data.authors.length > 1)
          splitAuthors = response.data.authors.join(", ");
        dispatch({
          type: "FOUND_BOOK",
          payload: {
            foundBook: true,
            title: response.data.title,
            authors: splitAuthors,
            description: response.data.description,
            coverImage: response.data.coverImage,
          },
        });
      }
    }
    getBookDetails();
  }, [isbn]);

  return (
    <>
      <BookContainer ref={buttonRef} onClick={toggleModal}>
        {bookState.foundBook && (
          <img
            src={bookState.coverImage}
            alt={bookState.title}
            width="120"
            height="160"
          ></img>
        )}
      </BookContainer>
      {showModal && (
        <BookModal
          isbn={isbn}
          title={bookState.title}
          authors={bookState.authors}
          description={bookState.description}
          handleClose={toggleModal}
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
