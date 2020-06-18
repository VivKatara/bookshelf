import React from "react";
import styled from "@emotion/styled";

function SeeAll(props) {
  const { route } = props;
  return (
    <LinkContainer>
      <Link href={route}>See All</Link>
    </LinkContainer>
  );
}

export default SeeAll;

const LinkContainer = styled.div`
  position: absolute;
  width: 10%;
  display: flex;
  flex-direction: column;
  margin-left: 70%;
  margin-top: 20px;
  color: #287bf8;
  text-align: center;
  //   background-color: white;
`;

const Link = styled.a`
  margin-top: 140px;
  text-decoration: none;
  color: #287bf8;
  &:hover {
    cursor: pointer;
  }
`;
