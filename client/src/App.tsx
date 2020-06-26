import React from "react";
import { Provider } from "react-redux";
import Routes from "./components/Routes";
import store from "./store/configureStore";
import styled from "@emotion/styled";

interface Props {}

const App: React.FC<Props> = () => {
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
