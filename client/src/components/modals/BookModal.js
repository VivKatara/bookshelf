import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styled from "@emotion/styled";

import { ShelfContext } from "../Shelf";

import { startLogOffUser } from "../../actions/user";

import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useErrorMessage } from "../../hooks/useErrorMessage";

import { BookModalSchema } from "../../validation/schemas";
import { checkAccessAndRefreshToken } from "../../utils/authMiddleware";

import { DisplayedErrorMessage } from "../../styles/authForms";

const initialValues = {
  shelf: "",
  display: false,
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
  const modalRef = useRef(null);
  const formikRef = useRef(null);
  useOutsideClick(modalRef, buttonRef, handleClose);

  const [displayError, dispatchDisplayError] = useErrorMessage();

  const shelf = useContext(ShelfContext);

  useEffect(() => {
    async function getDisplay() {
      try {
        const method = "GET";
        const url = "http://localhost:5000/book/getBookDisplay";
        const data = {};
        const config = {
          params: { isbn, shelf },
          withCredentials: true,
          validateStatus: false,
        };
        const error =
          "Your session has expired. Please log back in if you'd like to edit the display settings of this book.";
        const response = await checkAccessAndRefreshToken(
          method,
          url,
          data,
          config,
          error
        );
        if (response.status === 200) {
          const responseDisplay = response.data.display;
          if (responseDisplay !== initialDisplayState) {
            setInitialDisplayState(responseDisplay);
            if (formikRef.current) {
              formikRef.current.setFieldValue("display", responseDisplay);
            }
          }
          dispatchDisplayError({ type: "SUCCESS" });
        } else {
          // Server error
          dispatchDisplayError({
            type: "FAIL",
            payload: { errorMsg: response.data.msg },
          });
        }
      } catch (error) {
        alert(error.message);
        await props.startLogOffUser();
        return;
      }
    }
    if (props.isLoggedIn) {
      getDisplay();
    }
    if (formikRef.current) {
      formikRef.current.setFieldValue("shelf", shelf);
    }
  }, []);

  const onSubmit = async (values) => {
    let change = false;
    if (values.display !== initialDisplayState) {
      change = true;
      const desiredDisplay = values.display;
      try {
        const method = "POST";
        const url = "http://localhost:5000/book/changeBookDisplay";
        const data = { isbn, shelf, desiredDisplay };
        const config = { withCredentials: true, validateStatus: false };
        const error =
          "Unable to make changes because your session has expired. Please try logging back in";
        const response = await checkAccessAndRefreshToken(
          method,
          url,
          data,
          config,
          error
        );
        if (response.status === 200) {
          setInitialDisplayState(values.display);
          dispatchDisplayError({ type: "SUCCESS" });
        } else {
          // Server error
          // If statement because there isn't going to be a shelf change, so this error is true
          if (values.shelf === shelf) {
            alert(response.data.msg);
          }
        }
      } catch (error) {
        alert(error.message);
        await props.startLogOffUser();
        return;
      }
    }

    // If there's a shelf change, delete the book from its current shelf
    if (values.shelf !== shelf) {
      change = true;
      try {
        const method = "DELETE";
        const url = "http://localhost:5000/book/deleteFromShelf";
        const data = {};
        const config = {
          params: { isbn, shelf },
          withCredentials: true,
          validateStatus: false,
        };
        const error =
          "Unable to make changes because your session has expired. Please try logging back in.";
        const response = await checkAccessAndRefreshToken(
          method,
          url,
          data,
          config,
          error
        );
        if (response.status !== 200) {
          alert(response.data.msg);
        }
      } catch (error) {
        alert(error.message);
        await props.startLogOffUser();
        return;
      }

      // There's been a shelf change, and it's not a delete, so add the book to the new shelf
      if (values.shelf !== "delete") {
        try {
          const method = "POST";
          const url = "http://localhost:5000/book/addBookToNewShelf";
          const data = {
            isbn,
            shelf: values.shelf,
            displayState: values.display,
          };
          const config = { withCredentials: true, validateStatus: false };
          const error =
            "Unable to make changes because your session has expired. Please try logging back in.";
          const response = await checkAccessAndRefreshToken(
            method,
            url,
            data,
            config,
            error
          );
          if (response.status !== 200) {
            alert(error.message);
          }
        } catch (error) {
          alert(error.message);
          await props.startLogOffUser();
          return;
        }
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
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={BookModalSchema}
          validateOnBlur={false}
          validateOnChange={false}
        >
          <Form as={BookSettingsForm}>
            <FormDiv>
              <SettingsLabel>Shelf Settings</SettingsLabel>
            </FormDiv>
            <FormDiv>
              <Label>Shelf:</Label>
              <Field as={Select} name="shelf">
                <option value="currentBooks">Currently Reading</option>
                <option value="pastBooks">Have Read</option>
                <option value="futureBooks">Want to Read</option>
                <option value="delete">Remove book from this shelf</option>
              </Field>
              <ErrorMessage name="shelf" as={DisplayedErrorMessage} />
            </FormDiv>
            <FormDiv>
              {displayError.error ? (
                <DisplayedErrorMessage>
                  Error! Something unexpected occurred. Can't show book display.
                  {displayError.errorMsg}
                </DisplayedErrorMessage>
              ) : (
                <>
                  <Label>Display on homepage:</Label>
                  <Field
                    name="display"
                    render={({ field, form }) => {
                      return (
                        <Checkbox
                          type="checkbox"
                          checked={field.value}
                          {...field}
                        />
                      );
                    }}
                  />
                  <ErrorMessage name="display" as={DisplayedErrorMessage} />
                </>
              )}
            </FormDiv>
            <FormDiv>
              <SaveChangesButton type="Submit">Save Changes</SaveChangesButton>
            </FormDiv>
          </Form>
        </Formik>
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

export default connect(mapStateToProps, { startLogOffUser })(BooKModal);

export const MainModal = styled.div`
  min-width: 50%;
  min-height: 50%;
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
