import React from "react";
import { FaCrown } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
export const RightSide = () => {
  return (
    <div className="right-side">
      <div className="top">
        <div className="premium">
          <FaCrown />
          <p>Get Premium</p>
        </div>
      </div>
      <div className="bottom">
        <AiFillSetting />
        <p>setting</p>
      </div>
    </div>
  );
};
