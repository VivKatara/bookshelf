import gql from "graphql-tag";

export const GET_BOOK_DETAILS_QUERY = gql`
  query getBookDetailsQuery($isbn: String) {
    book(isbn: $isbn) {
      title
      authors
      description
      coverImage
    }
  }
`;

export const CHECK_USERNAME_QUERY = gql`
  query checkUsernameQuery($username: String) {
    userExists(username: $username)
  }
`;

export const GET_USER_FULL_NAME_QUERY = gql`
  query getUserFullNameQuery($username: String) {
    user(username: $username) {
      fullName
    }
  }
`;
