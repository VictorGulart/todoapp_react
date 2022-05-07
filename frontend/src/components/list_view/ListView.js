import { connect } from "react-redux";
import { useState, useEffect } from "react";
import TaskModal from "../task_modal/TaskModal";
import { fetchLists } from "../../redux/action_creators/lists_actions";

function TaskView({ task, handleEdit, handleDelete, handleComplete }) {
  // for now just keep this state, later I'm using Redux

  const completeTask = () => {
    // dispatch
    console.log("task completed");
  };

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
            onClick={completeTask}
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
              console.log("deleting ", task);
              handleDelete(task);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}

function ListView({ lists, selectedList }) {
  const [editing, setEditing] = useState({ taskId: null, edit: false });
  const [list, setList] = useState({
    title: "",
    description: "",
    tasks: [],
    subtasks: [],
    start_date: "",
    end_date: "",
    complete: false,
  });

  useEffect(() => {
    if (lists && lists[selectedList] !== undefined) {
      setList(lists[selectedList]);
    }
  }, [lists]);

  const createTask = () => {
    setList({
      ...list,
      tasks: [
        ...list.tasks,
        { ...tempTask, id: Math.round(Math.random() * 1000), title: "Onions" },
      ],
    });
  };

  const deleteTask = (oldTask) => {
    let newTasks = list.tasks.filter((task) => {
      if (task.id != oldTask.id) {
        return true;
      } else {
        return false;
      }
    });

    setList({
      ...list,
      tasks: newTasks,
    });
  };

  let tasks = list.tasks.map((task, idx) => {
    return (
      <TaskView
        key={idx}
        task={task}
        handleEdit={setEditing}
        handleDelete={deleteTask}
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
              setList({ ...list, title: e.target.value });
            }}
            value={list.title}
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
            onClick={createTask}
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
          handleTaskEdit={setEditing}
        />
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // Get the list
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListView);
