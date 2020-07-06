import gql from "graphql-tag";

export const REGISTER_MUTATION = gql`
  mutation addUser($email: String!, $fullName: String!, $password: String!) {
    addUser(email: $email, fullName: $fullName, password: $password) {
      username
    }
  }
`;

export const ADD_BOOK_MUTATION = gql`
  mutation addBook(
    $email: String = "vivek.r.katara@gmail.com"
    $title: String
    $author: String
    $shelf: String
  ) {
    addBook(email: $email, title: $title, author: $author, shelf: $shelf) {
      title
    }
  }
`;
