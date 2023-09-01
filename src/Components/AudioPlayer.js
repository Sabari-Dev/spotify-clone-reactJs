import React, { useEffect, useRef, useState } from "react";
import noSong from "../images/nosong.jpg";
import "../style/audioPlayer.css";
import {
  BsSuitHeart,
  BsSuitHeartFill,
  BsFillPlayFill,
  BsPauseFill,
  BsTrash3Fill,
} from "react-icons/bs";
import { AiFillStepForward, AiFillStepBackward } from "react-icons/ai";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Config/Config";
import { deleteObject, ref } from "firebase/storage";

const AudioPlayer = ({ song, image, like, id }) => {
  const [isLike, setIsLike] = useState(like);
  const [play, setPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // console.log(songs);
  const audioPlay = useRef();
  const progressBar = useRef();
  const animationRef = useRef();
  useEffect(() => {
    const seconds = Math.floor(audioPlay.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [
    audioPlay?.current?.loadedmetadata,
    audioPlay?.current?.readyState,
    song,
    image,
  ]);

  const calculateMin = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;

    const seconds = Math.floor(sec % 60);
    const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${returnMin}:${returnSec}`;
  };
  const whilePlaying = () => {
    progressBar.current.value = audioPlay.current.currentTime;
    changeCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };
  const changeProgress = () => {
    audioPlay.current.currentTime = progressBar.current.value;
    changeCurrentTime();
  };
  const changeCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--played-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };
  const onLike = async () => {
    try {
      const newLikeStatus = !isLike;
      await updateDoc(doc(db, "album", id), { like: newLikeStatus });
      setIsLike(newLikeStatus);
    } catch (error) {
      console.log(error);
    }
  };
  const onPlay = () => {
    const prevValue = play;
    if (!prevValue) {
      audioPlay.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlay.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
    setPlay(!prevValue);
  };

  const deleteSong = async () => {
    if (window.confirm("Are you sure you want to delete this song?")) {
      try {
        // Get the document data to retrieve the image URL
        const songDoc = await getDoc(doc(db, "album", id));
        const songData = songDoc.data();

        // Delete the song document from Firestore
        await deleteDoc(doc(db, "album", id));

        // Delete the song file from Firebase Storage
        const songStorageRef = ref(storage, `songs/${song}`);
        await deleteObject(songStorageRef);

        // Delete the image file from Firebase Storage (assuming the image URL is stored in songData.image)
        if (songData.image) {
          const imageStorageRef = ref(storage, `images/${image}`);
          await deleteObject(imageStorageRef);
        }

        // Clear the song and image URLs
        image = null;
        song = null;
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="audio-player">
      <div className="audio-img">
        <img src={image ? image : noSong} alt="audioImage" />
      </div>
      <div className="player">
        <audio src={song} preload="metadata" ref={audioPlay} />
        <div className="top">
          <div className="left" onClick={onLike}>
            {isLike ? (
              <i>
                <BsSuitHeartFill />
              </i>
            ) : (
              <i>
                <BsSuitHeart />
              </i>
            )}
          </div>

          <div className="middle">
            <div className="previous">
              <i>
                <AiFillStepBackward />
              </i>
            </div>
            <div className="pausePlay" onClick={onPlay}>
              {!play ? (
                <i>
                  <BsFillPlayFill />
                </i>
              ) : (
                <i>
                  <BsPauseFill />
                </i>
              )}
            </div>
            <div className="next">
              <i>
                <AiFillStepForward />
              </i>
            </div>
          </div>
          <div className="right">
            {song ? (
              <i className="delete" onClick={deleteSong}>
                <BsTrash3Fill />
              </i>
            ) : null}
          </div>
        </div>
        <div className="bottom">
          <div className="start-time">{calculateMin(currentTime)}</div>
          <input
            type="range"
            name="audio-bar"
            id="audio-bar"
            ref={progressBar}
            onChange={changeProgress}
          />
          <div className="duration-time">
            {duration && !isNaN(duration) && calculateMin(duration)
              ? calculateMin(duration)
              : `00:00`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
