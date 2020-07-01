import React, { useRef, FunctionComponent } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "@emotion/styled";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { startLogOffUser } from "../../actions/user";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../../types/actions";

type ProfileModalProps = {
  buttonRef: React.MutableRefObject<HTMLElement | null>; // TODO: Not sure if this is the right type for buttonRef
  handleClose: () => void;
};

type Props = ProfileModalProps & LinkDispatchProps;

const ProfileModal: FunctionComponent<Props> = (props) => {
  const { buttonRef, handleClose, startLogOffUser } = props;
  const history = useHistory();

  // Closes modal window when there's an outside click
  const modalRef = useRef(null);
  useOutsideClick(modalRef, buttonRef, handleClose);

  const logOut: () => Promise<void> = async () => {
    await startLogOffUser();
    history.push("/");
  };

  return (
    <ModalContainer ref={modalRef}>
      <Profile>Profile</Profile>
      <hr />
      <LogOutButton onClick={logOut}>Sign Out</LogOutButton>
    </ModalContainer>
  );
};

type LinkDispatchProps = {
  startLogOffUser: () => void;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>,
  ownProps: ProfileModalProps
): LinkDispatchProps => ({
  startLogOffUser: bindActionCreators(startLogOffUser, dispatch),
});

export default connect(null, mapDispatchToProps)(ProfileModal);

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
