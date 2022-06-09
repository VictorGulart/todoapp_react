import {
  // TASKS
  // READ
  FETCH_TASK_REQUEST,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_FAILURE,

  // CREATE
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,

  // UPDATE
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,

  // DELETE
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE,
} from "../action_creators/action_types";

const initState = {
  task: {
    title: "",
    description: "",
    start_date: "",
    due_date: "",
    completed: "",
    sub_tasks: "",
    assignments: [],
  },
  loading: false,
  err: "",
};

export const tasksReducer = (state = initState, action) => {
  const { type } = action;

  switch (type) {
    case FETCH_TASK_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_TASK_SUCCESS: {
      return {
        loading: false,
        task: action.payload,
      };
    }
    case FETCH_TASK_FAILURE: {
      return {
        loading: false,
        err: action.payload,
      };
    }
  }
};
