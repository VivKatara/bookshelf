import React from "react";
import styled from "@emotion/styled";

function AddBookLink(props) {
  const { buttonRef, toggleModal } = props;
  return (
    <AddBookLinkContainer ref={buttonRef} onClick={toggleModal}>
      Add Book to Shelf
    </AddBookLinkContainer>
  );
}

export default AddBookLink;

export const AddBookLinkContainer = styled.a`
  margin-top: 20px;
  margin-left: 80%;
  color: #287bf8;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
