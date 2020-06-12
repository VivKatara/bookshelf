import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { MainModal } from "./AddBookModal";
import Book from "./Book";

const initialState = {
  shelf: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SHELF":
      return {
        ...state,
        shelf: action.payload,
      };
    default:
      return state;
  }
};

function NewBookModal(props) {
  const { title, authors, description, isbn, shelf } = props;
  const [initialDisplayState, setInitialDisplayState] = useState(false);
  const [currentDisplayState, setCurrentDisplayState] = useState(false);
  const [shelfState, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getDisplay() {
      const response = await axios.get(
        "http://localhost:5000/book/getBookDisplay",
        {
          params: { isbn, shelf },
          withCredentials: true,
        }
      );
      const responseDisplay = response.data.display;
      // This means that the responseDisplay was true and initialState should be set to true;
      if (responseDisplay !== initialDisplayState) {
        setInitialDisplayState(responseDisplay);
        setCurrentDisplayState(responseDisplay);
      }
    }
    getDisplay();
    dispatch({ type: "UPDATE_SHELF", payload: shelf });
  }, []);

  const handleCheckChange = (event) => {
    setCurrentDisplayState(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitting");
    // Changing the displayState on the current shelf
    if (currentDisplayState !== initialDisplayState) {
      const desiredDisplay = currentDisplayState;
      const response = await axios.post(
        "http://localhost:5000/book/changebookDisplay",
        { isbn, shelf, desiredDisplay },
        { withCredentials: true }
      );
      setInitialDisplayState(currentDisplayState);
    }

    // Wanting to change shelves
    if (shelfState.shelf !== shelf) {
      const response = await axios.delete(
        "http://localhost:5000/book/deleteFromShelf",
        { isbn, shelf },
        { withCredentials: true }
      );
    }

    console.log(shelf);
    console.log(shelfState.shelf);
    // if (currentDisplayState !== initialDisplayState) {
    //   const desiredDisplay = currentDisplayState;
    //   const response = await axios.post(
    //     "http://localhost:5000/book/changeBookDisplay",
    //     { isbn, shelf, desiredDisplay },
    //     { withCredentials: true }
    //   );
    // }

    // Now to handle the form
  };
  console.log("In the new modal");

  return (
    <MainModal>
      <BookDescription>
        <BookDescriptionDiv>
          <Label>Title:</Label>
          <Value>{title}</Value>
        </BookDescriptionDiv>
        <BookDescriptionDiv>
          <Label>Author(s):</Label>
          <Value>{authors}</Value>
        </BookDescriptionDiv>
        <BookDescriptionDiv>
          <Label>Description:</Label>
          <Value>{description}</Value>
        </BookDescriptionDiv>
      </BookDescription>
      <BookSettingsForm onSubmit={handleSubmit}>
        <FormDiv>
          <SettingsLabel>Shelf Settings</SettingsLabel>
        </FormDiv>
        <FormDiv>
          <Label>Shelf:</Label>
          <Select
            id="shelf"
            name="shelf"
            value={shelfState.shelf}
            onChange={(e) =>
              dispatch({ type: "UPDATE_SHELF", payload: e.target.value })
            }
          >
            <option value="currentBooks">Currently Reading</option>
            <option value="pastBooks">Have Read</option>
            <option value="futureBooks">Want to Read</option>
            <option value="delete">None (aka delete this book)</option>
          </Select>
        </FormDiv>
        <FormDiv>
          <Label>Display on homepage:</Label>
          <Checkbox
            type="checkbox"
            checked={currentDisplayState}
            onChange={handleCheckChange}
          ></Checkbox>
        </FormDiv>
        <FormDiv>
          <SaveChangesButton type="Submit">Save Changes</SaveChangesButton>
        </FormDiv>
      </BookSettingsForm>
    </MainModal>
  );
}

export default NewBookModal;

export const BookDescription = styled.div`
  // display: flex;
  // flex-direction: column;
  // background-color: blue;
  // overflow: auto;
`;

export const BookDescriptionDiv = styled.div`
  display: flex;
  flex-direction: row;
  // background-color: red;
  // overflow: auto;
`;

export const Label = styled.p`
  color: white;
  margin-left: 10%;
`;

export const Value = styled.p`
  position: relative;
  margin-right: 10%;
  margin-left: 2%;
  color: white;
  // background-color: green;
`;

export const BookSettingsForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormDiv = styled.div`
  display: flex;
  flex-direction: row;
  // background-color: red;
  // flex-wrap: wrap;
`;

export const SettingsLabel = styled.p`
  color: #287bf8;
  margin-left: 10%;
`;

export const Select = styled.select`
  position: absolute;
  margin-left: 25%;
  margin-top: 10px;
  width: 300px;
  height: 30px;
  border: none;
  border-radius: 5px;
  padding; 5px;
`;

export const Checkbox = styled.input`
  position: absolute;
  margin-left: 40%;
  margin-top: 15px;
  outline: none;
  height: 20px;
  width: 20px;
  border-radius: 10px;
`;

export const SaveChangesButton = styled.button`
  width: 300px;
  height: 30px;
  margin-left: 25%;
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background-color: #287bf8;
  color: white;
`;
