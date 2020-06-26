import React, { useRef } from "react";

import ProfileModal from "../modals/ProfileModal";

import { useModal } from "../../hooks/useModal";

import {
  HeaderContainer,
  HyperLink,
  User,
  Username,
  Profile,
} from "../../styles/headers";
import { ModalHook } from "../../types/ModalHook";

interface LoggedInProps {
  userFullName: string;
}

const LoggedInHeader: React.FC<LoggedInProps> = (props) => {
  const { userFullName } = props;
  const [show, toggleModal]: ModalHook = useModal();
  const buttonRef = useRef(null);
  return (
    <>
      <HeaderContainer>
        <HyperLink href="/">
          <p>Bookshelf</p>
        </HyperLink>
        <User>
          <Username>{userFullName}</Username>
          <Profile ref={buttonRef} onClick={toggleModal}>
            {userFullName[0]}
          </Profile>
        </User>
      </HeaderContainer>
      {show && <ProfileModal buttonRef={buttonRef} handleClose={toggleModal} />}
    </>
  );
};

export default React.memo(LoggedInHeader);
