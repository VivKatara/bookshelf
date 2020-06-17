import React, { useState, useReducer, useEffect, useRef } from "react";
import axios from "axios";
import { useOutsideClick } from "../hooks/useOutsideClick";
import styled from "@emotion/styled";
import {
  Form,
  FormHeader,
  Label,
  Input,
  SubmitButton,
} from "../styles/authForms";

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
  const { buttonRef, handleClose, shelfUpdate, shelf } = props;
  const [shelfTitle, setShelfTitle] = useState("");
  const [newBookState, dispatch] = useReducer(reducer, initialState);
  const modalRef = useRef(null);
  useOutsideClick(modalRef, buttonRef, handleClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Going to need the middleware to essentially check if token is expired and replace the token if so
    try {
      const response = await axios.post(
        "http://localhost:5000/book/add",
        {
          title: newBookState.title,
          author: newBookState.author,
          shelf: newBookState.shelf,
        },
        {
          withCredentials: true,
        }
      );
      shelfUpdate(newBookState.shelf);
      handleClose();
    } catch (e) {
      console.log(e);
    }
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
    <MainModal ref={modalRef}>
      <CloseButton onClick={handleClose}>X</CloseButton>
      <Form onSubmit={handleSubmit}>
        <FormDiv>
          <FormHeader>Add a Book to one of your Shelves</FormHeader>
        </FormDiv>
        <FormDiv>
          <Label>Title</Label>
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
          <Label>Author</Label>
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
          <Label>Shelf</Label>
          <Select
            id="shelf"
            name="shelf"
            value={newBookState.shelf}
            onChange={(e) =>
              dispatch({ type: "UPDATE_SHELF", payload: e.target.value })
            }
          >
            {shelfOptions}
          </Select>
        </FormDiv>
        <FormDiv>
          <SubmitButton type="Submit">Add</SubmitButton>
        </FormDiv>
      </Form>
    </MainModal>
  );
}

export default AddBookModal;

export const MainModal = styled.div`
  width: 50%;
  height: 50%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  background-color: #333333;
  z-index: 1;

  @media (max-width: 700px) {
    width: 90%;
  }
`;

const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  // background-color: green;
  color: white;
`;

const Select = styled.select`
  height: 25px;
  width: 290px;
  border: none;
  border-radius: 5px;
  padding: 2px;
  margin-top: 10px;

  @media (max-width: 400px) {
    width: 200px;
  }
`;

const CloseButton = styled.button`
  margin-left: auto;
  border: none;
  outline: none;
  color: white;
  background-color: #333333;
  &:hover {
    cursor: pointer;
    color: #287bf8;
  }
`;
