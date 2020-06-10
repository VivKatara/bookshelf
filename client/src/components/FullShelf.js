import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import AddBookModal from "./AddBookModal";
import Shelf from "./Shelf";

const initialState = {
  firstShelfIsbn: [],
  secondShelfIsbn: [],
  thirdShelfIsbn: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIRST":
      return {
        ...state,
        firstShelfIsbn: action.payload.firstShelf,
      };
    case "UPDATE_FIRST_TWO": {
      return {
        ...state,
        firstShelfIsbn: action.payload.firstShelf,
        secondShelfIsbn: action.payload.secondShelf,
      };
    }
    case "UPDATE_ALL_THREE": {
      return {
        ...state,
        firstShelfIsbn: action.payload.firstShelf,
        secondShelfIsbn: action.payload.secondShelf,
        thirdShelfIsbn: action.payload.thirdShelf,
      };
    }
    default:
      return state;
  }
};

function FullShelf(props) {
  const shelf = `${props.match.params.type}Books`;
  const [show, setModal] = useState(false);
  const [shelfUpdates, setShelfUpdates] = useState(0);
  const [shelfState, dispatch] = useReducer(reducer, initialState);

  const showModal = () => {
    console.log("Firing");
    setModal(true);
  };

  const hideModal = () => {
    setModal(false);
  };

  const handleShelfUpdate = (shelf) => {
    setShelfUpdates((prev) => prev + 1);
  };

  useEffect(() => {
    async function getIsbns() {
      const response = await axios.get("http://localhost:5000/book/getBooks", {
        params: { shelf },
        withCredentials: true,
      });
      if (response.data.isbn.length <= 7) {
        const firstShelfIsbn = response.data.isbn;
        dispatch({
          type: "UPDATE_FIRST",
          payload: { firstShelf: firstShelfIsbn },
        });
      } else if (response.data.isbn.length <= 14) {
        const firstShelfIsbn = response.data.isbn.slice(0, 7);
        const secondShelfIsbn = response.data.isbn.slice(7);
        dispatch({
          type: "UPDATE_FIRST_TWO",
          payload: { firstShelf: firstShelfIsbn, secondShelf: secondShelfIsbn },
        });
      } else {
        // Assuming pagination on server of up to 18 returned books at once, it must be the case that the response has greater than 12 and <= 18 items
        const firstShelfIsbn = response.data.isbn.slice(0, 7);
        const secondShelfIsbn = response.data.isbn.slice(7, 14);
        const thirdShelfIsbn = response.data.isbn.slice(14);
        dispatch({
          type: "UPDATE_ALL_THREE",
          payload: {
            firstShelf: firstShelfIsbn,
            secondShelf: secondShelfIsbn,
            thirdShelf: thirdShelfIsbn,
          },
        });
      }
    }
    getIsbns();
  }, [shelfUpdates]);

  return (
    <MainContainer>
      {show && (
        <AddBookModal
          show={show}
          handleClose={hideModal}
          shelfUpdate={handleShelfUpdate}
          shelf={shelf}
        />
      )}
      <Add onClick={showModal}>Add Book to Shelf</Add>
      <Title>Currently Reading</Title>
      <Shelf isbns={shelfState.firstShelfIsbn} />
      <Shelf isbns={shelfState.secondShelfIsbn} />
      <Shelf isbns={shelfState.thirdShelfIsbn} />
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
