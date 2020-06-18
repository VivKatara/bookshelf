import React, {
  useState,
  useReducer,
  useEffect,
  useContext,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import styled from "@emotion/styled";

import { ShelfContext } from "../Shelf";

import { useOutsideClick } from "../../hooks/useOutsideClick";

const initialState = {
  shelf: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SHELF":
      return {
        ...state,
        shelf: action.payload.shelf,
      };
    default:
      return state;
  }
};

function BooKModal(props) {
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
      //TODO Embed in a try catch and apply frontend middleware to check refreshtoken as well
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
    if (props.isLoggedIn) {
      getDisplay();
    }
    dispatch({ type: "UPDATE_SHELF", payload: { shelf } });
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
      //TODO Refresh Token middleware
      const response = await axios.post(
        "http://localhost:5000/book/changebookDisplay",
        { isbn, shelf, desiredDisplay },
        { withCredentials: true }
      );
      setInitialDisplayState(currentDisplayState);
    }

    // If there's a shelf change, delete the book
    // TODO Refresh Token middleware
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
      {props.isLoggedIn && (
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
                dispatch({
                  type: "UPDATE_SHELF",
                  payload: { shelf: e.target.value },
                })
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
      )}
    </MainModal>
  );
}

BooKModal.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.userState.isLoggedIn,
});

export default connect(mapStateToProps, {})(BooKModal);

export const MainModal = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #333333;
  z-index: 1;
`;

export const BookDescription = styled.div`
  display: flex;
  flex-direction: column;
  // background-color: blue;
`;

export const BookDescriptionDiv = styled.div`
  display: flex;
  flex-direction: row;
  // background-color: red;
  font-size: 14px;
`;

export const Label = styled.p`
  min-width: 100px;
  margin-left: 5%;
  color: white;
  // background-color: orange;
`;

export const Value = styled.p`
  margin-right: 5%;
  color: white;
  // background-color: green;
`;

export const BookSettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  font-size: 14px;
`;

export const FormDiv = styled.div`
  display: flex;
  flex-direction: row;
  // background-color: red;
`;

export const SettingsLabel = styled.p`
  color: #287bf8;
  margin-left: 5%;
`;

export const Select = styled.select`
  position: absolute;
  margin-left: 30%;
  margin-top: 10px;
  width: 300px;
  height: 30px;
  border: none;
  border-radius: 5px;
  padding; 5px;
`;

export const Checkbox = styled.input`
  position: absolute;
  margin-left: 30%;
  margin-top: 15px;
  outline: none;
  height: 20px;
  width: 20px;
  border-radius: 10px;
`;

export const SaveChangesButton = styled.button`
  width: 300px;
  height: 30px;
  margin-left: 30%;
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
