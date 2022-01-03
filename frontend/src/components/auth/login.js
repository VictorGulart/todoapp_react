import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUser } from "../../redux/action_creators/user_actions";

// COMPONENT
function LoginPage({ auth, fetchUser }) {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function getFormData(e) {
    e.preventDefault();
    fetchUser(username, password);
  }

  useEffect(() => {
    if (auth) {
      history.push("/");
    }
  }, [auth]);

  return (
    <div
      className="container-md full-page flex"
      style={{
        rowGap: "1rem",
      }}
    >
      <form
        onSubmit={getFormData}
        className="input-group"
        style={{ rowGap: "1.5rem" }}
      >
        <div className="input-group rel">
          <input
            type="text"
            name="username"
            className="input"
            placeholder=" "
            autoComplete="true"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label htmlFor="username" className="input-label--anim">
            Username
          </label>
        </div>
        <div className="input-group rel">
          <input
            type="password"
            name="password"
            className="input"
            placeholder=" "
            autoComplete="true"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <label className="input-label--anim" htmlFor="password">
            Password
          </label>
        </div>
        <button type="submit" className="btn btn-custom">
          Login
        </button>
      </form>
      <div className="register__link">
        <span>Don't have an account?</span> <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

// The loading page does not need anything from the state
const mapStateToProps = (state) => {
  const { auth } = state.fetchReducer;
  return {
    auth,
  };
};

// Add the fetchUser
const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: (username, password) => {
      dispatch(fetchUser(username, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
