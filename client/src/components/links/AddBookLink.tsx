import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

type Props = {
  buttonRef: React.MutableRefObject<null>;
  toggleModal: () => void;
};

const AddBookLink: FunctionComponent<Props> = (props) => {
  const { buttonRef, toggleModal } = props;
  return (
    <AddBookLinkContainer ref={buttonRef} onClick={toggleModal}>
      Add Book to Shelf
    </AddBookLinkContainer>
  );
};

export default React.memo(AddBookLink);

export const AddBookLinkContainer = styled.a`
  margin-top: 20px;
  margin-left: auto;
  margin-right: 11%;
  width: max-content;
  color: #287bf8;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  // background-color: white;
`;
