import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import styled from "@emotion/styled";

function Register() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const history = useHistory();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/register", {
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
              onChange={handleEmailChange}
              required
            />
          </FormDiv>
          <FormDiv>
            <label>Full Name</label>
            <Input
              type="text"
              name="fullName"
              id="fullName"
              onChange={handleFullNameChange}
              required
            />
          </FormDiv>
          <FormDiv>
            <label>Password</label>
            <Input
              type="text"
              name="password"
              id="password"
              onChange={handlePasswordChange}
              required
            />
          </FormDiv>
          <FormDiv>
            <label>Confirm Password</label>
            <Input
              type="text"
              name="passwordConfirm"
              id="passwordConfirm"
              onChange={handlePasswordConfirmChange}
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
