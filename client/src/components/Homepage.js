import React, { useEffect, useState, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import Shelf from "./Shelf";
import AddBookModal from "./AddBookModal";
import NewBookModal from "./NewBookModal";

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

function Homepage(props) {
  const [show, setModal] = useState(false);
  const [showBookModal, setBookModal] = useState(true);
  const [isbnState, dispatch] = useReducer(reducer, initialState);
  const [currentUpdates, setCurrentUpdates] = useState(0);
  const [pastUpdates, setPastUpdates] = useState(0);
  const [futureUpdates, setFutureUpdates] = useState(0);
  const buttonRef = useRef(null);

  useEffect(() => {
    async function getCurrentBookIsbns() {
      const response = await axios.get(
        "http://localhost:5000/book/getDisplayBooks",
        {
          params: { shelf: "currentBooks" },
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
  }, [currentUpdates]);

  useEffect(() => {
    async function getPastBookIsbns() {
      const response = await axios.get(
        "http://localhost:5000/book/getDisplayBooks",
        {
          params: { shelf: "pastBooks" },
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
  }, [pastUpdates]);

  useEffect(() => {
    async function getFutureBookIsbns() {
      const response = await axios.get(
        "http://localhost:5000/book/getDisplayBooks",
        {
          params: { shelf: "futureBooks" },
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
  }, [futureUpdates]);

  const changeModal = () => {
    setModal((prev) => !prev);
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

  return (
    <MainContainer>
      {show && (
        <AddBookModal
          buttonRef={buttonRef}
          handleClose={changeModal}
          shelfUpdate={handleShelfUpdate}
        />
      )}
      {showBookModal && (
        <NewBookModal
          title="Becoming"
          authors={["Michelle Obama"]}
          description="Becoming is the memoir of former United States first lady Michelle Obama published in 2018. Described by the author as a deeply personal experience, the book talks about her roots and how she found her voice, as well as her time in the White House, her public health campaign, and her role as a mother."
        />
      )}
      <Add ref={buttonRef} onClick={changeModal}>
        Add Book to Shelf
      </Add>
      <CurrentTitle>Currently Reading</CurrentTitle>
      <Shelf isbns={isbnState.currentIsbns} shelf="currentBooks">
        <Links>
          <SeeAll href="/shelf/current?page=1">See All</SeeAll>
        </Links>
      </Shelf>
      <PastTitle>Have Read</PastTitle>
      <Shelf isbns={isbnState.pastIsbns} shelf="pastBooks">
        <Links>
          <SeeAll href="/shelf/past?page=1">See All</SeeAll>
        </Links>
      </Shelf>
      <FutureTitle>Want to Read</FutureTitle>
      <Shelf isbns={isbnState.futureIsbns} shelf="futureBooks">
        <Links>
          <SeeAll href="/shelf/future?page=1">See All</SeeAll>
        </Links>
      </Shelf>
    </MainContainer>
  );
}

Homepage.propTypes = {
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userName: state.userState.userName,
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
