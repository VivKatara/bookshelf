import React, { useReducer } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { setUser } from "../actions/setUser";
import {
  MainContainer,
  CentralDiv,
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

const Login = (props) => {
  const [loginState, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
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
      await props.setUser();
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
                dispatch({ type: "EMAIL_CHANGE", payload: e.target.value })
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
                dispatch({ type: "PASSWORD_CHANGE", payload: e.target.value })
              }
              required
            />
          </FormDiv>
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
