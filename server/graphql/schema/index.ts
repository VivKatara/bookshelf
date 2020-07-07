const typeDefs = `
    type User {
        _id: ID!
        email: String!
        username: String!
        password: String
        profilePhoto: String
        bookshelf: Bookshelf!
    }

    type Bookshelf {
        _id: ID!
        currentBooks: [BookshelfBook!]!
        currentBooksCount: Int!
        currentBooksDisplayCount: Int!
        pastBooks: [BookshelfBook!]!
        pastBooksCount: Int!
        pastBooksDisplayCount: Int!
        futureBooks: [BookshelfBook!]!
        futureBooksCount: Int!
        futureBooksDisplayCount: Int!
    }

    type BookshelfBook {
        isbn: String!
        display: Boolean!
    }

    type Book {
        _id: ID!
        title: String!
        authors: [String!]!
        description: String!
        coverImage: String!
    }

    type Query {
        user(email: String!): User!
    }

    schema {
        query: Query
    }
`;

export default typeDefs;
