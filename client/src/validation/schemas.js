import * as Yup from "yup";

export const LoginSchema = Yup.object({
  email: Yup.string()
    .email("The email is invalid!")
    .required("This field is required!"),
  password: Yup.string().required("This field is required"),
});
