import React, { useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import styled from "@emotion/styled";

import { setUser } from "../actions/setUser";

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
  password: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "EMAIL_CHANGE":
      return {
        ...state,
        email: action.payload.email,
      };
    case "PASSWORD_CHANGE":
      return {
        ...state,
        password: action.payload.password,
      };
    default:
      return state;
  }
};

const Login = (props) => {
  const [loginState, dispatch] = useReducer(reducer, initialState);
  const [errorState, dispatchError] = useErrorMessage();

  const history = useHistory();

  const { setUser } = props;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginState;

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // If the error is set, turn it off again
      if (loginState.error) {
        dispatchError({ type: "SUCCESS" });
      }
      await setUser();
      history.push("/");
    } catch (error) {
      // Set the error to true and update the message
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
            <FormHeader>Sign into your Bookshelf account</FormHeader>
          </FormDiv>
          <FormDiv>
            <Label>Email</Label>
            <Input
              type="text"
              name="email"
              id="email"
              value={loginState.email}
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
            <Label>Password</Label>
            <Input
              type="text"
              name="password"
              id="password"
              value={loginState.password}
              onChange={(e) =>
                dispatch({
                  type: "PASSWORD_CHANGE",
                  payload: { password: e.target.value },
                })
              }
              required
            />
          </FormDiv>
          {errorState.error && (
            <ErrorMessage>{errorState.errorMsg}</ErrorMessage>
          )}
          <FormDiv>
            <SubmitButton type="Submit">Continue</SubmitButton>
          </FormDiv>
        </Form>
      </CentralDiv>
    </MainContainer>
  );
};

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setUser })(Login);

export const ErrorMessage = styled.p`
  position: absolute;
  margin-top: 90px;
  font-size: 12px;
  color: red;
`;
