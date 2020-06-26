import React from "react";
import styled from "@emotion/styled";

interface SeeAllProps {
  route: string;
}

const SeeAll: React.FC<SeeAllProps> = (props) => {
  const { route } = props;
  return (
    <LinkContainer>
      <Link href={route}>See All</Link>
    </LinkContainer>
  );
};

export default SeeAll;

const LinkContainer = styled.div`
  margin-left: auto;
  margin-right: 2%;
  align-self: flex-end;
  color: #287bf8;
  // background-color: white;
`;

const Link = styled.a`
  width: max-content;
  text-decoration: none;
  color: #287bf8;
  &:hover {
    cursor: pointer;
  }
  // background-color: red;
`;
