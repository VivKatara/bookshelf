import styled from "@emotion/styled";

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const CentralDiv = styled.div`
  width: 50%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const Button = styled.button`
  outline: none;
  border: none;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
  }
`;
