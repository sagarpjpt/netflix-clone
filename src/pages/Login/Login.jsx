import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../../firebase";
import netflix_spinner from "../../assets/netflix_spinner.gif";

const Login = () => {
  // state var to store form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [signState, setSignState] = useState("Sign In");
  const navigate = useNavigate();

  const user_auth = async (event) => {
    event.preventDefault(); // will not refresh the pg whenever submit the form
    setLoading(true);
    if (signState === "Sign In") {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
    setLoading(false);
  };

  return loading ? (
    <div className="spinner">
      <div class="netflix-spinner"></div>
    </div>
  ) : (
    <div className="login">
      <img
        src={logo}
        alt=""
        className="login-logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="login-form">
        <h1>{signState}</h1>
        <form action="">
          {signState === "Sign Up" ? (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          ) : (
            <></>
          )}

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button onClick={user_auth} type="submit">
            {signState}
          </button>
          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Remember Me</label>
            </div>
            <p>Need Help?</p>
          </div>
        </form>
        <div className="form-switch">
          {signState === "Sign In" ? (
            <p>
              New to Netflix?{" "}
              <span
                onClick={() => {
                  setSignState("Sign Up");
                }}
              >
                Sign Up Now
              </span>
            </p>
          ) : (
            <p>
              Already have account?
              <span
                onClick={() => {
                  setSignState("Sign In");
                }}
              >
                Sign In Now
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
