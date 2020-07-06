import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  onError: ({ networkError, graphQLErrors }) => {
    console.log("graphQLErrors", graphQLErrors);
    console.log("networkError", networkError);
  },
});

export default client;
