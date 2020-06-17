import styled from "@emotion/styled";

export const MainContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #222222;
`;

export const CentralDiv = styled.div`
  width: 50%;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  text-align: center;
  color: white;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  text-align: left;
`;

export const FormHeader = styled.h3`
  @media (max-width: 400px) {
    text-align: center;
    font-size: 14px;
  }
`;

export const Label = styled.label`
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;

export const Input = styled.input`
  width: 290px;
  flex-basis: 20px; // height
  margin-top: 10px;
  padding: 2px;
  border: none;
  border-radius: 5px;
  @media (max-width: 400px) {
    width: 200px;
  }
`;

export const SubmitButton = styled.button`
  flex-basis: 30px; // height
  width: 300px;
  margin-top: 20px;
  outline: none;
  border: none;
  border-radius: 10px;
  text-align: center;
  background-color: #287bf8;
  color: #ffffff;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 400px) {
    width: 200px;
  }
`;
