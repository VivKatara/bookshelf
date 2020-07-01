import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import AppRouter from "./router";
import store from "./store/configureStore";
import styled from "@emotion/styled";
import { ApolloProvider } from "@apollo/react-hooks";
import client from "./graphql";

type Props = {};

const App: FunctionComponent<Props> = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AppContainer>
          <AppRouter />
        </AppContainer>
      </ApolloProvider>
    </Provider>
  );
};

export default App;

export const AppContainer = styled.div`
  width: 100vw;
  heigh: 100vh;
  background-color: #222222;
`;
