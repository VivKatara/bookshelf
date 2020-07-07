import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  FunctionComponent,
} from "react";
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
import { BookModalFormState } from "../../types/modals";
import {
  ErrorMessageHookActionTypes,
  SUCCESS,
  FAIL,
  AppActions,
} from "../../types/actions";
import { AppState } from "../../store/configureStore";
import { User } from "../../types/User";
import { ThunkDispatch } from "redux-thunk";
import { bindActionCreators } from "redux";
import { useMutation } from "@apollo/react-hooks";
import { CHANGE_BOOK_MUTATION } from "../../graphql/mutations";

const initialValues: BookModalFormState = {
  shelf: "",
  display: false,
};

type BookModalProps = {
  display: boolean;
  title: string;
  authors: string;
  description: string;
  isbn: string;
  handleClose: () => void;
  buttonRef: React.MutableRefObject<HTMLElement | null>; // TODO: Not sure if this type is correct for ButtonRef
  handleModalUpdate: () => void;
};

type Props = BookModalProps & LinkStateProps & LinkDispatchProps;

const BookModal: FunctionComponent<Props> = (props) => {
  const {
    display,
    title,
    authors,
    description,
    isbn,
    handleClose,
    buttonRef,
    handleModalUpdate,
    user,
    startLogOffUser,
  } = props;

  const modalRef = useRef(null);
  const formikRef: any = useRef(null);
  useOutsideClick(modalRef, buttonRef, handleClose);

  const [displayError, dispatchDisplayError] = useErrorMessage();

  const shelf = useContext(ShelfContext);

  const [changeBook] = useMutation(CHANGE_BOOK_MUTATION);

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.setFieldValue("display", display);
      formikRef.current.setFieldValue("shelf", shelf);
    }
  }, []);

  const onSubmit = async (values: BookModalFormState): Promise<void> => {
    let change = false;
    try {
      const { data } = await changeBook({
        variables: {
          isbn,
          initialDisplay: display,
          desiredDisplay: values.display,
          initialShelf: shelf,
          desiredShelf: values.shelf,
        },
      });
      change = data.changeBook;
    } catch (e) {
      console.log(e);
    } finally {
      if (change) {
        handleModalUpdate();
      }
      handleClose();
    }
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
      {user.isLoggedIn && (
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={BookModalSchema}
          validateOnBlur={false}
          validateOnChange={false}
        >
          <BookSettingsForm>
            <Form>
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
                <ErrorMessage name="shelf" component={DisplayedErrorMessage} />
              </FormDiv>
              <FormDiv>
                {displayError.error ? (
                  <DisplayedErrorMessage>
                    Error! Something unexpected occurred. Can't show book
                    display.
                    {displayError.errorMsg}
                  </DisplayedErrorMessage>
                ) : (
                  <>
                    <Label>Display on homepage:</Label>
                    <Field
                      name="display"
                      render={({ field, form }: { field: any; form: any }) => {
                        return (
                          <Checkbox
                            type="checkbox"
                            checked={field.value}
                            {...field}
                          />
                        );
                      }}
                    />
                    <ErrorMessage
                      name="display"
                      component={DisplayedErrorMessage}
                    />
                  </>
                )}
              </FormDiv>
              <FormDiv>
                <SaveChangesButton type="submit">
                  Save Changes
                </SaveChangesButton>
              </FormDiv>
            </Form>
          </BookSettingsForm>
        </Formik>
      )}
    </MainModal>
  );
};

type LinkStateProps = {
  user: User;
};

type LinkDispatchProps = {
  startLogOffUser: () => void;
};

const mapStateToProps = (
  state: AppState,
  ownProps: BookModalProps
): LinkStateProps => ({
  user: state.userState,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: BookModalProps
): LinkDispatchProps => ({
  startLogOffUser: bindActionCreators(startLogOffUser, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookModal);

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

export const BookSettingsForm = styled.div`
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
