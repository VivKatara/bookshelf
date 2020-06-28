import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

type Props = {};

const NotFound: FunctionComponent<Props> = (props) => {
  return <MainContainer>Not Found</MainContainer>;
};

export default NotFound;

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
`;
