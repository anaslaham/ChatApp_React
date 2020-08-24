import React from "react";
import { Link } from "react-router-dom";
import { Login as addUserData } from "../../redux/actions";
import TextField from "@material-ui/core/TextField";
import "./form.css";
import { connect } from "react-redux";
const Form = ({ addUserData, type, handelSubmit, history, cookies }) => {
  const [name, setname] = React.useState("");
  const [pass, setpass] = React.useState("");

  if (cookies.username && cookies.token) {
    const data = {
      username: cookies.username,
      token: cookies.token,
    };
    addUserData(data);
    history.push("/");
    return null;
  } else {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <form
              className="login100-form validate-form"
              onSubmit={(e) => {
                e.preventDefault();
                handelSubmit(name, pass, type, history);
              }}
            >
              <span className="login100-form-title p-b-26">
                <h3>Welcome</h3>
              </span>
              <span className="login100-form-title p-b-48">
                <h6>Please {type}</h6>
              </span>
              <TextField
                id="standard-basic"
                label="username"
                className="Roboto"
                onChange={(event) => {
                  setname(event.target.value);
                }}
                style={{
                  width: "100%",
                  marginBottom: "1.5rem",
                  color: "#b721ff",
                  borderBottomColor: "#b721ff",
                }}
              />

              <TextField
                id="standard-basic"
                label="password"
                className="Roboto"
                type="password"
                onChange={(event) => {
                  setpass(event.target.value);
                }}
                style={{
                  width: "100%",
                  marginBottom: "3rem",
                  color: "#b721ff",
                  borderBottomColor: "#b721ff",
                }}
              />

              <div className="container-login100-form-btn">
                <div className="wrap-login100-form-btn">
                  <div className="login100-form-bgbtn"></div>
                  <button className="login100-form-btn">
                    <h3>{type}</h3>
                  </button>
                </div>
              </div>
              {type !== "register" ? (
                <div className="text-center p-t-80">
                  <span className="txt1">Don’t have an account?</span>
                  <Link className="txt2" to="/register">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="text-center p-t-80">
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
  }
};

export default connect(null, { addUserData })(Form);
