import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

type Props = {};

// TODO Make this component nice (and also take care of the header that it might be laying on top of)
const Loading: FunctionComponent<Props> = (props) => {
  return <MainContainer>Loading...</MainContainer>;
};

export default Loading;

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
