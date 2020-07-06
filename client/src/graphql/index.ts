import ApolloClient from "apollo-boost";
import { getError } from "../errors";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
});

export default client;
