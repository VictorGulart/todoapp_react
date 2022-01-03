import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  accountAccessGranted,
  accountAccessRemoved,
} from "../../redux/action_creators/user_actions";
import { useEffect } from "react";

function PrivateRoute({
  auth,
  onAccessGranted,
  onAccessRemoved,
  children,
  ...rest
}) {
  useEffect(() => {
    // Log that the current user has access the account
    if (auth) {
      onAccessGranted();
    } else {
      onAccessRemoved();
    }
  }, [auth]);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const mapStateToProps = (state) => {
  const { auth } = state.fetchReducer;
  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAccessGranted: () => {
      dispatch(accountAccessGranted());
    },
    onAccessRemoved: () => {
      dispatch(accountAccessRemoved());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
