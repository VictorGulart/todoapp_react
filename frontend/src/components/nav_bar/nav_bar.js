import "./nav_bar.css";
import { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";

import { connect } from "react-redux";
import { userLogOut } from "../../redux/action_creators/user_actions";

export function NavBar({ auth, token, logUserOut }) {
  const [show, setShow] = useState(false);

  const history = useHistory();

  const onClickLogOut = (e) => {
    e.preventDefault();
    logUserOut(token);
    history.push("/login");
  };

  return (
    <nav className="navbar navbar-expand-sm" style={{ padding: "0rem 0.8rem" }}>
      <div
        className="navbar-toggler menu-bars"
        onClick={(e) => {
          setShow(!show);
        }}
        type="button"
      >
        <i className="fas fa-bars"></i>
      </div>

      <div
        className={
          show ? "collapse navbar-collapse show" : "collapse navbar-collapse"
        }
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="menu-link" to="/">
              Home
            </Link>
          </li>
          {auth ? (
            <li className="nav-item" onClick={onClickLogOut}>
              <Link className="menu-link" to="/login">
                Sign Out
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="menu-link" to="/login">
                Login
              </Link>
              <span>|</span>
              <Link className="menu-link" to="/register">
                Register
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

const mapStateToProps = (state) => {
  const { auth, token } = state.fetchReducer;
  return {
    auth,
    token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logUserOut: (token) => {
      dispatch(userLogOut(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
