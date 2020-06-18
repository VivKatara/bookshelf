import React, { useReducer } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import styled from "@emotion/styled";

import { useErrorMessage } from "../hooks/useErrorMessage";

import { MainContainer, CentralDiv } from "../styles/mainPages";
import {
  Form,
  FormDiv,
  FormHeader,
  Label,
  Input,
  SubmitButton,
} from "../styles/authForms";

const initialState = {
  email: "",
  fullName: "",
  password: "",
  passwordConfirm: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "EMAIL_CHANGE":
      return {
        ...state,
        email: action.payload.email,
      };
    case "FULLNAME_CHANGE":
      return {
        ...state,
        fullName: action.payload.fullName,
      };

    case "PASSWORD_CHANGE":
      return {
        ...state,
        password: action.payload.password,
      };
    case "PASSWORD_CONFIRM_CHANGE":
      return {
        ...state,
        passwordConfirm: action.payload.passwordConfirm,
      };
    default:
      return state;
  }
};

const Register = () => {
  const [registerState, dispatch] = useReducer(reducer, initialState);
  const [errorState, dispatchError] = useErrorMessage();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, fullName, password, passwordConfirm } = registerState;
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        email,
        fullName,
        password,
        passwordConfirm,
      });
      dispatchError({ type: "SUCCESS" });
      history.push("/login");
    } catch (error) {
      console.log(error.response.data.msg);
      dispatchError({
        type: "FAIL",
        payload: { errorMsg: error.response.data.msg },
      });
    }
  };

  return (
    <MainContainer>
      <CentralDiv>
        <Form onSubmit={handleSubmit}>
          <FormDiv>
            <FormHeader>Create your Bookshelf account</FormHeader>
          </FormDiv>
          <FormDiv>
            <Label>Email</Label>
            <Input
              type="text"
              name="email"
              id="email"
              value={registerState.email}
              onChange={(e) =>
                dispatch({
                  type: "EMAIL_CHANGE",
                  payload: { email: e.target.value },
                })
              }
              required
            />
          </FormDiv>
          <FormDiv>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullName"
              id="fullName"
              value={registerState.fullName}
              onChange={(e) =>
                dispatch({
                  type: "FULLNAME_CHANGE",
                  payload: { fullName: e.target.value },
                })
              }
              required
            />
          </FormDiv>
          <FormDiv>
            <Label>Password</Label>
            <Input
              type="text"
              name="password"
              id="password"
              value={registerState.password}
              onChange={(e) =>
                dispatch({
                  type: "PASSWORD_CHANGE",
                  payload: { password: e.target.value },
                })
              }
              required
            />
          </FormDiv>
          <FormDiv>
            <Label>Confirm Password</Label>
            <Input
              type="text"
              name="passwordConfirm"
              id="passwordConfirm"
              value={registerState.passwordConfirm}
              onChange={(e) =>
                dispatch({
                  type: "PASSWORD_CONFIRM_CHANGE",
                  payload: { passwordConfirm: e.target.value },
                })
              }
              required
            />
          </FormDiv>
          {errorState.error && (
            <ErrorMessage>{errorState.errorMsg}</ErrorMessage>
          )}
          <FormDiv>
            <SubmitButton type="Submit">Sign Up</SubmitButton>
          </FormDiv>
        </Form>
      </CentralDiv>
    </MainContainer>
  );
};

export const ErrorMessage = styled.p`
  position: absolute;
  margin-top: 160px;
  font-size: 12px;
  color: red;
`;

export default Register;
