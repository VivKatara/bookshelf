import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";
import axios from "axios";

function Homepage() {
  const testRoute = async () => {
    const firstResponse = await axios.get("http://localhost:5000/setCookies", {
      withCredentials: true,
    });
    console.log(firstResponse);
    const secondResponse = await axios.post(
      "http://localhost:5000/testCookies",
      {
        email: "YES",
      },
      { withCredentials: true }
    );
    console.log(secondResponse);
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
