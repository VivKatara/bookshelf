import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  useRef,
} from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import axios from "axios";
import styled from "@emotion/styled";
import { MainModal } from "./AddBookModal";
import { ShelfContext } from "./Shelf";

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
  const {
    title,
    authors,
    description,
    isbn,
    handleClose,
    buttonRef,
    handleModalUpdate,
  } = props;
  const [initialDisplayState, setInitialDisplayState] = useState(false);
  const [currentDisplayState, setCurrentDisplayState] = useState(false);
  const [shelfState, dispatch] = useReducer(reducer, initialState);
  const modalRef = useRef(null);
  useOutsideClick(modalRef, buttonRef, handleClose);

  const shelf = useContext(ShelfContext);

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
    let change = false;
    // Changing the displayState on the current shelf
    if (currentDisplayState !== initialDisplayState) {
      change = true;
      const desiredDisplay = currentDisplayState;
      const response = await axios.post(
        "http://localhost:5000/book/changebookDisplay",
        { isbn, shelf, desiredDisplay },
        { withCredentials: true }
      );
      setInitialDisplayState(currentDisplayState);
    }

    // If there's a shelf change, delete the book
    if (shelfState.shelf !== shelf) {
      change = true;
      const response = await axios.delete(
        "http://localhost:5000/book/deleteFromShelf",
        { params: { isbn, shelf }, withCredentials: true }
      );

      // There's been a shelf change, and it's not a delete, so add the book to the new list
      if (shelfState.shelf !== "delete") {
        const newResponse = await axios.post(
          "http://localhost:5000/book/addBookToNewShelf",
          { isbn, shelf: shelfState.shelf, displayState: currentDisplayState },
          { withCredentials: true }
        );
      }
    }

    if (change) {
      handleModalUpdate();
    }

    handleClose();
  };

  return (
    <MainModal ref={modalRef}>
      <CloseButton onClick={handleClose}>X</CloseButton>
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
            <option value="delete">Remove book from this shelf</option>
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
  display: flex;
  flex-direction: column;
  // background-color: blue;
`;

export const BookDescriptionDiv = styled.div`
  display: flex;
  flex-direction: row;
  // background-color: red;
  font-size: 12px;
  margin-top: 10px;
`;

export const Label = styled.p`
  // background-color: orange;
  min-width: 100px;
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
  margin-bottom: 20px;
  border: none;
  border-radius: 10px;
  background-color: #287bf8;
  color: white;
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
