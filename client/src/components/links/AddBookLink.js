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
