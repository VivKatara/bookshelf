import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

interface Props {
  show: boolean;
  page: number;
  totalPages: number;
}

const PageCount: FunctionComponent<Props> = (props) => {
  const { show, page, totalPages } = props;
  return (
    <>
      {show && (
        <PageCountLabel>
          Page {page} of {totalPages}
        </PageCountLabel>
      )}
    </>
  );
};

export default React.memo(PageCount);

export const PageCountLabel = styled.p`
  position: absolute;
  margin-left: 5%;
  color: #287bf8;
`;
