import React, { useEffect, useState } from "react";

import { BsSpotify, BsDownload, BsFillHeartFill } from "react-icons/bs";
import { HiHome } from "react-icons/hi";
import { FiUpload } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

import { GrLogout } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Config/Config";

const LeftSide = () => {
  const id = auth.currentUser.uid;
  const signOut = () => {
    auth.signOut();
  };
  return (
    <div className="left-container">
      {/* title  */}
      <div className="title">
        <div className="logo">
          <i>
            <BsSpotify />
          </i>
        </div>
        <div className="name">Spotify</div>
      </div>

      {/* menu */}
      <div className="menu-page">
        <h4 className="menu-heading">menu</h4>
        <ul className="menus">
          <li className="menu-title">
            <Link to="/home">
              <i>
                <HiHome />
              </i>
              <span>Home</span>
            </Link>
          </li>
          <li className="menu-title">
            <Link to={`/profile/${id}`}>
              <i>
                <FaUser />
              </i>
              <span>Profile</span>
            </Link>
          </li>
          <li className="menu-title">
            <Link to="/likeSongs">
              <i>
                <BsFillHeartFill />
              </i>
              <span>Liked songs</span>
            </Link>
          </li>
          <li className="menu-title">
            <Link to="/upload">
              <i>
                <FiUpload />
              </i>
              <span>Upload Song</span>
            </Link>
          </li>

          <li className="menu-title">
            <a
              href="https://www.spotify.com/us/download/windows/"
              target="_blank"
              className="installApp"
            >
              <i>
                <BsDownload />
              </i>
              <span>Install App</span>
            </a>
          </li>
        </ul>
      </div>
      {/* playList */}
      {/* <div className="play-list">
        <div className="listHead">
          <h4>PlayList</h4>
          <i>
            <BsPlusLg />
          </i>
        </div>
        <div className="play-lists">
          {playList &&
            playList.map((list) => {
              return (
                <div className="listName" key={list.id}>
                  <p>
                    <i>
                      <BiSolidPlaylist />
                    </i>
                    {list.name}
                  </p>
                  <i>
                    <BsFillTrash3Fill />
                  </i>
                </div>
              );
            })}
        </div>
      </div> */}
      <div className="logout" onClick={signOut}>
        <Link to="/" className="logout-btn">
          <span>Logout</span>
          <i>
            <GrLogout />
          </i>
        </Link>
      </div>
    </div>
  );
};

export default LeftSide;
