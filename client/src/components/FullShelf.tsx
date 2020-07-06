import React, { useState, useEffect, useRef, FunctionComponent } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import Shelf from "./Shelf";
import Loading from "./Loading";
import NotFound from "./NotFound";
import PageCount from "./PageCount";
import NotLoggedInHeader from "./headers/NotLoggedInHeader";
import AddBookModal from "./modals/AddBookModal";
import AddBookLink from "./links/AddBookLink";
import AuthLinks from "./links/AuthLinks";
import NextPreviousNavigation from "./links/NextPreviousNavigation";
import { useModal } from "../hooks/useModal";
import { useBookModalUpdates } from "../hooks/useBookModalUpdates";
import { RouteComponentProps } from "react-router-dom";
import { AppState } from "../store/configureStore";
import { User } from "../types/User";
import { useQuery } from "@apollo/react-hooks";
import { FULLSHELF_QUERY } from "../graphql/queries";
import { shelfTypes } from "./shelfTypes";

type RouteParams = {
  username: string;
  type: string;
};

type FullShelfProps = {} & RouteComponentProps<RouteParams>;
type Props = FullShelfProps & LinkStateProps;

const FullShelf: FunctionComponent<Props> = (props) => {
  const username = props.match.params.username;
  const shelf = `${props.match.params.type}Books`;
  const shelfTitle = shelfTypes[shelf];

  // Get page number from query string parameter
  const queryString = new URLSearchParams(props.location.search);
  const pageValues = queryString.getAll("page");
  const page = parseInt(pageValues[0]);

  const [pageSize, setPageSize] = useState(21);

  // const [shelfState, isbnDispatch] = useReducer(isbnReducer, initialIsbnState);

  // State to handle modal, will be updated if there is a shelf Update
  const [showModal, toggleModal] = useModal();
  const [shelfUpdates, setShelfUpdates] = useState(0);
  const buttonRef = useRef(null);

  // State to manage updates triggered by the book modal
  const [bookModalUpdates, triggerBookModalUpdate] = useBookModalUpdates();

  const { user } = props;

  const { loading, error, data, refetch } = useQuery(FULLSHELF_QUERY, {
    variables: { username, [shelf]: true, page, pageSize },
  });

  const handleShelfUpdate = (shelf: string) => {
    setShelfUpdates((prev) => prev + 1);
  };

  useEffect(() => {
    refetch({ username, [shelf]: true, page, pageSize }); // TODO: This works, but the architecture is super inefficient
  }, [shelfUpdates, bookModalUpdates]);

  if (loading) {
    return <Loading />;
  } else if (error) {
    return <NotFound />;
  } else {
    if (!data.fullshelf) {
      return <NotFound />;
    } else {
      return (
        <>
          {!user.isLoggedIn && (
            <NotLoggedInHeader
              username={username}
              fullName={data.fullshelf.fullName}
            />
          )}
          <MainContainer>
            <PageCount
              show={
                data.fullshelf.bookshelf[shelf].shelfInfo.totalPages > 1
                  ? true
                  : false
              }
              page={page}
              totalPages={data.fullshelf.bookshelf[shelf].shelfInfo.totalPages}
            />
            {showModal && (
              <AddBookModal
                buttonRef={buttonRef}
                handleClose={toggleModal}
                shelfUpdate={handleShelfUpdate}
                shelf={shelf}
              />
            )}
            {user.isLoggedIn ? (
              <AddBookLink buttonRef={buttonRef} toggleModal={toggleModal} />
            ) : (
              <AuthLinks />
            )}
            <CentralDiv>
              <Title>{shelfTitle}</Title>
              <Shelf
                shelfBooks={data.fullshelf.bookshelf[
                  shelf
                ].bookshelfBooks.slice(0, pageSize / 3)}
                shelf={shelf}
                handleModalUpdate={triggerBookModalUpdate}
              />
              <Space />
              <Shelf
                shelfBooks={data.fullshelf.bookshelf[
                  shelf
                ].bookshelfBooks.slice(pageSize / 3, (pageSize * 2) / 3)}
                shelf={shelf}
                handleModalUpdate={triggerBookModalUpdate}
              />
              <Space />
              <Shelf
                shelfBooks={data.fullshelf.bookshelf[
                  shelf
                ].bookshelfBooks.slice((pageSize * 2) / 3)}
                shelf={shelf}
                handleModalUpdate={triggerBookModalUpdate}
              />
              <NextPreviousNavigation
                prev={data.fullshelf.bookshelf[shelf].shelfInfo.hasPreviousPage}
                next={data.fullshelf.bookshelf[shelf].shelfInfo.hasNextPage}
                url={props.match.url}
                page={page}
              />
            </CentralDiv>
          </MainContainer>
        </>
      );
    }
  }
};

type LinkStateProps = {
  user: User;
};

const mapStateToProps = (
  state: AppState,
  ownProps: FullShelfProps
): LinkStateProps => ({
  user: state.userState,
});

export default connect(mapStateToProps, null)(FullShelf);

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #222222;
`;

export const CentralDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  position: relative;
  margin-left: 10%;
  font-size: 14px;
  color: white;
`;

const Space = styled.div`
  flex-basis: 45px;
`;
