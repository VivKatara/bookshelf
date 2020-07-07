import { makeExecutableSchema } from "graphql-tools";
import typeDefs from "./schema";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
