import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Config/Config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    state: "",
    loading: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUser({ ...user, loading: true });
    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        await createUserWithEmailAndPassword(auth, user.email, user.password)
          .then((userCredential) => {
            const userId = userCredential.user.uid;
            console.log(userId);
            setDoc(doc(db, "users", userId), {
              ...user,
              createdAt: Timestamp.fromDate(new Date()),
            });
            setUser({
              name: "",
              email: "",
              dateOfBirth: "",
              password: "",
              confirmPassword: "",
              mobile: "",
              state: "",
              loading: false,
            });
          })
          .catch((error) => {
            console.log(error);
          });

        setErrors({});
        alert("user created successfully");
        navigate("/");
      } else {
        setErrors(validationErrors);
        setUser({ ...user, loading: false });
      }
      // console.log(user);
    } catch (error) {
      console.log(error);
    }
  };
  const validateForm = () => {
    let validationErrors = {};
    if (!user.name) {
      validationErrors.name = `Name required *`;
    }
    if (!user.dateOfBirth) {
      validationErrors.dateOfBirth = "Date of birth required *";
    }
    if (!user.email) {
      validationErrors.email = `email required *`;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email)
    ) {
      validationErrors.email = `Email is invalid *`;
    }
    if (!user.password) {
      validationErrors.password = `Enter password`;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(user.password)) {
      validationErrors.password = `At least 8 characters long,
Contains at least one uppercase letter,
Contains at least one lowercase letter,
Contains at least one digit,
Allows special characters`;
    }
    if (!user.confirmPassword) {
      validationErrors.confirmPassword = `Enter confirm password`;
    } else if (user.password !== user.confirmPassword) {
      validationErrors.confirmPassword = `Password and confirm Password not same `;
    }
    if (!user.mobile) {
      validationErrors.mobile = "Mobile number required";
    } else if (!/^[0-9]{10}$/.test(user.mobile)) {
      validationErrors.mobile = "Invalid mobile number";
    }
    if (!user.state) {
      validationErrors.state = "State selection required";
    }
    return validationErrors;
  };
  return (
    <div className="register">
      <form action="#" onSubmit={handleSubmit}>
        <h2 className="heading">Create new account</h2>
        <p>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter Name..."
            onChange={handleChange}
            value={user.name}
          />
        </p>
        {errors.name && <p className="message">{errors.name}</p>}
        <p>
          <input
            type="date"
            name="dateOfBirth"
            id="dob"
            onChange={handleChange}
            value={user.dateOfBirth}
          />
        </p>
        {errors.dateOfBirth && <p className="message">{errors.dateOfBirth}</p>}
        <p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email address"
            onChange={handleChange}
            value={user.email}
          />
        </p>
        {errors.email && <p className="message">{errors.email}</p>}
        <p>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            value={user.password}
          />
        </p>
        {errors.password && <p className="message">{errors.password}</p>}
        <p>
          <input
            type="password"
            name="confirmPassword"
            id="CPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={user.confirmPassword}
          />
        </p>
        {errors.confirmPassword && (
          <p className="message">{errors.confirmPassword}</p>
        )}
        <p>
          <input
            type="tel" // Use "tel" type for mobile numbers
            name="mobile"
            id="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
            value={user.mobile}
          />
        </p>
        {errors.mobile && <p className="message">{errors.mobile}</p>}
        <p>
          <select
            name="state"
            id="state"
            onChange={handleChange}
            value={user.state}
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
        {errors.state && <p className="message">{errors.state}</p>}
        <p className="routeLink">
          Already have account then.click to
          <Link to="/"> Login Page</Link>
        </p>
        <button type="submit">
          {user.loading ? "please wait..." : "Create an account"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
