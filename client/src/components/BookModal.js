import React, { useState, useEffect, useRef } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import styled from "@emotion/styled";

function BookModal(props) {
  const { title, authors, buttonRef, handleClose } = props;
  const [displayAuthors, setDisplayAuthors] = useState("");
  const modalRef = useRef(null);

  useOutsideClick(modalRef, buttonRef, handleClose);

  useEffect(() => {
    if (authors.length > 1) {
      const jointAuthors = authors.join(",");
      setDisplayAuthors(jointAuthors);
    } else {
      setDisplayAuthors(authors);
    }
  }, [authors]);

  return (
    <ModalContainer ref={modalRef}>
      <p>Title: {title}</p>
      <p>Authors: {displayAuthors}</p>
    </ModalContainer>
  );
}

export default BookModal;

export const ModalContainer = styled.div`
  position: absolute;
  width: 120px;
  height: 160px;
  background-color: #444444;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
`;
