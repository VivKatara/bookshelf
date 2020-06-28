import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import AppRouter from "./router";
import store from "./store/configureStore";
import styled from "@emotion/styled";

type Props = {};

const App: FunctionComponent<Props> = () => {
  return (
    <Provider store={store}>
      <AppContainer>
        <AppRouter />
      </AppContainer>
    </Provider>
  );
};

export default App;

export const AppContainer = styled.div`
  width: 100vw;
  heigh: 100vh;
  background-color: #222222;
`;
