import React, { useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ProfileModal from "../ProfileModal";

import { useModal } from "../../hooks/useModal";

import {
  HeaderContainer,
  HyperLink,
  User,
  Username,
  Profile,
} from "../../styles/headers";

function LoggedInHeader(props) {
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

LoggedInHeader.propTypes = {
  userFullName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userFullName: state.userState.userFullName,
});

export default connect(mapStateToProps, {})(LoggedInHeader);
