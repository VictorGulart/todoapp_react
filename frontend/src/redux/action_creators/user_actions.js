import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  ACCOUNT_ACCEESS_GRANTED,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAILURE,
  ACCOUNT_ACCEESS_REMOVED,
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAILURE,
} from "./action_types";

const urls = {
  fetchUser: "http://127.0.0.1:8000/api/auth/login/",
  logUserOut: "http://127.0.0.1:8000/api/auth/logout/",
  createUser: "http://127.0.0.1:8000/api/auth/register/",
};

export const fetchUser = (username, password) => {
  return (dispatch) => {
    // dispatch a user request ==> loading = true
    dispatch(fetchUserRequest());

    // post username & password to the server
    // promise dispatches a fetchUserSuccess if the status is 'success'
    // otherwise it dispatches a fetchUserFailure
    fetch(urls.fetchUser, {
      method: "POST",
      headers: {
        "Content-type": "Application/json;charset=utf-8",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(fetchUserSuccess(data));
        } else if (data.status === "fail") {
          dispatch(fetchUserFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const fetchUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST,
  };
};

export const fetchUserSuccess = (data) => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: data,
  };
};

export const fetchUserFailure = (error) => {
  return {
    type: FETCH_USER_FAILURE,
    payload: error,
  };
};

export const accountAccessGranted = () => {
  return {
    type: ACCOUNT_ACCEESS_GRANTED,
  };
};

export const userLogOut = (token) => {
  // logs the user out of the application

  return (dispatch) => {
    dispatch(userLogOutRequest());

    fetch(urls.logUserOut, {
      method: "POST",
      headers: {
        Authorization: "token " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(userLogOutSuccess());
        } else if (data.status === "fail" || data.status === "error") {
          dispatch(userLogOutFailure());
        }
      });
  };
};

export const userLogOutRequest = () => {
  return {
    type: USER_LOGOUT_REQUEST,
  };
};

export const userLogOutSuccess = () => {
  return {
    type: USER_LOGOUT_SUCCESS,
  };
};

export const userLogOutFailure = () => {
  return {
    type: USER_LOGOUT_FAILURE,
  };
};

export const accountAccessRemoved = () => {
  return {
    type: ACCOUNT_ACCEESS_REMOVED,
  };
};

export const userRedirected = () => {
  // sent the user to login page
  return {
    type: USER_REDIRECTED,
  };
};

export const fetchCreateUser = (username, password, password2) => {
  // API call for creating an user
  return (dispatch) => {
    // dispatch a user request ==> loading = true
    dispatch(userCreateRequest());

    // post username & password to the server
    // promise dispatches a fetchUserSuccess if the status is 'success'
    // otherwise it dispatches a fetchUserFailure
    fetch(urls.createUser, {
      method: "POST",
      headers: {
        "Content-type": "Application/json;charset=utf-8",
      },
      body: JSON.stringify({ username, password, password2 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(userCreateSuccess(data));
        } else if (data.status === "fail") {
          dispatch(userCreateFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const userCreateRequest = () => {
  return {
    type: USER_CREATE_REQUEST,
  };
};

export const userCreateSuccess = (user) => {
  return {
    type: USER_CREATE_SUCCESS,
    payload: user,
  };
};

export const userCreateFailure = (err) => {
  return {
    type: USER_CREATE_FAILURE,
    payload: err,
  };
};
