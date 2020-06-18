import styled from "@emotion/styled";

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid white;
  font-size: 20px;
  background-color: #222222;
  color: #ffffff;

  @media (max-width: 400px) {
    font-size: 14px;
  }
  // background-color: red;
`;

export const HyperLink = styled.a`
  margin-left: 10%;
  color: white;
  text-decoration: none;
  &:hover {
    color: #287bf8;
  }
`;

export const User = styled.div`
  margin-left: auto;
  margin-right: 5%;
  display: flex;
  flex-direction: row;
  align-items: baseline;

  @media (max-width: 400px) {
    margin-right: 10px;
  }
  // background-color: green;
`;

export const Username = styled.p`
  margin-right: 30px;

  @media (max-width: 400px) {
    margin-right: 10px;
  }
`;

export const Profile = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid white;
  border-radius: 50%;
  font-size: 20px;
  background-color: red;
  color: white;

  &:hover {
    cursor: pointer;
  }

  &:active,
  &:focus {
    text-decoration: none;
    outline: none;
  }

  @media (max-width: 400px) {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
`;
