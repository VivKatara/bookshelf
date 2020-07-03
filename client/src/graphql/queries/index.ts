import gql from "graphql-tag";

const BookshelfBook = {
  booksFragment: gql`
    fragment BookshelfBooksFragment on BookshelfBook {
      display
      details {
        title
        authors
        isbn
        description
        coverImage
      }
    }
  `,
};

export const FULLSHELF_QUERY = gql`
  query fullshelfQuery(
    $username: String
    $currentBooks: Boolean = false
    $pastBooks: Boolean = false
    $futureBooks: Boolean = false
  ) {
    fullshelf(username: $username) {
      fullName
      bookshelf @include(if: $currentBooks) {
        currentBooks {
          ...BookshelfBooksFragment
        }
        currentBooksCount
      }
      bookshelf @include(if: $pastBooks) {
        pastBooks {
          ...BookshelfBooksFragment
        }
        pastBooksCount
      }
      bookshelf @include(if: $futureBooks) {
        futureBooks {
          ...BookshelfBooksFragment
        }
        futureBooksCount
      }
    }
  }
  ${BookshelfBook.booksFragment}
`;

export const GET_USER_BOOKSHELF_AND_BOOK_QUERY = gql`
  query getUserBookshelfAndBookQuery($username: String) {
    homepage(username: $username) {
      fullName
      bookshelf {
        currentBooks {
          ...BookshelfBooksFragment
        }
        currentBooksCount
        pastBooks {
          ...BookshelfBooksFragment
        }
        futureBooks {
          ...BookshelfBooksFragment
        }
        futureBooksCount
      }
    }
  }
  ${BookshelfBook.booksFragment}
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
