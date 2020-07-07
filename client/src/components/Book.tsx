import React, { useRef, FunctionComponent } from "react";
import styled from "@emotion/styled";
import BookModal from "./modals/BookModal";
import { useModal } from "../hooks/useModal";

type Props = {
  username: string;
  display: boolean;
  title: string;
  authors: Array<string>;
  isbn: string;
  description: string;
  coverImage: string;
  handleModalUpdate: () => void;
};

const Book: FunctionComponent<Props> = (props) => {
  const {
    username,
    display,
    title,
    authors,
    isbn,
    description,
    coverImage,
    handleModalUpdate,
  } = props;

  const [showModal, toggleModal] = useModal();
  const buttonRef = useRef(null);

  // Safe to assume here data must be valid
  return (
    <>
      <BookContainer ref={buttonRef} onClick={toggleModal}>
        <img src={coverImage} alt={title} width="120" height="160"></img>
      </BookContainer>
      {showModal && (
        <BookModal
          username={username}
          display={display}
          isbn={isbn}
          title={title}
          authors={authors.join(", ")}
          description={description}
          handleClose={toggleModal}
          buttonRef={buttonRef}
          handleModalUpdate={handleModalUpdate}
        />
      )}
    </>
  );
};

export default React.memo(Book);

const BookContainer = styled.div`
  width: 120px;
  height: 160px;
  margin-top: 20px;
  margin-left: 25px;
  // background-color: blue;

  &:hover {
    cursor: pointer;
  }
`;
