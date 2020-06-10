import React, { useEffect, useState, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";
import AddBookModal from "./AddBookModal";
import { getUser } from "../actions/getUserActions";

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
  const [isbnState, dispatch] = useReducer(reducer, initialState);
  const [currentUpdates, setCurrentUpdates] = useState(0);
  const [pastUpdates, setPastUpdates] = useState(0);
  const [futureUpdates, setFutureUpdates] = useState(0);

  useEffect(() => {
    props.getUser();
  }, []);

  useEffect(() => {
    async function getCurrentBookIsbns() {
      const response = await axios.get("http://localhost:5000/book/getBooks", {
        params: { shelf: "currentBooks" },
        withCredentials: true,
      });
      if (response.status === 200) {
        dispatch({ type: "UPDATE_CURRENT", payload: response.data.isbn });
      }
    }
    getCurrentBookIsbns();
  }, [currentUpdates]);

  useEffect(() => {
    async function getPastBookIsbns() {
      const response = await axios.get("http://localhost:5000/book/getBooks", {
        params: { shelf: "pastBooks" },
        withCredentials: true,
      });
      if (response.status === 200) {
        dispatch({ type: "UPDATE_PAST", payload: response.data.isbn });
      }
    }
    getPastBookIsbns();
  }, [pastUpdates]);

  useEffect(() => {
    async function getFutureBookIsbns() {
      const response = await axios.get("http://localhost:5000/book/getBooks", {
        params: { shelf: "futureBooks" },
        withCredentials: true,
      });
      if (response.status === 200) {
        dispatch({ type: "UPDATE_FUTURE", payload: response.data.isbn });
      }
    }
    getFutureBookIsbns();
  }, [futureUpdates]);

  const showModal = () => {
    setModal(true);
  };
  const hideModal = () => {
    setModal(false);
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
      <Header />
      {show && (
        <AddBookModal
          show={show}
          handleClose={hideModal}
          shelfUpdate={handleShelfUpdate}
        />
      )}
      <Add onClick={showModal}>Add Book to Shelf</Add>
      <Shelf shelfName="Currently Reading" isbns={isbnState.currentIsbns}>
        <Links>
          <SeeAll
            href={`${props.match.path}/currentBooks`}
            onClick={() => console.log("Yes")}
          >
            See All
          </SeeAll>
        </Links>
      </Shelf>
      <Shelf shelfName="Have Read" isbns={isbnState.pastIsbns}>
        <Links>
          <SeeAll onClick={() => console.log("Yes")}>See All</SeeAll>
        </Links>
      </Shelf>
      <Shelf shelfName="Want to Read" isbns={isbnState.futureIsbns}>
        <Links>
          <SeeAll onClick={() => console.log("Yes")}>See All</SeeAll>
        </Links>
      </Shelf>
    </MainContainer>
  );
}

Homepage.propTypes = {
  getUser: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userName: state.userState.userName,
});

export default connect(mapStateToProps, { getUser })(Homepage);

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #222222;
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
