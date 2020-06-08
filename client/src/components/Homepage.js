import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";
import axios from "axios";
import { getUser } from "../actions/getUserActions";

function Homepage(props) {
  useEffect(() => {
    props.getUser();
    // console.log(props);
    // async function getUserData() {
    //   await props.getUser();
    //   console.log(props.userName);
    // }
    // getUserData();

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
  }, []);
  console.log(props.userName);
  return (
    <MainContainer>
      <Header />
      <Shelf />
      <Shelf />
      <Shelf />
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
