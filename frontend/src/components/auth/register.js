// CSS - needs to be changed, its importing for two pages login
// and register 2 times
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchCreateUser } from "../../redux/action_creators/user_actions";
import { useHistory } from "react-router-dom";

function RegisterPage({ auth, createUser }) {
  const history = useHistory();
  const [account, setAccount] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  const getFormData = (e) => {
    console.log("submitting form");
    e.preventDefault();
    createUser(account);
  };

  useEffect(() => {
    // If user was created and is authorized, redirect
    // if (auth) {
    //   history.push("/");
    // }
  }, [auth]);

  return (
    <div className="container-md full-page flex" style={{ rowGap: "1rem" }}>
      <form
        onSubmit={getFormData}
        className="input-group "
        style={{ rowGap: "1.5rem" }}
      >
        <div className="input-group rel">
          <input
            type="text"
            name="email"
            placeholder=" "
            autoComplete="true"
            onChange={(e) => {
              setAccount({
                ...account,
                email: e.target.value,
              });
            }}
          />
          <label htmlFor="email" className="input-label--anim">
            Email
          </label>
        </div>
        <div className="input-group rel">
          <input
            type="text"
            name="username"
            placeholder=" "
            autoComplete="true"
            onChange={(e) => {
              setAccount({
                ...account,
                username: e.target.value,
              });
            }}
          />
          <label htmlFor="username" className="input-label--anim">
            Username
          </label>
        </div>
        <div className="input-group rel">
          <input
            name="password"
            type="password"
            placeholder=" "
            autoComplete="true"
            onChange={(e) => {
              setAccount({
                ...account,
                password: e.target.value,
              });
            }}
          />
          <label htmlFor="password" className="input-label--anim">
            Password
          </label>
        </div>
        <div className="input-group rel">
          <input
            name="password2"
            type="password"
            placeholder=" "
            autoComplete="true"
            onChange={(e) => {
              setAccount({
                ...account,
                confirm_password: e.target.value,
              });
            }}
          />
          <label htmlFor="password2" className="input-label--anim">
            Password Confirmation
          </label>
        </div>
        <button type="submit" className="btn btn-custom">
          Register
        </button>
      </form>
      <div className="register__link">
        <span>You have an account? </span>
        <Link to="/login">Login</Link>
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

const mapDispatchToProps = (dispatch) => {
  return {
    createUser: (user) => {
      dispatch(fetchCreateUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
