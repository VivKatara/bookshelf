import React, { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useOutsideClick } from "../hooks/useOutsideClick";
import styled from "@emotion/styled";

import { logOffUser } from "../actions/setUser";

function ProfileModal(props) {
  const { buttonRef, handleClose } = props;
  const modalRef = useRef(null);
  useOutsideClick(modalRef, buttonRef, handleClose);

  const logOut = async () => {
    await props.logOffUser();
  };
  return (
    <ModalContainer ref={modalRef}>
      <Profile>Profile</Profile>
      <hr />
      <LogOutButton onClick={logOut}>Sign Out</LogOutButton>
    </ModalContainer>
  );
}

ProfileModal.propTypes = {
  logOffUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { logOffUser })(ProfileModal);

export const ModalContainer = styled.div`
  position: absolute;
  width: 200px;
  height: 100px;
  border-radius: 10px;
  background-color: #444444;
  margin-left: 85%;
  color: white;
  font-size: 14px;
`;

export const Profile = styled.p`
  margin-left: 2%;
`;

export const LogOutButton = styled.button`
  background: none;
  outline: none;
  border: none;
  color: white;
  width: 200px;
  height: 40px;
  text-align: left;

  &:hover {
    cursor: pointer;
  }
`;
