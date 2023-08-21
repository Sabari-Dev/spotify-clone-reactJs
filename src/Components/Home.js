import React from "react";
import "../style/home.css";
import LeftSide from "./LeftSide";
import { Middlepage } from "./Middlepage";

const Home = () => {
  return (
    <div className="home-page">
      <div className="left-side">
        <LeftSide />
      </div>
      <div className="middle-side">
        <Middlepage />
      </div>
    </div>
  );
};

export default Home;
