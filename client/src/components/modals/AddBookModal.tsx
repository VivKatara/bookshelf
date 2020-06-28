import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import styled from "@emotion/styled";
import { startLogOffUser } from "../../actions/user";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useErrorMessage } from "../../hooks/useErrorMessage";
import { AddBookModalSchema } from "../../validation/schemas";
import { checkAccessAndRefreshToken } from "../../utils/authMiddleware";
import {
  FormHeader,
  Label,
  Input,
  SubmitButton,
  DisplayedErrorMessage,
} from "../../styles/authForms";
import { AddBookModalFormState } from "../../types/AddBookModal";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  AppActions,
  SUCCESS,
  ErrorMessageHookActionTypes,
} from "../../types/actions";

const initialValues: AddBookModalFormState = {
  title: "",
  author: "",
  shelf: "currentBooks",
};

type AddBookModalProps = {
  buttonRef: React.MutableRefObject<HTMLElement | null>;
  handleClose: () => void;
  shelfUpdate: (shelf: string) => void;
  shelf?: string;
};

type Props = AddBookModalProps & LinkDispatchProps;

const AddBookModal: FunctionComponent<Props> = (props) => {
  const { buttonRef, handleClose, shelfUpdate, shelf } = props;

  const modalRef = useRef(null);
  useOutsideClick(modalRef, buttonRef, handleClose);

  // To manage state of the modal
  const [shelfLabelTitle, setShelfLabelTitle] = useState("");
  const [addBookError, dispatchAddBookError] = useErrorMessage();

  const history = useHistory();

  // If the shelf is given, define the label title so only that one option will display in modal
  useEffect(() => {
    if (shelf) {
      if (shelf === "currentBooks") setShelfLabelTitle("Currently Reading");
      else if (shelf === "pastBooks") setShelfLabelTitle("Have Read");
      else if (shelf === "futureBooks") setShelfLabelTitle("Want to Read");
      else return;
    }
  }, [shelf]);

  const onSubmit = async (values: AddBookModalFormState) => {
    const { title, author, shelf } = values;
    try {
      const method = "POST";
      const url = "http://localhost:5000/book/add";
      const data = {
        title,
        author,
        shelf,
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
        const action: ErrorMessageHookActionTypes = {
          type: SUCCESS,
        };

        dispatchAddBookError(action);
        shelfUpdate(shelf);
        handleClose();
      } else {
        // Server error
        dispatchAddBookError({
          type: "FAIL",
          payload: { errorMsg: response.data.msg },
        });
      }
    } catch (error) {
      // Authentication error
      alert(error.message);
      handleClose();
      await props.startLogOffUser();
      history.push("/login");
    }
  };

  // If the shelf is defined in props, only display that one shelf. Else, display all
  const shelfOptions = shelf ? (
    <option value={shelf}>{shelfLabelTitle}</option>
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
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={AddBookModalSchema}
        validateOnBlur={false}
        validateOnChange={false}
      >
        <Form>
          <FormDiv>
            <FormHeader>Add a Book to one of your Shelves</FormHeader>
          </FormDiv>
          <FormDiv>
            <Label>Title</Label>
            <Field type="text" as={Input} name="title" id="title" required />
            <ErrorMessage name="title" component={DisplayedErrorMessage} />
          </FormDiv>
          <FormDiv>
            <Label>Author</Label>
            <Field type="text" as={Input} name="author" id="author" />
            <ErrorMessage name="author" component={DisplayedErrorMessage} />
          </FormDiv>
          <FormDiv>
            <Label>Shelf</Label>
            <Field as={Select} name="shelf">
              {shelfOptions}
            </Field>
          </FormDiv>
          <FormDiv>
            {addBookError.error && (
              <DisplayedErrorMessage>
                {addBookError.errorMsg}
              </DisplayedErrorMessage>
            )}
            <SubmitButton type="submit">Add</SubmitButton>
          </FormDiv>
        </Form>
      </Formik>
    </MainModal>
  );
};

interface LinkDispatchProps {
  startLogOffUser: () => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: AddBookModalProps
) => ({
  startLogOffUser: bindActionCreators(startLogOffUser, dispatch),
});

export default connect(null, mapDispatchToProps)(AddBookModal);

export const MainModal = styled.div`
  width: 50%;
  height: 50%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
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
