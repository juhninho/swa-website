import React from "react";

const Loading = ({ height }) => {
  return (
    <div
      className="d-flex justify-content-center"
      style={{ height: height ?? "78vh", alignItems: "center" }}
    >
      <div className="spinner-border" role="status"></div>
    </div>
  );
};

export default Loading;
