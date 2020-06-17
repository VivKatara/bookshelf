import React, { useState, useReducer, useEffect, useLocation } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import AddBookModal from "./AddBookModal";
import Shelf from "./Shelf";

// Keep track of array of ISBNs to pass down to shelves
const initialIsbnState = {
  firstShelfIsbn: [],
  secondShelfIsbn: [],
  thirdShelfIsbn: [],
};

const isbnReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_ISBN":
      return {
        ...state,
        firstShelfIsbn: action.payload.firstShelf,
        secondShelfIsbn: action.payload.secondShelf,
        thirdShelfIsbn: action.payload.thirdShelf,
      };
    default:
      return state;
  }
};

// Keep track of various state regarding the current page
const initialPageState = {
  totalPages: 1,
  showPrevious: false,
  showNext: false,
  showPageCount: false,
  shelfTitle: "",
};

const pageReducer = (state, action) => {
  switch (action.type) {
    case "PAGE_MOUNT":
      return {
        ...state,
        totalPages: action.payload.totalPages,
        showPrevious: action.payload.showPrevious,
        showNext: action.payload.showNext,
        showPageCount: action.payload.showPageCount,
        shelfTitle: action.payload.shelfTitle,
      };
    default:
      return state;
  }
};

function FullShelf(props) {
  const username = props.match.params.username;

  const queryString = new URLSearchParams(props.location.search);
  const pageValues = queryString.getAll("page");
  const page = parseInt(pageValues[0]);

  const shelf = `${props.match.params.type}Books`;

  const [shelfState, isbnDispatch] = useReducer(isbnReducer, initialIsbnState);
  const [pageState, pageDispatch] = useReducer(pageReducer, initialPageState);

  // State to handle modal show as well as to render an update in this component if a book is added
  // to the shelf while using the modal
  const [show, setModal] = useState(false);
  const [shelfUpdates, setShelfUpdates] = useState(0);

  // Stae to maintain the displayed page size. Can maneuver it based on the size of viewport
  const [pageSize, setPageSize] = useState(21);

  const [bookModalUpdates, setBookModalUpdates] = useState(0);

  const showModal = () => {
    setModal(true);
  };

  const hideModal = () => {
    setModal(false);
  };

  const handleShelfUpdate = (shelf) => {
    setShelfUpdates((prev) => prev + 1);
  };

  const triggerBookModalUpdate = () => {
    setBookModalUpdates((prev) => prev + 1);
  };

  // This is the effect that updates various pageState such as the total page count and whether or not to show certain buttons
  useEffect(() => {
    async function pageMount() {
      let totalPages = 1;
      const response = await axios.get(
        "http://localhost:5000/book/getTotalPages",
        { params: { username, shelf, pageSize }, withCredentials: true }
      );
      totalPages = response.data.totalPages;

      let shelfTitle = "";
      if (shelf === "currentBooks") {
        shelfTitle = "Currently Reading";
      } else if (shelf === "pastBooks") {
        shelfTitle = "Have Read";
      } else {
        shelfTitle = "Want to Read";
      }

      let showNext = false;
      let showPrevious = false;
      let showPageCount = false;
      if (totalPages > 1) {
        showPageCount = true;
        if (page < totalPages) {
          showNext = true;
        }
        if (page > 1) {
          showPrevious = true;
        }
      }

      const action = {
        type: "PAGE_MOUNT",
        payload: {
          totalPages,
          showPrevious,
          showNext,
          showPageCount,
          shelfTitle,
        },
      };

      pageDispatch(action);
    }
    pageMount();
  }, [shelfUpdates, bookModalUpdates]);

  // This is the effect that tracks which isbn numbers should be passed down to the shelves
  useEffect(() => {
    async function getIsbns() {
      const response = await axios.get("http://localhost:5000/book/getBooks", {
        params: { username, shelf, page, pageSize },
        withCredentials: true,
      });
      const firstShelfIsbn = response.data.isbn.slice(0, pageSize / 3);
      const secondShelfIsbn = response.data.isbn.slice(
        pageSize / 3,
        (pageSize * 2) / 3
      );
      const thirdShelfIsbn = response.data.isbn.slice((pageSize * 2) / 3);
      const action = {
        type: "UPDATE_ISBN",
        payload: {
          firstShelf: firstShelfIsbn,
          secondShelf: secondShelfIsbn,
          thirdShelf: thirdShelfIsbn,
        },
      };
      isbnDispatch(action);
    }
    getIsbns();
  }, [shelfUpdates, bookModalUpdates]);

  return (
    <MainContainer>
      {pageState.showPageCount && (
        <PageCount>
          Page {page} of {pageState.totalPages}
        </PageCount>
      )}
      {show && (
        <AddBookModal
          show={show}
          handleClose={hideModal}
          shelfUpdate={handleShelfUpdate}
          shelf={shelf}
        />
      )}
      <Add onClick={showModal}>Add Book to Shelf</Add>
      <Title>{pageState.shelfTitle}</Title>
      <Shelf
        isbns={shelfState.firstShelfIsbn}
        shelf={shelf}
        handleModalUpdate={triggerBookModalUpdate}
      />
      {pageState.showPrevious && (
        <PreviousButton href={`${props.match.url}?page=${page - 1}`}>
          Previous
        </PreviousButton>
      )}
      <Shelf
        isbns={shelfState.secondShelfIsbn}
        shelf={shelf}
        handleModalUpdate={triggerBookModalUpdate}
      />
      {pageState.showNext && (
        <NextButton href={`${props.match.url}?page=${page + 1}`}>
          Next
        </NextButton>
      )}
      <Shelf
        isbns={shelfState.thirdShelfIsbn}
        shelf={shelf}
        handleModalUpdate={triggerBookModalUpdate}
      />
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

const PageCount = styled.p`
  position: absolute;
  margin-left: 5%;
  color: #287bf8;
`;

export const Add = styled.a`
  margin-top: 20px;
  margin-left: 80%;
  color: #287bf8;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Title = styled.p`
  position: absolute;
  color: white;
  font-size: 14px;
  margin-left: 10%;
  margin-top: 50px;
`;

const PreviousButton = styled.a`
  position: absolute;
  margin-left: 2%;
  margin-top: 450px;
  cursor: pointer;
  color: #287bf8;
  font-size: 16px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const NextButton = styled.a`
  position: absolute;
  margin-left: 95%;
  margin-top: 450px;
  cursor: pointer;
  color: #287bf8;
  font-size: 16px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
