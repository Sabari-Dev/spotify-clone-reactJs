import React, { useEffect, useState } from "react";
import image from "../images/profile.jpg";
import "../style/profile.css";
import { BsFillCameraFill, BsFillTrash3Fill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { storage, auth, db } from "../Config/Config";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { useNavigate, useParams, Link } from "react-router-dom";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [editUser, SetEditUser] = useState({});
  //   console.log(img);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  // const userAuth = auth.currentUser;
  useEffect(() => {
    getDoc(doc(db, "users", id))
      .then((docSnap) => {
        if (docSnap.exists) {
          setUser(docSnap.data());
          // console.log(user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
          //   console.log(snap.ref.fullPath);
          //   console.log(url);

          await updateDoc(doc(db, "users", id), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      uploadImg();
    }
  }, [img]);
  useEffect(() => {
    if (user) {
      SetEditUser(user);
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    SetEditUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        if (user.avatarPath) {
          await deleteObject(ref(storage, user.avatarPath));
        }
        const userAuth = auth.currentUser;
        await deleteUser(userAuth).then(() => {
          // console.log("user deleted");
          navigate("/register");
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteProfile = async () => {
    try {
      const confirm = window.confirm("Are you sure to delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, "users", id), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditClick = () => {
    setShowModal(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", id), editUser);
      setShowModal(false);
      alert("User details edited successfully!!");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return user ? (
    <section className="profile-page">
      <div className="profile-area">
        <div className="img-area">
          <img
            src={user.avatar || image}
            alt="avatar"
            style={{ height: "200px", width: "200px" }}
          />
          <div className="over">
            <div>
              <label htmlFor="img">
                <BsFillCameraFill />
              </label>
              {user.avatar ? (
                <BsFillTrash3Fill className="delete" onClick={deleteProfile} />
              ) : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="img"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text-area  ">
          <p>
            Name :<span>{user.name}</span>
          </p>
          <p>
            Email : <span>{user.email}</span>
          </p>
          <p>
            Date of birth: <span>{user.dateOfBirth}</span>
          </p>
          <hr />
          <small>{`Joined On :${user.createdAt
            .toDate()
            .toDateString()}`}</small>
          <br />
          <br />
          <Link to="/home" className="button">
            Back to home
          </Link>
          <button className="edit-btn" onClick={handleEditClick}>
            Edit
          </button>
          <button className="delete-btn" onClick={handleDeleteClick}>
            Delete Account
          </button>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClose={() => setShowModal(false)}>
          <div className="modal-content">
            <button
              className="modal-close-button"
              onClick={() => setShowModal(false)}
            >
              <AiOutlineClose />
            </button>
            <form action="#">
              <h2 className="heading">Edit Profile</h2>
              <p>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter Name..."
                  onChange={handleChange}
                  value={editUser.name}
                />
              </p>

              <p>
                <input
                  type="date"
                  name="dateOfBirth"
                  id="dob"
                  onChange={handleChange}
                  value={editUser.dateOfBirth}
                />
              </p>

              <p>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter email address"
                  onChange={handleChange}
                  value={editUser.email}
                />
              </p>

              <p>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={editUser.password}
                />
              </p>

              <p>
                <input
                  type="password"
                  name="confirmPassword"
                  id="CPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  value={editUser.confirmPassword}
                />
              </p>

              <p>
                <input
                  type="tel"
                  name="mobile"
                  id="mobile"
                  placeholder="Mobile Number"
                  onChange={handleChange}
                  value={editUser.mobile}
                />
              </p>

              <p>
                <select
                  name="state"
                  id="state"
                  onChange={handleChange}
                  value={editUser.state}
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </p>

              <button type="submit" className="edit-btn" onClick={handleSubmit}>
                {user.loading ? "please wait..." : "Save Edit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  ) : null;
};

export default Profile;
