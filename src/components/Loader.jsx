import React from "react";
import { ColorRing } from "react-loader-spinner";
import styled from "styled-components";

const Spinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loader = () => {
  return (
    <Spinner>
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#FF8E26", "#f47e60", "#f8b26a", "#31322E", "#000000"]}
      />
    </Spinner>
  );
};

export default Loader;
