import React from "react";

const Modal = ({ children }) => {
  return (
    <div className=" absolute left-0 top-0 m-12 h-fit w-fit">{children}</div>
  );
};

export default Modal;
