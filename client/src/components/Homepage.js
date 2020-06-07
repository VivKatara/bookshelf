import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";
import axios from "axios";

function Homepage() {
  const testRoute = async () => {
    try {
      // Validate Status False means that axios won't automatically throw an error for status codes outside of the [200, 300) range
      let response = await axios.get("http://localhost:5000/testCookie", {
        withCredentials: true,
        validateStatus: false,
      });
      if (response.status === 403 && response.data.msg === "Invalid token") {
        // Refreshing token
        // Note that we haven't manually set validateStatus here, meaning that if there's a refresh token error, it will be immediately thrown
        // This is a good thing because there should never be a refresh token error for a genuine client
        await axios.get("http://localhost:4000/token", {
          withCredentials: true,
        });

        // Retrying the request with the updated token
        response = await axios.get("http://localhost:5000/testCookie", {
          withCredentials: true,
          validateStatus: false,
        });
      }

      // This should catch an error on the retried request, or any non Invalid Token error on first request
      if (!(response.status >= 200 && response.status < 300)) {
        throw response.data.msg;
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <MainContainer>
      <Header />
      <Shelf />
      <Shelf />
      <Shelf />
      <button onClick={testRoute}>Click Me to test route</button>
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
