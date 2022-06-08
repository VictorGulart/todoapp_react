/*
  Tasks will be handle here because they don't need to be updated separately
*/

import {
  // FETCH
  FETCH_LISTS_REQUEST,
  FETCH_LISTS_SUCCESS,
  FETCH_LISTS_FAILURE,
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

  // TASKS
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

  // SELECT LIST
  SELECT_LIST,
  RESET_LIST_STORAGE,
} from "../action_creators/action_types";

const initState = {
  loading: false,
  selectedList: undefined, // keep track of which one the user is seeing
  systemLists: [],
  lists: [],
  err: "",
};

export const listsReducer = (state = initState, action) => {
  const { type } = action;

  switch (type) {
    case CREATE_LIST_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case CREATE_LIST_SUCCESS: {
      const newList = [...state.lists, action.payload];
      return {
        ...state,
        loading: false,
        lists: newList,
      };
    }
    case CREATE_LIST_FAILURE: {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    }
    case FETCH_LISTS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_LISTS_SUCCESS: {
      return {
        ...state,
        loading: false,
        lists: action.payload,
      };
    }
    case FETCH_LISTS_FAILURE:
      return {
        ...state,
        loading: false,
        err: action.payload,
      };

    case FETCH_LIST_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case FETCH_LIST_SUCCESS: {
      return {
        ...state,
        loading: false,
        lists: state.lists.map((list) => {
          let newList = action.payload;
          if (list.id === newList.id) {
            return newList;
          } else {
            return list;
          }
        }),
      };
    }
    case FETCH_LIST_FAILURE: {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    }
    case UPDATE_LIST_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case UPDATE_LIST_SUCCESS: {
      return {
        ...state,
        loading: false,
        lists: state.lists.map((list) => {
          if (list.id === action.payload.id) {
            return action.payload;
          } else return list;
        }),
      };
    }
    case UPDATE_LIST_FAILURE: {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    }
    case DELETE_LIST_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case DELETE_LIST_SUCCESS: {
      return {
        ...state,
        loading: false,
        lists: state.lists.filter((list) => {
          if (list.id != action.payload) {
            return list;
          }
        }),
      };
    }
    case DELETE_LIST_FAILURE: {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    }

    /**
     * TASKS CRUD OPERATIONS
     */
    case CREATE_TASK_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case CREATE_TASK_SUCCESS: {
      const task = action.payload;

      return {
        ...state,
        loading: false,
        lists: state.lists.map((list) => {
          if (list.id === task.from_list) {
            let newList = list;
            newList.tasks = [...newList.tasks, task];
            return newList;
          } else return list;
        }),
      };
    }
    case CREATE_TASK_FAILURE: {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    }
    case UPDATE_TASK_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case UPDATE_TASK_SUCCESS: {
      const updatedTask = action.payload;

      return {
        ...state,
        loading: false,
        lists: state.lists.map((list) => {
          if (list.id != updatedTask.from_list) {
            return list;
          }
          list.tasks = list.tasks.map((task) => {
            if (task.id !== updatedTask.id) {
              return task;
            }
            return updatedTask;
          });
          return list;
        }),
      };
    }
    case UPDATE_TASK_FAILURE: {
      return {
        ...state,
        loading: false,
        err: action.payload,
      };
    }
    case DELETE_TASK_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case DELETE_TASK_SUCCESS: {
      const oldTask = action.payload;
      return {
        ...state,
        loading: false,
        lists: state.lists.map((list) => {
          if (list.id != oldTask.from_list) {
            // if the task is not  from the list then
            // do not search the list
            return list;
          }
          let newTasks = list.tasks.filter((task) => {
            return task.id !== parseInt(oldTask.id);
          });
          list.tasks = newTasks;
          return list;
        }),
      };
    }
    case DELETE_TASK_FAILURE: {
      return {
        ...state,
        loading: false,
      };
    }
    case SELECT_LIST: {
      let idx = state.lists.findIndex((list) => {
        return list["id"] == action.payload;
      });

      return {
        ...state,
        selectedList: idx,
      };
    }

    // RESET LIST STORAGE
    case RESET_LIST_STORAGE: {
      return initState;
    }

    default:
      return state;
  }
};
