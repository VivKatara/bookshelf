import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { Form, Input } from "./Login";

const initialState = {
  title: "",
  author: "",
  shelf: "currentBooks",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TITLE":
      return {
        ...state,
        title: action.payload,
      };
    case "UPDATE_AUTHOR":
      return {
        ...state,
        author: action.payload,
      };
    case "UPDATE_SHELF":
      return {
        ...state,
        shelf: action.payload,
      };
    default:
      return state;
  }
};

function AddBookModal(props) {
  const { show, handleClose, shelfUpdate, shelf } = props;
  const [shelfTitle, setShelfTitle] = useState("");
  const [newBookState, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Going to need the middleware to essentially check if token is expired and replace the token if so
    axios
      .get("http://localhost:5000/book/add", {
        params: {
          title: newBookState.title,
          author: newBookState.author,
          shelf: newBookState.shelf,
        },
        withCredentials: true,
      })
      .then((res) => {
        shelfUpdate(newBookState.shelf);
        return console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (shelf) {
      dispatch({ type: "UPDATE_SHELF", payload: shelf });
      if (shelf === "currentBooks") {
        setShelfTitle("Currently Reading");
      } else if (shelf === "pastBooks") {
        setShelfTitle("Have Read");
      } else {
        setShelfTitle("Want to Read");
      }
    }
  }, []);

  // Note that shelf prop isn't passed down from Homepage, only from Full Shelf view
  const shelfOptions = shelf ? (
    <option value={shelf}>{shelfTitle}</option>
  ) : (
    <>
      <option value="currentBooks">Currently Reading</option>
      <option value="pastBooks">Have Read</option>
      <option value="futureBooks">Want to Read</option>
    </>
  );

  return (
    show && (
      <MainModal>
        <CloseButton onClick={handleClose}>X</CloseButton>
        <Form onSubmit={handleSubmit}>
          <FormDiv>
            <h3>Add a Book to one of your Shelves</h3>
          </FormDiv>
          <FormDiv>
            <label>Title</label>
            <Input
              type="text"
              name="title"
              id="title"
              value={newBookState.title}
              onChange={(e) =>
                dispatch({ type: "UPDATE_TITLE", payload: e.target.value })
              }
            />
          </FormDiv>
          <FormDiv>
            <label>Author</label>
            <Input
              type="text"
              name="author"
              id="author"
              value={newBookState.author}
              onChange={(e) =>
                dispatch({ type: "UPDATE_AUTHOR", payload: e.target.value })
              }
            />
          </FormDiv>
          <FormDiv>
            <label>Shelf</label>
            <Select
              id="shelf"
              name="shelf"
              value={newBookState.shelf}
              onChange={(e) =>
                dispatch({ type: "UPDATE_SHELF", payload: e.target.value })
              }
            >
              {shelfOptions}
              {/* <option value="currentBooks">Currently Reading</option>
              <option value="pastBooks">Have Read</option>
              <option value="futureBooks">Want to Read</option> */}
            </Select>
          </FormDiv>
          <FormDiv>
            <SubmitButton type="Submit">Add</SubmitButton>
          </FormDiv>
        </Form>
      </MainModal>
    )
  );
}

export default AddBookModal;

const MainModal = styled.div`
  position: fixed;
  background-color: #333333;
  min-width: 50%;
  max-width: 50%;
  min-height: 50%;
  max-height: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  color: white;
`;

const Select = styled.select`
  height: 25px;
  width: 290px;
  border: none;
  border-radius: 5px;
  padding: 2px;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  height: 30px;
  width: 300px;
  margin-top: 20px;
  outline: none;
  border: none;
  border-radius: 10px;
  text-align: center;
  background-color: #287bf8;
  color: #ffffff;

  &:hover {
    cursor: pointer;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  width: 5%;
  margin-top: 5px;
  margin-left: 95%;
  border: none;
  outline: none;
  color: white;
  background-color: #333333;
  &:hover {
    cursor: pointer;
    color: #287bf8;
  }
`;
