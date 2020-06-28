import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { startSetUser } from "../actions/user";
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
import { ErrorMessageHook } from "../types/ErrorMessageHook";
import { ThunkDispatch } from "redux-thunk";
import { AppActions, SUCCESS, FAIL } from "../types/actions";
import { bindActionCreators } from "redux";

interface LoginFormState {
  email: string;
  password: string;
}

const initialValues: LoginFormState = {
  email: "",
  password: "",
};

interface LoginProps {}

type Props = LoginProps & LinkDispatchProps;

const Login: React.FC<Props> = (props) => {
  const [loginError, dispatchLoginError]: ErrorMessageHook = useErrorMessage();
  const history = useHistory();

  const { startSetUser } = props;

  const onSubmit = async (values: LoginFormState) => {
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
      if (loginError.error) dispatchLoginError({ type: SUCCESS });
      await startSetUser();
      history.push("/");
    } catch (error) {
      console.log(error.response.data.msg);
      dispatchLoginError({
        type: FAIL,
        payload: { errorMsg: error.response.data.msg },
      });
    }
  };

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
              <SubmitButton type="submit">Continue</SubmitButton>
            </FormDiv>
          </Form>
        </CentralDiv>
      </Formik>
    </MainContainer>
  );
};

interface LinkDispatchProps {
  startSetUser: () => void;
}

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: LoginProps
) => ({
  startSetUser: bindActionCreators(startSetUser, dispatch),
});

export default connect(null, mapDispatchToProps)(Login);
