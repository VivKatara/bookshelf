import React from "react";
import styled from "@emotion/styled";
import Header from "./Header";
import Shelf from "./Shelf";
import axios from "axios";

function Homepage() {
  const testRoute = async () => {
    const response = await axios.get("http://localhost:5000/testCookies", {
      withCredentials: true,
    });
    console.log(response);
    if (response.status === 403) {
      const secondResonse = await axios.get("http://localhost:4000/refresh");
      console.log("Successful refresh");
      const newResponse = await axios.get("http://localhost:5000/testCookies", {
        withCredentials: true,
      });
      console.log(newResponse);
    }
    console.log(response);
    // axios
    //   .get("http://localhost:5000/testCookies", { withCredentials: true })
    //   .then((data) => console.log(data))
    //   .catch((err) => {
    //     console.log("IN HERE");
    //     axios.get("http://localhost:4000/refresh", { withCredentails: true });
    //   });

    // try {
    //   const firstResponse = await axios.get(
    //     "http://localhost:5000/testCookies",
    //     {
    //       withCredentials: true,
    //     }
    //   );
    //   console.log(firstResponse.data.success);
    // } catch (e) {
    //   console.log("HERE");
    //   console.log(e);
    // }
    // if (!firstResponse.data.success) {
    //   console.log("HERE");
    //   const changeCookies = await axios.get("http://localhost:4000/refresh", {
    //     withCredentials: true,
    //   });
    //   // const secondResponse = await axios.get(
    //   //   "http://localhost:5000/testCookies",
    //   //   { withCredentials: true }
    //   // );
    // }
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
