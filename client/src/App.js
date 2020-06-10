import React from "react";
import styled from "@emotion/styled";
import { Provider } from "react-redux";
import Routes from "./components/Routes";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer>
        <Routes />
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
