// CSS - needs to be changed, its importing for two pages login
// and register 2 times
import { connect } from "react-redux";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="container-md full-page flex" style={{ rowGap: "1rem" }}>
      <form className="input-group " style={{ rowGap: "1.5rem" }}>
        <div className="input-group rel">
          <input
            type="text"
            name="username"
            placeholder=" "
            autoComplete="true"
          />
          <label htmlFor="username" className="input-label--anim">
            Username
          </label>
        </div>
        <div className="input-group rel">
          <input
            name="password1"
            type="password"
            placeholder=" "
            autoComplete="true"
          />
          <label htmlFor="password1" className="input-label--anim">
            Password
          </label>
        </div>
        <div className="input-group rel">
          <input
            name="password2"
            type="password"
            placeholder=" "
            autoComplete="true"
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

const mapDispatchToProps = (dispatch) => {
  return {
    createAccount: dispatch(fetchCreateAccount()),
  };
};

export default connect(null, mapDispatchToProps)(RegisterPage);
