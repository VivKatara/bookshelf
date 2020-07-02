import gql from "graphql-tag";

export const GET_USER_BOOKSHELF_AND_BOOK_QUERY = gql`
  query getUserBookshelfAndBookQuery($username: String) {
    homepage(username: $username) {
      fullName
      bookshelf {
        currentBooks {
          display
          details {
            title
            authors
            isbn
            description
            coverImage
          }
        }
        currentBooksCount
        pastBooks {
          display
          details {
            title
            authors
            isbn
            description
            coverImage
          }
        }
        futureBooks {
          display
          details {
            title
            authors
            isbn
            description
            coverImage
          }
        }
        futureBooksCount
      }
    }
  }
`;

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
