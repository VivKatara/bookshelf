import React, { useState, useEffect, useRef, useContext } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import axios from "axios";
import styled from "@emotion/styled";
import { ShelfContext } from "./Shelf";

function BookModal(props) {
  const { title, authors, isbn, buttonRef, handleClose } = props;
  const [displayAuthors, setDisplayAuthors] = useState("");
  const modalRef = useRef(null);
  const [checkState, setCheckState] = useState(false);

  const shelf = useContext(ShelfContext);

  useOutsideClick(modalRef, buttonRef, handleClose);

  useEffect(() => {
    if (authors.length > 1) {
      const jointAuthors = authors.join(",");
      setDisplayAuthors(jointAuthors);
    } else {
      setDisplayAuthors(authors);
    }
  }, [authors]);

  useEffect(() => {
    async function getDisplay() {
      const response = await axios.get(
        "http://localhost:5000/book/getBookDisplay",
        {
          params: { isbn, shelf },
          withCredentials: true,
        }
      );
      const responseDisplay = response.data.display;
      if (responseDisplay !== checkState) setCheckState(responseDisplay);
    }
    getDisplay();
  }, [isbn, shelf]);

  const handleCheckClick = async (event) => {
    const desiredDisplay = event.target.checked;
    setCheckState(desiredDisplay);
    const response = await axios.post(
      "http://localhost:5000/book/changeBookDisplay",
      { isbn, shelf, desiredDisplay },
      { withCredentials: true }
    );
  };

  return (
    <ModalContainer ref={modalRef}>
      <p>Title: {title}</p>
      <p>Authors: {displayAuthors}</p>
      <p>
        Home Display
        <input
          type="checkbox"
          checked={checkState}
          onChange={handleCheckClick}
        />{" "}
      </p>
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
