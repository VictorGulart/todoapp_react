import {
  // FETCH LISTS
  FETCH_LISTS_REQUEST,
  FETCH_LISTS_SUCCESS,
  FETCH_LISTS_FAILURE,

  // FETCH A LIST
  FETCH_LIST_REQUEST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,

  // CREATE
  CREATE_LIST_REQUEST,
  CREATE_LIST_SUCCESS,
  CREATE_LIST_FAILURE,
  // UPDATE
  UPDATE_LIST_REQUEST,
  UPDATE_LIST_SUCCESS,
  UPDATE_LIST_FAILURE,
  // DELETE
  DELETE_LIST_REQUEST,
  DELETE_LIST_SUCCESS,
  DELETE_LIST_FAILURE,
  // SELECTED LIST
  SELECT_LIST,
  SELETED_LIST_RESET,
  RESET_LIST_STORAGE,

  // TASKS OPERTATIONS
  // READ
  FETCH_TASK_REQUEST,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_FAILURE,
} from "../action_creators/action_types";

import {
  get_list,
  get_lists,
  create_list,
  update_list,
  delete_list,
  get_task,
} from "./urls";

const default_list = {
  title: "New List",
  roles: [],
};

import { setErrors } from "./errors_actions";

export const fetchCreateList = (token) => {
  return (dispatch) => {
    // for now it creates a default list
    dispatch(createListRequest());

    fetch(create_list, {
      method: "POST",
      headers: {
        Authorization: "token " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(default_list),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(createListSuccess(data.data.list));
        } else if (data.status === "fail") {
          console.log("Something was wrong if the request.");
          console.log(res.status);
          console.log(data.message);
          dispatch(createListFailure(data.message));
        } else if (data.status === "error") {
          console.log("Something worse happened.");
          dispatch(createListFailure());
          let errors = {
            system: [data.message],
            fields: data.data.errors,
          };
          dispatch(setErrors(errors));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const createListRequest = () => {
  return {
    type: CREATE_LIST_REQUEST,
  };
};

export const createListSuccess = (list) => {
  return {
    type: CREATE_LIST_SUCCESS,
    payload: list,
  };
};

export const createListFailure = (err) => {
  return {
    type: CREATE_LIST_FAILURE,
    payload: err,
  };
};

export const fetchLists = (token) => {
  return (dispatch) => {
    dispatch(fetchListsRequest()); // set loading

    fetch(get_lists, {
      method: "GET",
      headers: {
        Authorization: "token " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(fetchListsSuccess(data.data.lists));
        } else if (data.status === "fail") {
          console.log("Something was wrong if the request.");
          console.log(data.status);
          console.log(data.message);
        } else if (data.status === "error") {
          console.log("Something worse happened.");
          console.log(res.status);
          console.log(data.message);
          dispatch(fetchListsFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const fetchListsRequest = () => {
  return {
    type: FETCH_LISTS_REQUEST,
  };
};

export const fetchListsSuccess = (lists) => {
  return {
    type: FETCH_LISTS_SUCCESS,
    payload: lists,
  };
};

export const fetchListsFailure = (errMsg) => {
  return {
    type: FETCH_LISTS_FAILURE,
    payload: errMsg,
  };
};

export const fetchList = (token, list_id) => {
  return (dispatch) => {
    dispatch(fetchListRequest()); // record fetching request

    fetch(get_list + list_id + "/", {
      method: "GET",
      headers: {
        Authorization: "token " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(fetchListSucess(data.data.list));
        } else if (data.status === "fail") {
          console.log("Something was wrong if the request.");
          console.log(res.status);
          console.log(data.message);
        } else if (data.status === "error") {
          console.log("Something worse happened.");
          console.log(res.status);
          console.log(data.message);
          dispatch(fetchListFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const fetchListRequest = () => {
  return {
    type: FETCH_LIST_REQUEST,
  };
};

export const fetchListSucess = (list) => {
  return {
    type: FETCH_LIST_SUCCESS,
    payload: list,
  };
};

export const fetchListFailure = () => {
  return {
    type: FETCH_LIST_FAILURE,
  };
};

export const fetchUpdateList = (token, list) => {
  // automatically add the roles as empty,  for now
  list.roles = [];
  return (dispatch) => {
    dispatch(updateListRequest()); // set loading

    // console.log(update_list + list.id + "/");
    fetch(update_list + list.id + "/", {
      method: "PATCH",
      headers: {
        Authorization: "token " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(updateListSuccess(data.data.list));
        } else if (data.status === "fail") {
          console.log("Something was wrong if the request.");
          console.log(res.status);
          console.log(data.message);
        } else if (data.status === "error") {
          console.log("Something worse happened.");
          console.log(res.status);
          console.log(data.message);
          dispatch(updateListFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const updateListRequest = () => {
  return {
    type: UPDATE_LIST_REQUEST,
  };
};

export const updateListSuccess = (lists) => {
  return {
    type: UPDATE_LIST_SUCCESS,
    payload: lists,
  };
};

export const updateListFailure = (errMsg) => {
  return {
    type: UPDATE_LIST_FAILURE,
    payload: errMsg,
  };
};

export const fetchDeleteList = (token, list_id) => {
  // deletes a list

  return (dispatch) => {
    dispatch(deleteListRequest()); // record the request to delete

    // console.log(URL.delete_list + list_id + "/");
    fetch(delete_list + list_id + "/", {
      method: "DELETE",
      headers: {
        Authorization: "token " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(deleteListSuccess(list_id));
        } else if (data.status === "fail") {
          console.log("Something was wrong if the request.");
          console.log(res.status);
          console.log(data.message);
        } else if (data.status === "error") {
          console.log("Something worse happened.");
          console.log(res.status);
          console.log(data.message);
          dispatch(deleteListFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const deleteListRequest = () => {
  return {
    type: DELETE_LIST_REQUEST,
  };
};

export const deleteListSuccess = (list_id) => {
  return {
    type: DELETE_LIST_SUCCESS,
    payload: list_id,
  };
};

export const deleteListFailure = (errMsg) => {
  return {
    type: DELETE_LIST_FAILURE,
    payload: errMsg,
  };
};

export const selectList = (list_id) => {
  // Internal Redux List Selection
  // NO API calls
  return {
    type: SELECT_LIST,
    payload: list_id,
  };
};

// reset the storage on logout
export const resetListStorage = () => {
  return {
    type: RESET_LIST_STORAGE,
  };
};

export const fetchTask = (token, taskId) => {
  return (dispatch) => {
    dispatch(fetchTaskRequest());

    // GET FROM THE API
    fetch(get_task + taskId + "/", {
      method: "GET",
      headers: {
        Authorization: "token " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "sucess") {
          // dispatch sucess
          dispatch(fetchTaskSuccess(data.task));
        } else if (data.status === "fail") {
          // dispatch failure, but don't save anything to redux
          // this needs to be fixed
          console.log("Something was wrong if the request.");
          console.log(res.status);
          console.log(data.message);
          dispatch(fetchTaskFailure(data.message));
        } else if (data.status === "error") {
          // usually, server error, needs to be logged
          console.log("Something worse happened.");
          console.log(res.status);
          console.log(data.message);
          dispatch(fetchTaskFailure(data.message));
        }
      })
      .catch((err) => {
        // something else entirely happened
        console.log(err);
      });
  };
};

const fetchTaskRequest = () => {
  return {
    type: FETCH_TASK_REQUEST,
  };
};

const fetchTaskSuccess = (task) => {
  return {
    type: FETCH_TASK_SUCCESS,
    payload: task,
  };
};

const fetchTaskFailure = (errMsg) => {
  return {
    type: FETCH_TASK_FAILURE,
    payload: errMsg,
  };
};
