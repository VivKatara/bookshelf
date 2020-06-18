import React, { useState, useReducer, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import Shelf from "./Shelf";
import Loading from "./Loading";
import NotFound from "./NotFound";
import NotLoggedInHeader from "./headers/NotLoggedInHeader";
import AddBookModal from "./modals/AddBookModal";
import AddBookLink from "./links/AddBookLink";
import AuthLinks from "./links/AuthLinks";
import NextPreviousNavigation from "./links/NextPreviousNavigation";

import { useUsernameValidityCheck } from "../hooks/useUsernameValidityCheck";
import { useModal } from "../hooks/useModal";
import { useBookModalUpdates } from "../hooks/useBookModalUpdates";

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
  // Acquire the username from route parameters and check if it is valid
  const username = props.match.params.username;
  const [validUsername, setValidUsername] = useState(null);
  useUsernameValidityCheck(username, setValidUsername);

  // Get shelf from the url
  const shelf = `${props.match.params.type}Books`;

  // Get page number from query string parameter
  const queryString = new URLSearchParams(props.location.search);
  const pageValues = queryString.getAll("page");
  const page = parseInt(pageValues[0]);
  const [pageSize, setPageSize] = useState(21);

  const [shelfState, isbnDispatch] = useReducer(isbnReducer, initialIsbnState);
  const [pageState, pageDispatch] = useReducer(pageReducer, initialPageState);

  // State to handle modal, will be updated if there is a shelf Update
  const [show, toggleModal] = useModal();
  const [shelfUpdates, setShelfUpdates] = useState(0);
  const buttonRef = useRef(null);

  // State to manage updates triggered by the book modal
  const [bookModalUpdates, triggerBookModalUpdate] = useBookModalUpdates();

  const handleShelfUpdate = (shelf) => {
    setShelfUpdates((prev) => prev + 1);
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

  //TODO Make a nice Loading component
  if (validUsername === null) {
    return <Loading />;
  } else if (validUsername) {
    return (
      <>
        {!props.isLoggedIn && <NotLoggedInHeader username={username} />}
        <MainContainer>
          {pageState.showPageCount && (
            <PageCount>
              Page {page} of {pageState.totalPages}
            </PageCount>
          )}
          {show && (
            <AddBookModal
              buttonRef={buttonRef}
              handleClose={toggleModal}
              shelfUpdate={handleShelfUpdate}
              shelf={shelf}
            />
          )}
          {props.isLoggedIn ? (
            <AddBookLink buttonRef={buttonRef} toggleModal={toggleModal} />
          ) : (
            <AuthLinks />
          )}
          <CentralDiv>
            <Title>{pageState.shelfTitle}</Title>
            <Shelf
              isbns={shelfState.firstShelfIsbn}
              shelf={shelf}
              handleModalUpdate={triggerBookModalUpdate}
            />
            <Space />
            <Shelf
              isbns={shelfState.secondShelfIsbn}
              shelf={shelf}
              handleModalUpdate={triggerBookModalUpdate}
            />
            <Space />
            <Shelf
              isbns={shelfState.thirdShelfIsbn}
              shelf={shelf}
              handleModalUpdate={triggerBookModalUpdate}
            />
            <NextPreviousNavigation
              prev={pageState.showPrevious}
              next={pageState.showNext}
              url={props.match.url}
              page={page}
            />
          </CentralDiv>
        </MainContainer>
      </>
    );
  } else {
    return <NotFound />;
  }
}

FullShelf.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.userState.isLoggedIn,
});

export default connect(mapStateToProps, {})(FullShelf);

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #222222;
`;

export const CentralDiv = styled.div`
  display: flex;
  flex-direction: column;
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
  position: relative;
  margin-left: 10%;
  font-size: 14px;
  color: white;
`;

const Space = styled.div`
  flex-basis: 45px;
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
