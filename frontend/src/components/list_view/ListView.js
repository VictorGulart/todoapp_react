import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { TaskModal } from "../task_modal/TaskModal";

import {
  fetchLists,
  fetchUpdateList,
  selectList,
} from "../../redux/action_creators/lists_actions";
import {
  fetchCreateTask,
  fetchDeleteTask,
  fetchUpdateTask,
} from "../../redux/action_creators/task_actions";

function TaskView({ token, task, handleEdit, handleDelete, handleUpdate }) {
  // for now just keep this state, later I'm using Redux

  return (
    <div className="flex w-full justify-between rounded-2xl bg-emerald-300 p-3">
      <div className="xs:text-lg">{task.title}</div>
      <div className="flex items-center justify-center gap-x-2 xs:text-lg xs:gap-x-4">
        <div className="flex items-center justify-center">
          <input
            className="xs:w-[22px] xs:h-[22px]"
            type="checkbox"
            name=""
            id=""
            onClick={(e) => {
              handleUpdate(token, task);
            }}
          />
        </div>
        <div className="flex items-center justify-center">
          <i
            className="fa-solid fa-pen hover:text-slate-500"
            onClick={(e) => {
              handleEdit({ taskId: task.id, edit: true });
            }}
          ></i>
        </div>
        <div className="flex items-center justify-center">
          <i
            className="fa-solid fa-trash hover:text-slate-500"
            onClick={(e) => {
              // console.log("deleting ", task);
              handleDelete(token, task);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}

function ListView({
  token,
  lists,
  selectedList,
  selectAList,
  updateList,
  createTask,
  deleteTask,
  updateTask,
}) {
  const [listTitle, setListTitle] = useState("");
  const [editing, setEditing] = useState({ taskId: null, edit: false });
  const [list, setList] = useState({
    id: null,
    title: "",
    description: "",
    tasks: [],
    subtasks: [],
    start_date: "",
    end_date: "",
    complete: false,
  });

  useEffect(() => {
    // Just check if there is a selectedList
    // if not set a the first on the list
    if (!selectedList && lists && lists[0] !== undefined) {
      // There was no list selected, therefore selecting the first one
      setList(lists[0]);
      selectAList(lists[0]["id"]);
    } else if (selectedList && lists && lists[selectedList] !== undefined) {
      setList(lists[selectedList]);
    }
    // Otherwise default list is already set
  }, [lists]);

  useEffect(() => {
    // Change set the list to the new seleceted one
    if (lists && lists[selectedList] !== undefined) {
      setList(lists[selectedList]);
    }
  }, [selectedList]);

  useEffect(() => {
    setListTitle(list["title"]);
  }, [list]);

  let tasks = list.tasks.map((task, idx) => {
    return (
      <TaskView
        token={token}
        key={idx}
        task={task}
        handleEdit={setEditing}
        handleDelete={deleteTask}
        handleUpdate={updateTask}
      />
    );
  });

  return (
    <div
      className="w-full grow bg-blue-100 flex items-center justify-center"
      style={{ fontFamily: "Roboto" }}
    >
      <div className="w-full h-full xs:w-9/12 flex flex-col items-center justify-start p-3 ">
        <div className="w-full">
          {/* TITLE */}
          <input
            className="w-full py-3 text-emerald-600 text-3xl font-bold bg-transparent outline-none focus:outline-0"
            type="text"
            onChange={(e) => {
              // Set to the new value
              setListTitle(e.target.value);
            }}
            onKeyPress={(e) => {
              // If the key pressed is the Enter
              if (e.key === "Enter") {
                // Save the new list - API call
                let tempList = list;
                tempList["title"] = listTitle;
                updateList(token, tempList);
              }
            }}
            value={listTitle}
          />
        </div>
        <div className="flex flex-col gap-y-5 w-full p-2">{tasks}</div>
        <div className="absolute bottom-4 right-4 xs:hidden">
          <i
            className="text-4xl text-emerald-600 fa-solid fa-circle-plus"
            onClick={createTask}
          ></i>
        </div>
        <div className="hidden xs:block mt-4">
          <i
            className="text-4xl text-emerald-600 fa-solid fa-circle-plus hover:text-emerald-700"
            onClick={(e) => {
              createTask(token, list.id);
            }}
          ></i>
        </div>
      </div>
      {editing.edit ? (
        <TaskModal
          // task props is temporary
          // taskId will replace the task prop
          task={list.tasks.find((task) => {
            return task.id == editing.taskId;
          })}
          taskId={editing.taskId}
          handleTaskEdit={setEditing}
        />
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // Get the list
    // MAYBE: instead of passing all the lists,
    // only pass the selected one
    lists: state.listsReducer.lists,
    selectedList: state.listsReducer.selectedList,
    token: state.fetchReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLists: (token) => {
      dispatch(fetchLists(token));
    },
    updateList: (token, list) => {
      dispatch(fetchUpdateList(token, list));
    },
    createTask: (token, list_id) => {
      dispatch(fetchCreateTask(token, list_id));
    },

    deleteTask: (token, task) => {
      dispatch(fetchDeleteTask(token, task));
    },

    updateTask: (token, task) => {
      dispatch(fetchUpdateTask(token, task));
    },
    selectAList: (list_id) => {
      dispatch(selectList(list_id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
