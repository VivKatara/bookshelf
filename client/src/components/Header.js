import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import ProfileModal from "./ProfileModal";

import { useModal } from "../hooks/useModal";

function Header(props) {
  const [show, toggleModal] = useModal();
  const buttonRef = useRef(null);

  return (
    <>
      <HeaderContainer>
        <HyperLink href="/">
          <p>Bookshelf</p>
        </HyperLink>
        <User>
          <Username>{props.userFullName}</Username>
          <Profile ref={buttonRef} onClick={toggleModal}>
            {props.userFullName[0]}
          </Profile>
        </User>
      </HeaderContainer>
      {show && <ProfileModal buttonRef={buttonRef} handleClose={toggleModal} />}
    </>
  );
}

Header.propTypes = {
  userFullName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userFullName: state.userState.userFullName,
});

export default connect(mapStateToProps, {})(Header);

const HeaderContainer = styled.div`
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
`;

const HyperLink = styled.a`
  margin-left: 10%;
  color: white;
  text-decoration: none;
  &:hover {
    color: #287bf8;
  }
`;

const User = styled.div`
  margin-left: auto;
  margin-right: 10%;
  flex-basis: 50%;
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 400px) {
    margin-right: 10px;
  }
`;

const Username = styled.p`
  margin-right: 30px;

  @media (max-width: 400px) {
    margin-right: 10px;
  }
`;

const Profile = styled.button`
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
