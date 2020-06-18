import React from "react";
import styled from "@emotion/styled";

function PageCount(props) {
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
}

export default React.memo(PageCount);

export const PageCountLabel = styled.p`
  position: absolute;
  margin-left: 5%;
  color: #287bf8;
`;
