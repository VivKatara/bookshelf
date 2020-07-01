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

export const GET_USER_FULL_NAME = gql`
  query getUserFullName($username: String) {
    user(username: $username) {
      fullName
    }
  }
`;
