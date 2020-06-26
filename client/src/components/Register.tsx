import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useErrorMessage } from "../hooks/useErrorMessage";
import { RegisterSchema } from "../validation/schemas";
import { MainContainer, CentralDiv } from "../styles/mainPages";
import {
  FormDiv,
  FormHeader,
  Label,
  Input,
  SubmitButton,
  DisplayedErrorMessage,
} from "../styles/authForms";
import { ErrorMessageHook } from "../types/ErrorMessageHook";

interface RegisterFormState {
  email: string;
  fullName: string;
  password: string;
  passwordConfirm: string;
}

const initalValues: RegisterFormState = {
  email: "",
  fullName: "",
  password: "",
  passwordConfirm: "",
};

interface Props {}

const Register: React.FC<Props> = (props) => {
  const [
    registerError,
    dispatchRegisterError,
  ]: ErrorMessageHook = useErrorMessage();
  const history = useHistory();

  const onSubmit = async (values: RegisterFormState) => {
    const { email, fullName, password, passwordConfirm } = values;
    try {
      await axios.post("http://localhost:5000/auth/register", {
        email,
        fullName,
        password,
        passwordConfirm,
      });
      if (registerError.error)
        dispatchRegisterError({ type: "SUCCESS", payload: null });
      history.push("/login");
    } catch (error) {
      console.log(error.response.data.msg);
      dispatchRegisterError({
        type: "FAIL",
        payload: { errorMsg: error.response.data.msg },
      });
    }
  };

  return (
    <MainContainer>
      <Formik
        initialValues={initalValues}
        onSubmit={onSubmit}
        validationSchema={RegisterSchema}
        validateOnBlur={false}
        validateOnChange={false}
      >
        <CentralDiv>
          <Form>
            <FormDiv>
              <FormHeader>Create your Bookshelf account</FormHeader>
            </FormDiv>
            <FormDiv>
              <Label>Email</Label>
              <Field type="text" as={Input} name="email" id="email" required />
              <ErrorMessage name="email" component={DisplayedErrorMessage} />
            </FormDiv>
            <FormDiv>
              <Label>Full Name</Label>
              <Field
                type="text"
                as={Input}
                name="fullName"
                id="fullName"
                required
              />
              <ErrorMessage name="fullName" component={DisplayedErrorMessage} />
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
              <Label>Confirm Password</Label>
              <Field
                type="text"
                as={Input}
                name="passwordConfirm"
                id="passwordConfirm"
                required
              />
              <ErrorMessage
                name="passwordConfirm"
                component={DisplayedErrorMessage}
              />
            </FormDiv>
            <FormDiv>
              {registerError.error && (
                <DisplayedErrorMessage>
                  {registerError.errorMsg}
                </DisplayedErrorMessage>
              )}
              <SubmitButton type="submit">Sign Up</SubmitButton>
            </FormDiv>
          </Form>
        </CentralDiv>
      </Formik>
    </MainContainer>
  );
};

export default Register;
