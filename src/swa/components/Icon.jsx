import React from "react";

const Icon = ({ id }) => {
  return <img src={`/assets/icons/${id}.svg`} alt={id} className="fa-icon" />;
};

export default Icon;
