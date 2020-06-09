import React, { useReducer } from "react";
import { Form, Input } from "./Login";
import styled from "@emotion/styled";

function AddBookModal(props) {
  const { show, handleClose } = props;
  const initialState = {
    title: "",
    author: "",
    shelf: "current",
  };
  const reducer = (state, action) => {
    console.log("Being called");
    switch (action.type) {
      case "UPDATE_TITLE":
        console.log("title");
        return {
          ...state,
          title: action.payload,
        };
      case "UPDATE_AUTHOR":
        console.log("Author");
        return {
          ...state,
          author: action.payload,
        };
      case "UPDATE_SHELF":
        console.log("Shelf");
        return {
          ...state,
          shelf: action.payload,
        };
      default:
        console.log("Default");
        return state;
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newBookState);
  };

  const [newBookState, dispatch] = useReducer(reducer, initialState);

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
              <option value="current">Currently Reading</option>
              <option value="past">Have Read</option>
              <option value="future">Want to Read</option>
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

// const Input = styled.input`
//   height: 20px;
//   width: 290px;
//   border: none;
//   border-radius: 5px;
//   padding: 2px;
//   margin-top: 10px;
// `;
