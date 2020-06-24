import React from "react";
import styled from "@emotion/styled";

function TextError(props) {
  return <TextErrorMessage>{props.children}</TextErrorMessage>;
}

export default TextError;

const TextErrorMessage = styled.p`
  font-size: 12px;
  color: red;
`;
