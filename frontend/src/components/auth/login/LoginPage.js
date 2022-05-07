import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { hideErrors } from "../../../redux/action_creators/errors_actions";
import { fetchUser } from "../../../redux/action_creators/user_actions";
import Message from "../../messages/Message";
import { fetchLists } from "../../../redux/action_creators/lists_actions";

function LoginPage({ errors, loginUser, cleanErrors, auth }) {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  let history = useHistory(); // react v6 uses "useNavigate hook"

  // to print errors received on the response
  const messages = errors.form_related.map((error, idx) => {
    return <Message key={idx + "_fail"} type="FAIL" value={error} />;
  });

  useEffect(() => {
    window.onbeforeunload = () => {
      cleanErrors();
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return auth ? (
    <Redirect to="/" />
  ) : (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      {/* top of website notification */}
      {messages}

      <form
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          cleanErrors();
          loginUser(user);
        }}
        className="flex flex-col w-full h-full items-center justify-center bg-green-100  gap-y-2 rounded-md"
        style={{ minHeight: "fit-content" }}
      >
        <div className="flex items-center justify-center mb-3 font-bold">
          <h2
            className="text-green-400 text-4xl"
            style={{ fontFamily: "Indie Flower" }}
          >
            To Do App
          </h2>
        </div>
        <div className="flex flex-col w-72">
          {/* non-field-error */}
          {errors && errors.fields.hasOwnProperty("non_field_errors") ? (
            errors.fields.non_field_errors.map((error, idx) => {
              return (
                <span
                  key={`${idx}_error`}
                  className="w-4/5 mb-1 text-center self-center rounded-md bg-red-100 text-gray-800 text-xs"
                >
                  {error}
                </span>
              );
            })
          ) : (
            <span></span>
          )}
        </div>
        <div className="flex flex-col w-72">
          <div className="flex">
            <label
              className="p-2 bg-green-400 rounded-l-md flex items-center justify-center"
              style={{ width: "50px" }}
              htmlFor="username"
            >
              <span>
                <i className="fa-solid fa-at text-white"></i>
              </span>
            </label>
            <input
              className="w-full p-2 rounded-r-md border-b-2 border-transparent hover:outline-0 focus:outline-0 hover:border-green-300 focus:border-green-400"
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username*"
              onChange={(e) => {
                setUser({ ...user, username: e.target.value });
              }}
            />
          </div>
          {errors && errors.fields.hasOwnProperty("username") ? (
            <span className="w-4/5 mt-1 text-center self-center rounded-md bg-red-100 text-gray-800 text-xs">
              {errors.fields.username[0]}
            </span>
          ) : (
            <span></span>
          )}
        </div>
        <div className="flex flex-col w-72">
          <div className="flex">
            <label
              className="p-2 bg-green-400 rounded-l-md flex items-center justify-center"
              style={{ width: "50px" }}
              htmlFor="password"
            >
              <span>
                <i className="fa-solid fa-key text-white"></i>
              </span>
            </label>
            <input
              className="w-full p-2 rounded-r-md border-b-2 border-transparent hover:outline-0 focus:outline-0 hover:border-green-300 focus:border-green-400"
              type="password"
              name="password"
              id="password"
              placeholder="******"
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />
          </div>
          {errors && errors.fields.hasOwnProperty("password") ? (
            <span className="w-4/5 mt-1 text-center self-center rounded-md bg-red-100 text-gray-800 text-xs">
              {errors.fields.password[0]}
            </span>
          ) : (
            <span></span>
          )}
        </div>
        <button
          className="w-72 p-2 bg-green-400 rounded-md text-white font-bold hover:bg-green-500"
          type="submit"
        >
          Login
        </button>
        <div>
          <span>
            Do you have an account?{" "}
            <a
              className="text-sky-600 hover:cursor-default"
              onClick={() => {
                history.push("/register");
              }}
            >
              Register.
            </a>
          </span>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    errors: state.errorsReducer.errors,
    auth: state.fetchReducer.auth,
    token: state.fetchReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (user) => {
      dispatch(fetchUser(user.username, user.password));
    },

    cleanErrors: () => {
      dispatch(hideErrors());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
