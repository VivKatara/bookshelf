import React, { useState, useReducer, useRef, FunctionComponent } from "react";
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
import { useUsernameValidityCheck } from "../hooks/useUsernameValidityCheck";
import { useAbilityToGetDisplayBooks } from "../hooks/useAbilityToGetDisplayBooks";
import { useModal } from "../hooks/useModal";
import { useBookModalUpdates } from "../hooks/useBookModalUpdates";
import { AppState } from "../store/configureStore";
import {
  UPDATE_CURRENT,
  UPDATE_PAST,
  UPDATE_FUTURE,
  HomepageActionTypes,
} from "../types/actions";
import { User } from "../types/User";
import { RouteComponentProps } from "react-router-dom";
import { HomepageIsbnState } from "../types/Homepage";

const initialState: HomepageIsbnState = {
  currentIsbns: [],
  pastIsbns: [],
  futureIsbns: [],
};

const reducer = (
  state: HomepageIsbnState,
  action: HomepageActionTypes
): HomepageIsbnState => {
  switch (action.type) {
    case UPDATE_CURRENT:
      return {
        ...state,
        currentIsbns: action.payload.isbns,
      };
    case UPDATE_PAST:
      return {
        ...state,
        pastIsbns: action.payload.isbns,
      };
    case UPDATE_FUTURE:
      return {
        ...state,
        futureIsbns: action.payload.isbns,
      };
    default:
      return state;
  }
};

interface RouteParams {
  username: string;
}

interface HomepageProps {}
type Props = HomepageProps & LinkStateProps & RouteComponentProps<RouteParams>;

const Homepage: FunctionComponent<Props> = (props) => {
  // console.log("In homepage");
  const username = props.match.params.username;
  const [validUsername, setValidUsername] = useState(null);
  useUsernameValidityCheck(username, setValidUsername);

  // State for all the ISBNs that will be passed down to shelves
  const [isbnState, dispatch] = useReducer(reducer, initialState);

  // Logic to track the modal, as well as whether there were any updates to a shelf, or a particular book
  const [showModal, toggleModal] = useModal();
  const buttonRef = useRef(null);
  const [currentUpdates, setCurrentUpdates] = useState(0);
  const [pastUpdates, setPastUpdates] = useState(0);
  const [futureUpdates, setFutureUpdates] = useState(0);
  const [bookModalUpdates, triggerBookModalUpdate] = useBookModalUpdates();
  // Get user from Redux
  const { user } = props;

  useAbilityToGetDisplayBooks(
    username,
    validUsername,
    "currentBooks",
    dispatch,
    UPDATE_CURRENT,
    currentUpdates,
    bookModalUpdates
  );
  useAbilityToGetDisplayBooks(
    username,
    validUsername,
    "pastBooks",
    dispatch,
    UPDATE_PAST,
    pastUpdates,
    bookModalUpdates
  );
  useAbilityToGetDisplayBooks(
    username,
    validUsername,
    "futureBooks",
    dispatch,
    UPDATE_FUTURE,
    futureUpdates,
    bookModalUpdates
  );

  const handleShelfUpdate = (shelf: string) => {
    if (shelf === "currentBooks") {
      setCurrentUpdates((prev) => prev + 1);
    }
    if (shelf === "pastBooks") {
      setPastUpdates((prev) => prev + 1);
    }
    if (shelf === "futureBooks") {
      setFutureUpdates((prev) => prev + 1);
    }
  };

  if (validUsername === null) {
    return <Loading />;
  } else if (validUsername) {
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
              isbns={isbnState.currentIsbns}
              shelf="currentBooks"
              handleModalUpdate={triggerBookModalUpdate}
            >
              <SeeAll route={`/${username}/shelf/current?page=1`} />
            </Shelf>
            <Title>Have Read</Title>
            <Shelf
              isbns={isbnState.pastIsbns}
              shelf="pastBooks"
              handleModalUpdate={triggerBookModalUpdate}
            >
              <SeeAll route={`/${username}/shelf/past?page=1`} />
            </Shelf>
            <Title>Want to Read</Title>
            <Shelf
              isbns={isbnState.futureIsbns}
              shelf="futureBooks"
              handleModalUpdate={triggerBookModalUpdate}
            >
              <SeeAll route={`/${username}/shelf/future?page=1`} />
            </Shelf>
          </CentralDiv>
        </MainContainer>
      </>
    );
  } else {
    return <NotFound />;
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
