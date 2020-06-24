import React, { useReducer, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import { logOffUser } from "../../actions/setUser";

import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useErrorMessage } from "../../hooks/useErrorMessage";

import { checkAccessAndRefreshToken } from "../../utils/authMiddleware";

import {
  Form,
  FormHeader,
  Label,
  Input,
  SubmitButton,
} from "../../styles/authForms";

const initialState = {
  title: "",
  author: "",
  shelf: "currentBooks",
  shelfLabelTitle: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_TITLE":
      return {
        ...state,
        title: action.payload.title,
      };
    case "UPDATE_AUTHOR":
      return {
        ...state,
        author: action.payload.author,
      };
    case "UPDATE_SHELF_AND_LABEL":
      return {
        ...state,
        shelf: action.payload.shelf,
        shelfLabelTitle: action.payload.shelfLabelTitle,
      };
    case "UPDATE_SHELF":
      return {
        ...state,
        shelf: action.payload.shelf,
      };
    default:
      return state;
  }
};

function AddBookModal(props) {
  const { buttonRef, handleClose, shelfUpdate, shelf } = props;

  const modalRef = useRef(null);
  useOutsideClick(modalRef, buttonRef, handleClose);

  // To manage state of the modal
  const [addBookState, dispatch] = useReducer(reducer, initialState);
  const [errorState, dispatchError] = useErrorMessage();

  const history = useHistory();

  // If the shelf is given, define the label title so only that one option will display in modal
  useEffect(() => {
    if (shelf) {
      let shelfLabelTitle = "";
      if (shelf === "currentBooks") shelfLabelTitle = "Currently Reading";
      else if (shelf === "pastBooks") shelfLabelTitle = "Have Read";
      else shelfLabelTitle = "Want to Read";
      dispatch({
        type: "UPDATE_SHELF_AND_LABEL",
        payload: { shelf, shelfLabelTitle },
      });
    }
  }, [shelf]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO Implement frontend middleware here to check refresh token if necessary
    try {
      const method = "POST";
      const url = "http://localhost:5000/book/add";
      const data = {
        title: addBookState.title,
        author: addBookState.author,
        shelf: addBookState.shelf,
      };
      const config = { withCredentials: true, validateStatus: false };
      const error = "Unsuccessful attempt to add new book. Please login";
      const response = await checkAccessAndRefreshToken(
        method,
        url,
        data,
        config,
        error
      );
      if (response.status === 200) {
        // Success
        dispatchError({ type: "SUCCESS" });
        shelfUpdate(addBookState.shelf);
        handleClose();
      } else {
        // Server error
        dispatchError({
          type: "FAIL",
          payload: { errorMsg: response.data.msg },
        });
      }
    } catch (error) {
      // Authentication error
      alert(error.message);
      handleClose();
      await props.logOffUser();
      history.push("/login");
    }
  };

  // If the shelf is defined in props, only display that one shelf. Else, display all
  const shelfOptions = shelf ? (
    <option value={shelf}>{addBookState.shelfLabelTitle}</option>
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
            value={addBookState.title}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_TITLE",
                payload: { title: e.target.value },
              })
            }
          />
        </FormDiv>
        <FormDiv>
          <Label>Author</Label>
          <Input
            type="text"
            name="author"
            id="author"
            value={addBookState.author}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_AUTHOR",
                payload: { author: e.target.value },
              })
            }
          />
        </FormDiv>
        <FormDiv>
          <Label>Shelf</Label>
          <Select
            id="shelf"
            name="shelf"
            value={addBookState.shelf}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_SHELF",
                payload: { shelf: e.target.value },
              })
            }
          >
            {shelfOptions}
          </Select>
        </FormDiv>
        {errorState.error && <ErrorMessage>{errorState.errorMsg}</ErrorMessage>}
        <FormDiv>
          <SubmitButton type="Submit">Add</SubmitButton>
        </FormDiv>
      </Form>
    </MainModal>
  );
}

AddBookModal.propTypes = {
  logOffUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { logOffUser })(AddBookModal);

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

const ErrorMessage = styled.p`
  position: absolute;
  margin-top: 130px;
  font-size: 12px;
  color: red;
`;
