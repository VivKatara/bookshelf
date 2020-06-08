import React, { useEffect } from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";
import axios from "axios";

function Homepage() {
  useEffect(() => {
    // This is where you want to use Redux to dispatch an action to udpate the state of the application
    async function fetchProfileData() {
      try {
        let response = await axios.get("http://localhost:5000/profile", {
          withCredentials: true,
          validateStatus: false,
        });
        if (response.status === 200) {
          console.log(response.data.user);
          return { success: true, data: response.data.user };
        }
        if (response.status === 403 && response.data.msg === "Invalid token") {
          // Reset the access token based on refresh token
          await axios.get("http://localhost:5000/auth/token", {
            withCredentials: true,
          });
          response = await axios.get("http://localhost:5000/profile", {
            withCredentials: true,
            validateStatus: false,
          });
          if (response.status === 200) {
            console.log(response.data.user);
            return { success: true, data: response.data.user };
          } else throw response.data.msg;
        } else throw response.data.msg;
      } catch (e) {
        console.log(e);
        return { success: false, error: e };
      }
    }
    fetchProfileData();
  }, []);
  return (
    <MainContainer>
      <Header />
      <Shelf />
      <Shelf />
      <Shelf />
    </MainContainer>
  );
}

export default Homepage;

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #222222;
`;
