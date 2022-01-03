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
} from "./action_types";

const URLS = {
  create_task: "api/create-task/",
  update_task: "api/update-task/",
  delete_task: "api/delete-task/",
};

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
    fetch(URLS.create_task, {
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

    fetch(URLS.update_task + `${task.id}/`, {
      method: "POST",
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
    fetch(URLS.delete_task + `${task.id}/`, {
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
