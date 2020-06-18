import React, { useEffect, useState, useReducer, useRef } from "react";
import PropTypes from "prop-types";
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

const initialState = {
  currentIsbns: [],
  pastIsbns: [],
  futureIsbns: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_CURRENT":
      return {
        ...state,
        currentIsbns: action.payload,
      };
    case "UPDATE_PAST":
      return {
        ...state,
        pastIsbns: action.payload,
      };
    case "UPDATE_FUTURE":
      return {
        ...state,
        futureIsbns: action.payload,
      };
    default:
      return state;
  }
};

export const UserContext = React.createContext();

function Homepage(props) {
  // Acquire the username from route parameters and check if it is valid
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
  useAbilityToGetDisplayBooks(
    username,
    validUsername,
    "currentBooks",
    dispatch,
    "UPDATE_CURRENT",
    currentUpdates,
    bookModalUpdates
  );
  useAbilityToGetDisplayBooks(
    username,
    validUsername,
    "pastBooks",
    dispatch,
    "UPDATE_PAST",
    pastUpdates,
    bookModalUpdates
  );
  useAbilityToGetDisplayBooks(
    username,
    validUsername,
    "futureBooks",
    dispatch,
    "UPDATE_FUTURE",
    futureUpdates,
    bookModalUpdates
  );

  const handleShelfUpdate = (shelf) => {
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
        {!props.isLoggedIn && <NotLoggedInHeader username={username} />}
        <MainContainer>
          <UserContext.Provider value={username}>
            {showModal && (
              <AddBookModal
                buttonRef={buttonRef}
                handleClose={toggleModal}
                shelfUpdate={handleShelfUpdate}
              />
            )}
            {props.isLoggedIn ? (
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
          </UserContext.Provider>
        </MainContainer>
      </>
    );
  } else {
    // Here, we will make a not found component to display
    return <NotFound />;
  }
}

Homepage.propTypes = {
  username: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  username: state.userState.username,
  isLoggedIn: state.userState.isLoggedIn,
});

export default connect(mapStateToProps, {})(Homepage);

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
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

// This is where you want to use Redux to dispatch an action to udpate the state of the application
// async function fetchProfileData() {
//   try {
//     let response = await axios.get("http://localhost:5000/profile", {
//       withCredentials: true,
//       validateStatus: false,
//     });
//     if (response.status === 200) {
//       console.log(response.data.user);
//       return { success: true, data: response.data.user };
//     }
//     if (response.status === 403 && response.data.msg === "Invalid token") {
//       // Reset the access token based on refresh token
//       await axios.get("http://localhost:5000/auth/token", {
//         withCredentials: true,
//       });
//       response = await axios.get("http://localhost:5000/profile", {
//         withCredentials: true,
//         validateStatus: false,
//       });
//       if (response.status === 200) {
//         console.log(response.data.user);
//         return { success: true, data: response.data.user };
//       } else throw response.data.msg;
//     } else throw response.data.msg;
//   } catch (e) {
//     console.log(e);
//     return { success: false, error: e };
//   }
// }
// fetchProfileData();
