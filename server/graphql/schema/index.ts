const typeDefs = `
    type User {
        _id: ID!
        email: String!
        username: String!
        fullName: String!
        password: String
        profilePhoto: String
        bookshelf: Bookshelf!
    }

    type Bookshelf {
        _id: ID!
        currentBooks(page: Int!, pageSize: Int!, display: Boolean!): Shelf
        currentBooksCount: Int!
        currentBooksDisplayCount: Int!
        pastBooks(page: Int!, pageSize: Int!, display: Boolean!): Shelf
        pastBooksCount: Int!
        pastBooksDisplayCount: Int!
        futureBooks(page: Int!, pageSize: Int!, display: Boolean!): Shelf
        futureBooksCount: Int!
        futureBooksDisplayCount: Int!
    }

    type Shelf {
        shelfInfo: ShelfInfo!
        bookshelfBooks: [BookshelfBook!]!
    }

    type ShelfInfo {
        totalPages: Int!
        hasNextPage: Boolean!
        hasPreviousPage: Boolean!
    }

    type BookshelfBook {
        isbn: String!
        display: Boolean!
        details: Book!
    }

    type Book {
        _id: ID!
        title: String!
        authors: [String!]!
        isbn: String!
        description: String!
        coverImage: String!
    }

    type Query {
        homepage(username: String!, page: Int! = 1, pageSize: Int! = 1, display: Boolean! = true): User
        fullshelf(username: String!, currentBooks: Boolean! = false, pastBooks: Boolean! = false, futureBooks: Boolean! = false, page: Int! = 1, pageSize: Int! = 1, display: Boolean! = false): User
    }

    type Mutation {
        addUser(email: String!, fullName: String!, password: String!): User!
        addBook(username: String!, title: String!, author: String!, shelf: String!): Book!
        changeBook(username: String!, isbn: String!, initialDisplay: Boolean!, desiredDisplay: Boolean!, initialShelf: String!, desiredShelf: String!): Boolean!
    }

    schema {
        query: Query
        mutation: Mutation
    }
`;

export default typeDefs;
