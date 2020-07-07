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
    $username: String!
    $title: String!
    $author: String!
    $shelf: String!
  ) {
    addBook(
      username: $username
      title: $title
      author: $author
      shelf: $shelf
    ) {
      title
    }
  }
`;

export const CHANGE_BOOK_MUTATION = gql`
  mutation changeBook(
    $username: String!
    $isbn: String!
    $initialDisplay: Boolean!
    $desiredDisplay: Boolean!
    $initialShelf: String!
    $desiredShelf: String!
  ) {
    changeBook(
      username: $username
      isbn: $isbn
      initialDisplay: $initialDisplay
      desiredDisplay: $desiredDisplay
      initialShelf: $initialShelf
      desiredShelf: $desiredShelf
    )
  }
`;
