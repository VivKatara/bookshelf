import React, { useRef, FunctionComponent } from "react";
import styled from "@emotion/styled";
import BookModal from "./modals/BookModal";
import { useModal } from "../hooks/useModal";
import { useQuery } from "@apollo/react-hooks";
import { GET_BOOK_DETAILS_QUERY } from "../graphql/queries";

type Props = {
  isbn: string;
  handleModalUpdate: () => void;
};

const Book: FunctionComponent<Props> = (props) => {
  const { isbn, handleModalUpdate } = props;
  const [showModal, toggleModal] = useModal();
  const buttonRef = useRef(null);

  const { loading, error, data } = useQuery(GET_BOOK_DETAILS_QUERY, {
    variables: { isbn },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error...</h1>;

  // Safe to assume here data must be valid
  return (
    <>
      <BookContainer ref={buttonRef} onClick={toggleModal}>
        <img
          src={data.book.coverImage}
          alt={data.book.title}
          width="120"
          height="160"
        ></img>
      </BookContainer>
      {showModal && (
        <BookModal
          isbn={isbn}
          title={data.book.title}
          authors={data.book.authors} // TODO: This should be a split string of authors
          description={data.book.description}
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
