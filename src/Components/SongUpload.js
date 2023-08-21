import React, { useState } from "react";
import { storage, db } from "../Config/Config";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import "../style/songAdd.css";
import { useNavigate } from "react-router-dom";

const SongUpload = () => {
  const [songAdd, setSongAdd] = useState({
    name: "",
    artist: "",
    album: "",
    loading: false,
    like: false,
  });
  const [audioUrl, setAudioUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [playList, setPlayList] = useState({
    audioTrack: "",
    imageLink: "",
    loading: false,
  });

  const handleChange = (e) => {
    e.preventDefault();
    return setSongAdd((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const uploadUrls = async (e) => {
    e.preventDefault();
    try {
      setPlayList({ ...playList, loading: true });
      //upload image
      if (!audioUrl == "" && !imageUrl == "") {
        let imgUrl = "";
        const imageRef = ref(
          storage,
          `images/${new Date().getTime()}-${imageUrl.name}`
        );
        const snap = await uploadBytes(imageRef, imageUrl);
        imgUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));

        console.log(imgUrl);
        // Upload audio file
        let audUrl = "";
        const audioRef = ref(
          storage,
          `songs/${new Date().getTime()}-${audioUrl.name}`
        );
        const snapAud = await uploadBytes(audioRef, audioUrl);
        audUrl = await getDownloadURL(ref(storage, snapAud.ref.fullPath));

        console.log(audUrl);

        if (imgUrl && audUrl) {
          setPlayList((prev) => ({
            ...prev,
            audioTrack: audUrl,
            imageLink: imgUrl,
            loading: false,
          }));
        }
        alert("song uploaded");
      } else {
        alert("Please check the input files . Song or image is not added.");
        setPlayList({ ...playList, loading: false });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(songAdd);
    console.log(playList);
    setSongAdd({ ...songAdd, loading: true });
    let songs = { ...songAdd, ...playList };

    await addDoc(collection(db, "album"), {
      ...songs,
      createdAt: Timestamp.fromDate(new Date()),
    });
    setSongAdd({
      name: "",
      artist: "",
      album: "",
      loading: false,
      like: false,
    });
    setPlayList({
      audioTrack: "",
      imageLink: "",
    });
    if (
      !window.confirm(
        "Song added successfully.If you want add another song then click 'Yes' ."
      )
    ) {
      navigate("/home");
    }
  };

  return (
    <div className="song-add">
      <form>
        <h2>Upload your Song</h2>
        <label htmlFor="name">Song Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={songAdd.name}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="album">Album:</label>
        <input
          type="text"
          id="album"
          name="album"
          value={songAdd.album}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="artist">Artist:</label>
        <input
          type="text"
          id="artist"
          name="artist"
          value={songAdd.artist}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <label htmlFor="imageUrl">Album Cover Image:</label>
        <input
          type="file"
          id="imageUrl"
          name="imageUrl"
          onChange={(e) => setImageUrl(e.target.files[0])}
          accept="image/*"
          required
        />
        <br />
        <br />

        <label htmlFor="audioUrl">Audio File:</label>
        <input
          type="file"
          id="audioUrl"
          name="audioUrl"
          onChange={(e) => setAudioUrl(e.target.files[0])}
          accept="audio/*"
          required
        />
        <br />

        <p>First Click the upload.and after that click submit.</p>
        <br />
        <button onClick={uploadUrls}>
          {playList.loading ? "Please wait..." : "upload"}
        </button>
        <button type="submit" onClick={handleFormSubmit}>
          {songAdd.loading ? "Adding song ..." : "submit"}
        </button>
      </form>
    </div>
  );
};

export default SongUpload;
