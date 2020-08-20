import React from "react";
import { Link } from "react-router-dom";
import "./form.css";
const Form = ({ type, handelSubmit, history }) => {
  const [name, setname] = React.useState("");
  const [pass, setpass] = React.useState("");
  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form
            className="login100-form validate-form"
            onSubmit={(e) => {
              e.preventDefault();
              handelSubmit(name, pass, type,history);
            }}
          >
            <span className="login100-form-title p-b-26">
              <h3>Welcome</h3>
            </span>
            <span className="login100-form-title p-b-48">
              <h6>Please {type}</h6>
            </span>

            <div className="wrap-input100 validate-input">
              <input
                className="input100"
                type="text"
                name="username"
                onChange={(event) => {
                  setname(event.target.value);
                }}
              />
              <span
                className="focus-input100"
                data-placeholder="Username"
              ></span>
            </div>

            <div
              className="wrap-input100 validate-input"
              data-validate="Enter password"
            >
              <span className="btn-show-pass">
                <i className="zmdi zmdi-eye"></i>
              </span>
              <input
                className="input100"
                type="password"
                name="pass"
                onChange={(event) => {
                  setpass(event.target.value);
                }}
              />
              <span
                className="focus-input100"
                data-placeholder="Password"
              ></span>
            </div>

            <div className="container-login100-form-btn">
              <div className="wrap-login100-form-btn">
                <div className="login100-form-bgbtn"></div>
                <button className="login100-form-btn">
                  <h3>{type}</h3>
                </button>
              </div>
            </div>
            {type !== "register" ? (
              <div className="text-center p-t-115">
                <span className="txt1">Don’t have an account?</span>
                <Link className="txt2" to="/register">
                  Sign Up
                </Link>
              </div>
            ):  (
              <div className="text-center p-t-115">
                <span className="txt1">Already have an account?</span>
                <Link className="txt2" to="/login">
                  Login
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default Form;
