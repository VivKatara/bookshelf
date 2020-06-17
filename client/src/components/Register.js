import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  MainContainer,
  CentralDiv,
  Form,
  FormDiv,
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
        email: action.payload,
      };
    case "FULLNAME_CHANGE":
      return {
        ...state,
        fullName: action.payload,
      };

    case "PASSWORD_CHANGE":
      return {
        ...state,
        password: action.payload,
      };
    case "PASSWORD_CONFIRM_CHANGE":
      return {
        ...state,
        passwordConfirm: action.payload,
      };
    default:
      return state;
  }
};

const Register = () => {
  const [userState, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, fullName, password, passwordConfirm } = userState;
    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        email,
        fullName,
        password,
        passwordConfirm,
      });
      console.log(response);
      history.push("/login");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <MainContainer>
      <CentralDiv>
        <Form onSubmit={handleSubmit}>
          <FormDiv>
            <h3>Create your Bookshelf account</h3>
          </FormDiv>
          <FormDiv>
            <label>Email</label>
            <Input
              type="text"
              name="email"
              id="email"
              value={userState.email}
              onChange={(e) =>
                dispatch({ type: "EMAIL_CHANGE", payload: e.target.value })
              }
              required
            />
          </FormDiv>
          <FormDiv>
            <label>Full Name</label>
            <Input
              type="text"
              name="fullName"
              id="fullName"
              value={userState.fullName}
              onChange={(e) =>
                dispatch({ type: "FULLNAME_CHANGE", payload: e.target.value })
              }
              required
            />
          </FormDiv>
          <FormDiv>
            <label>Password</label>
            <Input
              type="text"
              name="password"
              id="password"
              value={userState.password}
              onChange={(e) =>
                dispatch({ type: "PASSWORD_CHANGE", payload: e.target.value })
              }
              required
            />
          </FormDiv>
          <FormDiv>
            <label>Confirm Password</label>
            <Input
              type="text"
              name="passwordConfirm"
              id="passwordConfirm"
              value={userState.passwordConfirm}
              onChange={(e) =>
                dispatch({
                  type: "PASSWORD_CONFIRM_CHANGE",
                  payload: e.target.value,
                })
              }
              required
            />
          </FormDiv>
          <FormDiv>
            <SubmitButton type="Submit">Sign Up</SubmitButton>
          </FormDiv>
        </Form>
      </CentralDiv>
    </MainContainer>
  );
};

export default Register;
