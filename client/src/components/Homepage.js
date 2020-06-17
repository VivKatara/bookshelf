import React, { useEffect, useState, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import Shelf from "./Shelf";
import AddBookModal from "./AddBookModal";
import NotFound from "./NotFound";
import NotLoggedInHeader from "./NotLoggedInHeader";

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
  const username = props.match.params.username;
  const [validUsername, setValidUsername] = useState(false);

  const [show, setModal] = useState(false);
  const [isbnState, dispatch] = useReducer(reducer, initialState);
  const [currentUpdates, setCurrentUpdates] = useState(0);
  const [pastUpdates, setPastUpdates] = useState(0);
  const [futureUpdates, setFutureUpdates] = useState(0);
  const buttonRef = useRef(null);
  const [bookModalUpdates, setBookModalUpdates] = useState(0);

  // If the user is not logged in, you need to find a way to make sure that this username is valid
  useEffect(() => {
    async function checkUsername() {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/checkUsername",
          { params: { username } }
        );
        if (response.status === 200) setValidUsername(true);
      } catch (e) {
        // validUsername is already set to false, so no need to set it to false again
        console.log(e);
      }
    }
    checkUsername();
  }, [username]);

  useEffect(() => {
    async function getCurrentBookIsbns() {
      const response = await axios.get(
        "http://localhost:5000/book/getDisplayBooks",
        {
          params: { username, shelf: "currentBooks" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch({
          type: "UPDATE_CURRENT",
          payload: response.data.isbn.slice(0, 6),
        });
      }
    }
    getCurrentBookIsbns();
  }, [currentUpdates, bookModalUpdates]);

  useEffect(() => {
    async function getPastBookIsbns() {
      const response = await axios.get(
        "http://localhost:5000/book/getDisplayBooks",
        {
          params: { username, shelf: "pastBooks" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch({
          type: "UPDATE_PAST",
          payload: response.data.isbn.slice(0, 6),
        });
      }
    }
    getPastBookIsbns();
  }, [pastUpdates, bookModalUpdates]);

  useEffect(() => {
    async function getFutureBookIsbns() {
      const response = await axios.get(
        "http://localhost:5000/book/getDisplayBooks",
        {
          params: { username, shelf: "futureBooks" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch({
          type: "UPDATE_FUTURE",
          payload: response.data.isbn.slice(0, 6),
        });
      }
    }
    getFutureBookIsbns();
  }, [futureUpdates, bookModalUpdates]);

  const changeModal = () => {
    setModal((prev) => !prev);
  };

  const triggerBookModalUpdate = () => {
    setBookModalUpdates((prev) => prev + 1);
  };

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
  if (validUsername) {
    return (
      <>
        {!props.isLoggedIn && <NotLoggedInHeader username={username} />}
        <MainContainer>
          <UserContext.Provider value={username}>
            {show && (
              <AddBookModal
                buttonRef={buttonRef}
                handleClose={changeModal}
                shelfUpdate={handleShelfUpdate}
              />
            )}
            {props.isLoggedIn ? (
              <Add ref={buttonRef} onClick={changeModal}>
                Add Book to Shelf
              </Add>
            ) : (
              <AuthButtons>
                <SignUp href="/register">Sign Up</SignUp>
                {/* <Divider>/</Divider> */}/<Login href="/login">Login</Login>
              </AuthButtons>
            )}
            <CurrentTitle>Currently Reading</CurrentTitle>
            <Shelf
              isbns={isbnState.currentIsbns}
              shelf="currentBooks"
              handleModalUpdate={triggerBookModalUpdate}
            >
              <Links>
                <SeeAll href={`/${username}/shelf/current?page=1`}>
                  See All
                </SeeAll>
              </Links>
            </Shelf>
            <PastTitle>Have Read</PastTitle>
            <Shelf
              isbns={isbnState.pastIsbns}
              shelf="pastBooks"
              handleModalUpdate={triggerBookModalUpdate}
            >
              <Links>
                <SeeAll href={`/${username}/shelf/past?page=1`}>See All</SeeAll>
              </Links>
            </Shelf>
            <FutureTitle>Want to Read</FutureTitle>
            <Shelf
              isbns={isbnState.futureIsbns}
              shelf="futureBooks"
              handleModalUpdate={triggerBookModalUpdate}
            >
              <Links>
                <SeeAll href={`/${username}/shelf/future?page=1`}>
                  See All
                </SeeAll>
              </Links>
            </Shelf>
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
  // background-color: #222222;
  // background-color: yellow;
`;

export const Add = styled.a`
  margin-top: 20px;
  margin-left: 80%;
  color: #287bf8;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Links = styled.div`
  position: absolute;
  width: 10%;
  display: flex;
  flex-direction: column;
  margin-left: 70%;
  margin-top: 20px;
  color: #287bf8;
  text-align: center;
  // background-color: white;
`;

const CurrentTitle = styled.p`
  position: absolute;
  color: white;
  font-size: 14px;
  margin-left: 10%;
  margin-top: 50px;
`;

const PastTitle = styled.p`
  position: absolute;
  color: white;
  font-size: 14px;
  margin-left: 10%;
  margin-top: 300px;
`;

const FutureTitle = styled.p`
  position: absolute;
  color: white;
  font-size: 14px;
  margin-left: 10%;
  margin-top: 530px;
`;

const SeeAll = styled.a`
  margin-top: 140px;
  text-decoration: none;
  color: #287bf8;
  &:hover {
    cursor: pointer;
  }
`;

export const AuthButtons = styled.div`
  margin-left: 80%;
  margin-top: 20px;
  display: inline-flex;
  // flex-direction: row;
  align-items: flex-start;
  // background-color: yellow;
  color: white;
`;

export const SignUp = styled.a`
  margin-right: 5px;
  color: #287bf8;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const Divider = styled.p``;

export const Login = styled.a`
  margin-left: 5px;
  color: #287bf8;
  text-decoration: none;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
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
