import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Config/Config";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [checkUser, setCheckUser] = useState({
    email: "",
    password: "",
    loading: false,
    error: null,
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(null);
  const { email, password } = checkUser;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCheckUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCheckUser({ ...checkUser, loading: true });
    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length === 0) {
        await signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            let userId = userCredential.user.uid;
            // console.log(userId);
            setCheckUser({
              email: "",
              password: "",
              loading: false,
            });
            alert("login successfully");
            navigate("/home");
          })
          .catch((error) => {
            // console.log(error);
            setAuthError(error.message);
          });
        setErrors({});
      } else {
        setErrors(validationErrors);
      }
      // console.log(user);
    } catch (error) {
      console.log(error);
    }
    setCheckUser({ ...checkUser, error: null });
  };
  const validateForm = () => {
    let validationErrors = {};
    if (!checkUser.email) {
      validationErrors.email = `email required *`;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(checkUser.email)
    ) {
      validationErrors.email = `Email is invalid *`;
    }
    if (!checkUser.password) {
      validationErrors.password = `PassWord required*`;
    }
    return validationErrors;
  };

  return (
    <div className="login">
      <form action="#" onSubmit={handleSubmit}>
        <h2 className="heading">Login</h2>
        <p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email address"
            onChange={handleChange}
            value={email}
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
            value={password}
          />
        </p>
        {errors.password && <p className="message">{errors.password}</p>}
        {authError ? <p className="message">{authError}</p> : null}
        <p className="routeLink">
          Don't have account .click to
          <Link to="/register"> create new account</Link>{" "}
        </p>

        <button type="submit">
          {checkUser.loading ? "Logging in..." : "Login"}
        </button>

        <div className="test-acc">
          <h4>Use this account to explore website.</h4>
          <p>
            Email: <span> test@gmail.com</span>
          </p>
          <p>
            Password: <span> Test@1234</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
