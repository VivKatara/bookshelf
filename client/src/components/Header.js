import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "@emotion/styled";

function Header(props) {
  return (
    <HeaderContainer>
      <HyperLink href="/home">
        <p>Bookshelf</p>
      </HyperLink>
      <User>
        <p>{props.userName}</p>
      </User>
    </HeaderContainer>
  );
}

Header.propTypes = {
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userName: state.userState.userName,
});

export default connect(mapStateToProps, {})(Header);

const HeaderContainer = styled.div`
  width: 100%;
  min-height: 50px;
  border-bottom: 1px solid white;
  display: flex;
  flex-direction: row;
  color: #ffffff;
  font-size: 20px;
  background-color: #222222;
  // background-color: blue;
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
  //   background-color: green;
`;
