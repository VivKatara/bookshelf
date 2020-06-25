import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { setUser } from "../actions/setUser";

import { useErrorMessage } from "../hooks/useErrorMessage";

import { LoginSchema } from "../validation/schemas";

import { MainContainer, CentralDiv } from "../styles/mainPages";
import {
  FormDiv,
  FormHeader,
  Label,
  Input,
  SubmitButton,
  DisplayedErrorMessage,
} from "../styles/authForms";

const initialValues = {
  email: "",
  password: "",
};

const Login = (props) => {
  const [loginError, dispatchLoginError] = useErrorMessage();

  const history = useHistory();

  const { setUser } = props;

  const onSubmit = async (values) => {
    const { email, password } = values;
    try {
      await axios.post(
        "http://localhost:5000/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (loginError.error) dispatchLoginError({ type: "SUCCESS" });
      await setUser();
      history.push("/");
    } catch (error) {
      console.log(error.response.data.msg);
      dispatchLoginError({
        type: "FAIL",
        payload: { errorMsg: error.response.data.msg },
      });
    }
  };

  console.log(loginError);

  return (
    <MainContainer>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={LoginSchema}
        validateOnBlur={false}
        validateOnChange={false}
      >
        <CentralDiv>
          <Form>
            <FormDiv>
              <FormHeader>Sign into your Bookshelf account</FormHeader>
            </FormDiv>
            <FormDiv>
              <Label>Email</Label>
              <Field type="text" as={Input} name="email" id="email" required />
              <ErrorMessage name="email" component={DisplayedErrorMessage} />
            </FormDiv>
            <FormDiv>
              <Label>Password</Label>
              <Field
                type="text"
                as={Input}
                name="password"
                id="password"
                required
              />
              <ErrorMessage name="password" component={DisplayedErrorMessage} />
            </FormDiv>
            <FormDiv>
              {loginError.error && (
                <DisplayedErrorMessage>
                  {loginError.errorMsg}
                </DisplayedErrorMessage>
              )}
              <SubmitButton type="Submit">Continue</SubmitButton>
            </FormDiv>
          </Form>
        </CentralDiv>
      </Formik>
    </MainContainer>
  );
};

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setUser })(Login);
