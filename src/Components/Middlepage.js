import React, { useEffect, useState } from "react";
import {
  BsMusicNote,
  BsFillHeartFill,
  BsSuitHeart,
  BsSuitHeartFill,
  BsTrash3Fill,
} from "react-icons/bs";
import img from "../images/album.jpg";
import AudioPlayer from "./AudioPlayer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Config/Config";

export const Middlepage = () => {
  const [songs, setSongs] = useState([]);
  const [songImg, setSongImg] = useState({
    song: "",
    image: "",
    like: false,
    id: "",
  });

  const { song, image, like, id } = songImg;
  // console.log(songImg);

  function fileUrls(audio, image, like, id) {
    setSongImg({
      song: audio,
      image: image,
      like: like,
      id: id,
    });
  }

  useEffect(() => {
    const getSongs = async () => {
      const songDetails = await getDocs(collection(db, "album"));
      const songArr = songDetails.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      setSongs(songArr);
    };
    getSongs();
  }, [songs]);
  // console.log(songs);
  // const id = auth.currentUser.uid;

  return (
    <div className="middle-page">
      <div className="banner">
        <div className="album-banner">
          <div className="album-img">
            <img src={img} alt="album-img" />
          </div>
          <div className="album-content">
            <h4>PlayList</h4>
            <h3 className="album-heading">Happy hours playLists.</h3>
            <p className="content">
              It's your playList add what songs you want and play it. In this
              song all are listening with free.And also you like the songs, add
              new songs , delete the song.
            </p>
            <p className="likeView">
              <span className="likes">
                <i>
                  <BsFillHeartFill />
                </i>
                167,482Likes
              </span>
              .
              <span className="totalSongs">
                <i>
                  <BsMusicNote />
                </i>
                {`${songs.length} Songs`}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="songs-list">
        <div className="list-head">
          <ul>
            <li className="title-list">#Title</li>
            <li className="title-list">Album</li>
            <li className="title-list">Date added</li>
          </ul>
        </div>
        <div className="songs">
          {songs &&
            songs.map((song) => {
              return (
                <ul
                  className="song"
                  key={song.id}
                  onClick={() =>
                    fileUrls(
                      song.audioTrack,
                      song.imageLink,
                      song.like,
                      song.id
                    )
                  }
                >
                  <li className="song-url">
                    <div className="song-img">
                      <img
                        src={song.imageLink}
                        alt="song-img"
                        style={{ height: "50px", width: "50px" }}
                      />
                    </div>
                    <div className="song-details">
                      <div className="name">{song.name}</div>
                      <div className="singer">{song.artist}</div>
                    </div>
                  </li>
                  <li className="song-album">{song.album}</li>
                  <li className="song-date">
                    {song.createdAt.toDate().toDateString()}
                  </li>
                </ul>
              );
            })}
        </div>
      </div>
      <div className="player-page">
        <AudioPlayer
          song={song}
          image={image}
          like={like}
          id={id}
          songs={songs}
        />
      </div>
    </div>
  );
};
