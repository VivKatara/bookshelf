import React, { useReducer } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "@emotion/styled";

function Login() {
  const initialState = {
    email: "",
    password: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "EMAIL_CHANGE":
        return {
          ...state,
          email: action.payload,
        };
      case "PASSWORD_CHANGE":
        return {
          ...state,
          password: action.payload,
        };
      default:
        return state;
    }
  };

  const [loginState, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginState;
    try {
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });
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
            <h3>Sign into your Bookshelf account</h3>
          </FormDiv>
          <FormDiv>
            <label>Email</label>
            <Input
              type="text"
              name="email"
              id="email"
              value={loginState.email}
              onChange={(e) =>
                dispatch({ type: "EMAIL_CHANGE", payload: e.target.value })
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
              value={loginState.password}
              onChange={(e) =>
                dispatch({ type: "PASSWORD_CHANGE", payload: e.target.value })
              }
              required
            />
          </FormDiv>
          <FormDiv>
            <LoginButton type="Submit">Continue</LoginButton>
          </FormDiv>
        </Form>
      </CentralDiv>
    </MainContainer>
  );
}

export default Login;

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

const LoginButton = styled.button`
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
