import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

type Props = {
  prev: boolean;
  next: boolean;
  url: string;
  page: number;
};

const NextPreviousNavigation: FunctionComponent<Props> = (props) => {
  const { prev, next, url, page } = props;
  return (
    <>
      {prev && (
        <PreviousLink href={`${url}?page=${page - 1}`}>Previous</PreviousLink>
      )}
      {next && <NextLink href={`${url}?page=${page + 1}`}>Next</NextLink>}
    </>
  );
};

export default React.memo(NextPreviousNavigation);

export const NavigationLink = styled.a`
  position: absolute;
  margin-top: 450px;
  cursor: pointer;
  color: #287bf8;
  font-size: 16px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const PreviousLink = styled(NavigationLink)`
  margin-left: 2%;
`;

export const NextLink = styled(NavigationLink)`
  margin-left: 95%;
`;
