import React from "react";
import styled from "@emotion/styled";
import { MainModal } from "./AddBookModal";
import Book from "./Book";

function NewBookModal(props) {
  const { title, authors, description } = props;
  return (
    <MainModal>
      <BookDescription>
        <BookDescriptionDiv>
          <Label>Title:</Label>
          <Value>{title}</Value>
        </BookDescriptionDiv>
        <BookDescriptionDiv>
          <Label>Author(s):</Label>
          <Value>{authors}</Value>
        </BookDescriptionDiv>
        <BookDescriptionDiv>
          <Label>Description:</Label>
          <Value>{description}</Value>
        </BookDescriptionDiv>
      </BookDescription>
      <BookSettingsForm>
        <FormDiv>
          <SettingsLabel>Shelf Settings</SettingsLabel>
        </FormDiv>
        <FormDiv>
          <Label>Shelf:</Label>
          <Select id="shelf" name="shelf">
            <option value="currentBooks">Currently Reading</option>
            <option value="pastBooks">Have Read</option>
            <option value="futureBooks">Want to Read</option>
            <option value="delete">None (aka delete this book)</option>
          </Select>
        </FormDiv>
        <FormDiv>
          <Label>Display on homepage:</Label>
          <Checkbox type="checkbox"></Checkbox>
        </FormDiv>
        <FormDiv>
          <SaveChangesButton type="Submit">Save Changes</SaveChangesButton>
        </FormDiv>
      </BookSettingsForm>
    </MainModal>
  );
}

export default NewBookModal;

export const BookDescription = styled.div`
  // display: flex;
  // flex-direction: column;
  // background-color: blue;
  // overflow: auto;
`;

export const BookDescriptionDiv = styled.div`
  display: flex;
  flex-direction: row;
  // background-color: red;
  // overflow: auto;
`;

export const Label = styled.p`
  color: white;
  margin-left: 10%;
`;

export const Value = styled.p`
  position: relative;
  margin-right: 10%;
  margin-left: 2%;
  color: white;
  // background-color: green;
`;

export const BookSettingsForm = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FormDiv = styled.div`
  display: flex;
  flex-direction: row;
  // background-color: red;
  // flex-wrap: wrap;
`;

export const SettingsLabel = styled.p`
  color: #287bf8;
  margin-left: 10%;
`;

export const Select = styled.select`
  position: absolute;
  margin-left: 25%;
  margin-top: 10px;
  width: 300px;
  height: 30px;
  border: none;
  border-radius: 5px;
  padding; 5px;
`;

export const Checkbox = styled.input`
  position: absolute;
  margin-left: 40%;
  margin-top: 15px;
  outline: none;
  height: 20px;
  width: 20px;
  border-radius: 10px;
`;

export const SaveChangesButton = styled.button`
  width: 300px;
  height: 30px;
  margin-left: 25%;
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background-color: #287bf8;
  color: white;
`;
