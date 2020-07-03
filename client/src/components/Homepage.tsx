import React, { useState, useRef, FunctionComponent, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import Shelf from "./Shelf";
import Loading from "./Loading";
import NotFound from "./NotFound";
import NotLoggedInHeader from "./headers/NotLoggedInHeader";
import AddBookModal from "./modals/AddBookModal";
import AddBookLink from "./links/AddBookLink";
import AuthLinks from "./links/AuthLinks";
import SeeAll from "./links/SeeAll";
import { useModal } from "../hooks/useModal";
import { useBookModalUpdates } from "../hooks/useBookModalUpdates";
import { AppState } from "../store/configureStore";
import { User } from "../types/User";
import { RouteComponentProps } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { GET_USER_BOOKSHELF_AND_BOOK_QUERY } from "../graphql/queries";

interface RouteParams {
  username: string;
}

interface HomepageProps {}
type Props = HomepageProps & LinkStateProps & RouteComponentProps<RouteParams>;

const Homepage: FunctionComponent<Props> = (props) => {
  const username = props.match.params.username;

  const { loading, error, data, refetch } = useQuery(
    GET_USER_BOOKSHELF_AND_BOOK_QUERY,
    {
      variables: { username },
    }
  );

  const [showModal, toggleModal] = useModal();
  const buttonRef = useRef(null);
  const [shelfUpdates, setShelfUpdates] = useState(0);
  const [bookModalUpdates, setBookModalUpdates] = useState(0);
  // const [bookModalUpdates, triggerBookModalUpdate] = useBookModalUpdates();

  const getDisplayBooks = (books: any) => {
    const displayBooks = books.filter((book: any) => {
      if (book.display) return book;
    });
    return displayBooks;
  };

  const handleShelfUpdate = (shelf: string) => {
    setShelfUpdates((prev) => prev + 1);
    refetch({ username }); //TODO: This seems like an anti-pattern. My hypo is that it is needed because apollo isn't sensing the mutation update. So, it is likely rather that once the mutations are in place, we won't need this
  };

  const triggerBookModalUpdate = () => {
    setBookModalUpdates((prev) => prev + 1);
    refetch({ username });
  };

  // useEffect(() => {
  //   if (data) {
  //     refetch({ username });
  //     console.log("Refetching");
  //   }
  // }, [shelfUpdates, bookModalUpdates]);

  // Get user from Redux
  const { user } = props;

  // console.log("Called");
  // console.log(loading);
  // console.log(error);
  // console.log(data);
  if (loading) {
    return <Loading />;
  } else if (error) {
    return <NotFound />;
  } else {
    if (!data || !data.homepage) {
      return <NotFound />;
    } else {
      // username is valid since we got a response
      // TODO: Homepage logic now based on your data
      return (
        <>
          {!user.isLoggedIn && <NotLoggedInHeader username={username} />}
          <MainContainer>
            {showModal && (
              <AddBookModal
                buttonRef={buttonRef}
                handleClose={toggleModal}
                shelfUpdate={handleShelfUpdate}
              />
            )}
            {user.isLoggedIn ? (
              <AddBookLink buttonRef={buttonRef} toggleModal={toggleModal} />
            ) : (
              <AuthLinks />
            )}
            <CentralDiv>
              <Title>Currently Reading</Title>
              <Shelf
                shelfBooks={getDisplayBooks(
                  data.homepage.bookshelf.currentBooks
                )}
                shelf="currentBooks"
                handleModalUpdate={triggerBookModalUpdate}
              >
                <SeeAll route={`/${username}/shelf/current?page=1`} />
              </Shelf>
              <Title>Have Read</Title>
              <Shelf
                shelfBooks={getDisplayBooks(data.homepage.bookshelf.pastBooks)}
                shelf="pastBooks"
                handleModalUpdate={triggerBookModalUpdate}
              >
                <SeeAll route={`/${username}/shelf/past?page=1`} />
              </Shelf>
              <Title>Want to Read</Title>
              <Shelf
                shelfBooks={getDisplayBooks(
                  data.homepage.bookshelf.futureBooks
                )}
                shelf="futureBooks"
                handleModalUpdate={triggerBookModalUpdate}
              >
                <SeeAll route={`/${username}/shelf/future?page=1`} />
              </Shelf>
            </CentralDiv>
          </MainContainer>
        </>
      );
    }
  }
};

interface LinkStateProps {
  user: User;
}

const mapStateToProps = (
  state: AppState,
  ownProps: HomepageProps
): LinkStateProps => ({
  user: state.userState,
});

export default connect(mapStateToProps, null)(Homepage);

const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  // background-color: blue;
`;

const CentralDiv = styled.div`
  display: flex;
  flex-direction: column;
  // background-color: red;
`;

const Title = styled.p`
  position: relative;
  margin-left: 10%;
  font-size: 14px;
  color: white;
`;
