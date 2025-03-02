import * as Yup from "yup";

export const LoginSchema = Yup.object({
  email: Yup.string()
    .email("The email is invalid!")
    .required("This field is required!"),
  password: Yup.string().required("This field is required"),
});

export const RegisterSchema = Yup.object({
  email: Yup.string()
    .email("The email is invalid!")
    .required("This field is required!"),
  fullName: Yup.string()
    .test(
      "check-fullName-length",
      "Please provide your first and last name",
      function (value: string) {
        // Test to check if we're given just one name (first or last) or a full name
        const name = value.split(" ");
        return name.length > 1;
      }
    )
    .required("This field is required!"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("This field is required!"),
  passwordConfirm: Yup.string()
    .test("passwords-match", "Passwords must match", function (value: string) {
      // Test for password equality
      return this.parent.password === value;
    })
    .required("This field is required!"),
});

export const AddBookModalSchema = Yup.object({
  title: Yup.string().required("This field is required!"),
  author: Yup.string(),
  shelf: Yup.string().required("This field is required!"),
});

export const BookModalSchema = Yup.object({
  shelf: Yup.string().required("This field is required!"),
  display: Yup.boolean().required("This field is required!"),
});
