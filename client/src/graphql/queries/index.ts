import gql from "graphql-tag";

const Bookshelf = {
  fullshelfShelfFragment: gql`
    fragment fullshelfShelfFragment on Shelf {
      shelfInfo {
        totalPages
        hasNextPage
        hasPreviousPage
      }
      bookshelfBooks {
        display
        details {
          title
          authors
          isbn
          description
          coverImage
        }
      }
    }
  `,
  homepageShelfFragment: gql`
    fragment homepageShelfFragment on Shelf {
      bookshelfBooks {
        display
        details {
          title
          authors
          isbn
          description
          coverImage
        }
      }
    }
  `,
};

export const FULLSHELF_QUERY = gql`
  query fullshelfQuery(
    $username: String!
    $currentBooks: Boolean! = false
    $pastBooks: Boolean! = false
    $futureBooks: Boolean! = false
    $page: Int! = 1
    $pageSize: Int! = 1
    $display: Boolean! = false
  ) {
    fullshelf(username: $username) {
      fullName
      bookshelf @include(if: $currentBooks) {
        currentBooks(page: $page, pageSize: $pageSize, display: $display) {
          ...fullshelfShelfFragment
        }
        currentBooksCount
      }
      bookshelf @include(if: $pastBooks) {
        pastBooks(page: $page, pageSize: $pageSize, display: $display) {
          ...fullshelfShelfFragment
        }
        pastBooksCount
      }
      bookshelf @include(if: $futureBooks) {
        futureBooks(page: $page, pageSize: $pageSize, display: $display) {
          ...fullshelfShelfFragment
        }
        futureBooksCount
      }
    }
  }
  ${Bookshelf.fullshelfShelfFragment}
`;

export const HOMEPAGE_QUERY = gql`
  query homepageQuery(
    $username: String!
    $page: Int! = 1
    $pageSize: Int! = 1
    $display: Boolean! = true
  ) {
    homepage(username: $username) {
      fullName
      bookshelf {
        currentBooks(page: $page, pageSize: $pageSize, display: $display) {
          ...homepageShelfFragment
        }
        currentBooksCount
        pastBooks(page: $page, pageSize: $pageSize, display: $display) {
          ...homepageShelfFragment
        }
        futureBooks(page: $page, pageSize: $pageSize, display: $display) {
          ...homepageShelfFragment
        }
        futureBooksCount
      }
    }
  }
  ${Bookshelf.homepageShelfFragment}
`;
