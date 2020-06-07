import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "@emotion/styled";

function Register() {
  const initialState = {
    email: "",
    fullName: "",
    password: "",
    passwordConfirm: "",
  };

  const reducer = (state, action) => {
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
      history.push("/");
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
            <RegisterButton type="Submit">Sign Up</RegisterButton>
          </FormDiv>
        </Form>
      </CentralDiv>
    </MainContainer>
  );
}

export default Register;

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #222222;
`;

const CentralDiv = styled.div`
  width: 50%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-left: 25%;
  text-align: left;
`;

const Input = styled.input`
  height: 20px;
  width: 290px;
  border: none;
  border-radius: 5px;
  padding: 2px;
  margin-top: 10px;
`;

const RegisterButton = styled.button`
  height: 30px;
  width: 300px;
  margin-top: 20px;
  outline: none;
  border: none;
  border-radius: 10px;
  text-align: center;
  background-color: #287bf8;
  color: #ffffff;

  &:hover {
    cursor: pointer;
  }
`;
