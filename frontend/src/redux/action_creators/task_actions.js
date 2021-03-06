import {
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE,
  UPDATE_LIST_FAILURE,
  CREATE_SUBTASK_REQUEST,
  CREATE_SUBTASK_SUCCESS,
  CREATE_SUBTASK_FAILURE,
} from "./action_types";

import { create_task, update_task, delete_task, create_subtask } from "./urls";

/**
 * TASKS
 */

const default_task = {
  title: "New Task",
  from_list: 0,
  assignments: [],
};

// CREATE TASK

export const fetchCreateTask = (token, list_id) => {
  const task = default_task;
  task.from_list = list_id;

  return (dispatch) => {
    // record the task creation request
    dispatch(createTaskRequest());

    // create a fetch call
    fetch(create_task, {
      method: "POST",
      headers: {
        Authorization: "token " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(createTaskSuccess(data.data.task));
        } else if (data.status === "fail") {
          console.log("Something was wrong if the request.");
          console.log(res.status);
          console.log(data.message);
          dispatch(createTaskFailure(data.message));
        } else if (data.status === "error") {
          console.log("Something worse happened.");
          console.log(res.status);
          console.log(data.message);
          dispatch(createTaskFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const createTaskRequest = () => {
  return {
    type: CREATE_TASK_REQUEST,
  };
};

const createTaskSuccess = (task) => {
  return {
    type: CREATE_TASK_SUCCESS,
    payload: task,
  };
};

const createTaskFailure = (err) => {
  return {
    type: CREATE_TASK_FAILURE,
    payload: err,
  };
};

// UPDATE TASK

export const fetchUpdateTask = (token, task) => {
  // Fetch the API
  return (dispatch) => {
    // dispatch request
    dispatch(updateTaskRequest());

    fetch(update_task + `${task.id}/`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // on success update the store
          dispatch(updateTaskSuccess(data.data.task));
        } else if (data.status === "failure" || data.status === "error") {
          /**
           * on failure or error just add error message to the store
           * and console the error message
           */

          dispatch(updateTaskFailure(data.message));
          console.log("Something wrong happened.");
          console.log(data.status);
          console.log(data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const updateTaskRequest = () => {
  return {
    type: UPDATE_TASK_REQUEST,
  };
};

const updateTaskSuccess = (task) => {
  return {
    type: UPDATE_TASK_SUCCESS,
    payload: task,
  };
};

const updateTaskFailure = (err) => {
  return {
    type: UPDATE_LIST_FAILURE,
    payload: err,
  };
};

// DELETE TASK

export const fetchDeleteTask = (token, task) => {
  // api fetch
  return (dispatch) => {
    // save request
    dispatch(deleteTaskRequest());

    // create a fetch call
    fetch(delete_task + `${task.id}/`, {
      method: "DELETE",
      headers: {
        Authorization: "token " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          dispatch(deleteTaskSuccess(task));
        } else if (data.status === "fail") {
          console.log("Something was wrong if the request.");
          console.log(res.status);
          console.log(data.message);
          dispatch(deleteTaskFailure(data.message));
        } else if (data.status === "error") {
          console.log("Something worse happened.");
          console.log(res.status);
          console.log(data.message);
          dispatch(deleteTaskFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const deleteTaskRequest = () => {
  return {
    type: DELETE_TASK_REQUEST,
  };
};

const deleteTaskSuccess = (task) => {
  return {
    type: DELETE_TASK_SUCCESS,
    payload: task,
  };
};

const deleteTaskFailure = (err) => {
  return {
    type: DELETE_TASK_SUCCESS,
    payload: err,
  };
};

// FETCH CREATE SUBTASK
export const fetchCreateSubTask = (token, subtask) => {
  // The subtask must contain the 'from_task' attribute
  // Title can be empty

  return (dispatch) => {
    // record the request
    dispatch(fetchCreateSubTaskRequest());

    // API CALL
    fetch(create_subtask, {
      method: "POST",
      headers: {
        Authorization: "token " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subtask),
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          dispatch(fetchCreateSubTaskSuccess(data.data.subtask));
        } else if (data.status === "fail") {
          console.log("Something is wrong with the request");
          console.log(res.status);
          console.log(data.message);
          dispatch(fetchCreateSubTaskFailure(data.message));
        } else if (data.status === "error") {
          console.log("Something worse happened.");
          console.log(res.status);
          console.log(data.message);
          dispatch(fetchCreateSubTaskFailure(data.message));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const fetchCreateSubTaskRequest = () => {
  return {
    type: CREATE_SUBTASK_REQUEST,
  };
};

const fetchCreateSubTaskSuccess = (subtask) => {
  return {
    type: CREATE_SUBTASK_SUCCESS,
    payload: subtask,
  };
};

const fetchCreateSubTaskFailure = (err) => {
  return {
    type: CREATE_SUBTASK_FAILURE,
    payload: err,
  };
};
