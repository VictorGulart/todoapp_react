import { connect } from "react-redux";
import { useState, useEffect, useRef, createContext } from "react";
// import { ModalContext } from "./modalContext";
import SubTasks from "./SubTasks";

// get task from redux or API
// update task thourgh redux (it will update the api too)

const ModalContext = createContext();

function TaskModal({ task: origTask, handleTaskEdit }) {
  const closeModal = (e) => {
    // Hide the modal
    handleTaskEdit({ edit: false, taskId: null });
  };

  let assignments;

  let initTask = {
    title: "",
    description: "",
    start_date: "",
    due_date: "",
    completed: "",
    sub_tasks: "",
    assignments: [],
  };

  let initUser = {
    id: "2",
    name: "Doe",
    email: "doe@gmail.com",
    username: "TheDoe",
  };

  const [task, setTask] = useState(origTask || initTask);

  // Internal State
  const taskRef = useRef(null);
  const [assignInput, setAssignInput] = useState({ hidden: true, value: "" });

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  useEffect(() => {
    // Adjunsting the height of the textarea for the description
    let text = document.querySelector("#subtask-note");
    if (text.value == "") {
      text.setAttribute("style", "height:" + 50 + "px;");
    } else {
      text.setAttribute("style", "height:" + text.scrollHeight + "px;");
    }

    // Disabling the Enter keydown default functionality
    const enterDisable = (e) => {
      if (e.key === "Enter" && document.querySelector()) {
        e.preventDefault();
        return false;
      }
    };

    return () => {
      document.removeEventListener("keydown", enterDisable);
    };
  }, []);

  useEffect(() => {
    // Giving the assing input area focus
    if (assignInput.hidden === false) {
      document.querySelector("#assign-input").firstChild.focus();
    }
  }, [assignInput.hidden]);

  const setDueDate = () => {
    setTask({
      ...task,
      due_date: `${new Date().getFullYear()}-${
        new Date().getMonth() <= 9
          ? "0" + new Date().getMonth()
          : new Date().getMonth()
      }-${
        new Date().getDate() <= 9
          ? "0" + new Date().getDate()
          : new Date().getDate()
      }`,
    });
  };

  const setStartDate = () => {
    setTask({
      ...task,
      start_date: `${new Date().getFullYear()}-${
        new Date().getMonth() <= 9
          ? "0" + new Date().getMonth()
          : new Date().getMonth()
      }-${
        new Date().getDate() <= 9
          ? "0" + new Date().getDate()
          : new Date().getDate()
      }`,
    });
  };

  // Assignment Input
  const showAssignInput = () => {
    let input = document.querySelector("#assign-input");
    input.classList.remove("hidden");
    setAssignInput({
      ...assignInput,
      hidden: false,
    });
  };

  const hideAssignInput = () => {
    let input = document.querySelector("#assign-input");
    input.classList.add("hidden");
    setAssignInput({
      hidden: true,
      value: "",
    });
  };

  // change ON API CALL
  const addAssignment = (e) => {
    if (!e.repeat && e.key === "Enter") {
      e.preventDefault();
      if (e.target.value === "") {
        // empty input
        hideAssignInput();
      } else {
        // create assignment
        let assigned_to = task.assignments;
        assigned_to.push(initUser);
        setTask({
          ...task,
          assignments: assigned_to,
        });
        hideAssignInput();
      }
    }
  };

  // implement
  const delAssignment = (e) => {
    let assigned_to = task.assignments;
    assigned_to.splice(e.target.parentNode.id, 1);

    setTask({
      ...task,
      assignments: assigned_to,
    });
  };

  // implement
  const saveTask = (e) => {
    e.preventDefault();
    console.log("saving task");
    console.log(task);
  };

  // assignments array
  assignments = task.assignments.map((assignment, idx) => {
    return (
      <div
        id={idx}
        key={`assign-${idx}`}
        className="text-slate-600 p-2 flex items-center justify-center gap-x-2 bg-slate-100/[.3] rounded-md"
      >
        <span className="text-center">{assignment}</span>
        <i
          className="justify-end cursor-pointer fa-solid fa-x text-xs pt-1"
          onClick={delAssignment}
        ></i>
      </div>
    );
  });

  return (
    <div
      ref={taskRef}
      id="task-modal"
      className="absolute inset-0 bg-green-300 xs:flex items-center justify-center"
    >
      <form
        onSubmit={saveTask}
        className="w-full h-full p-3 flex flex-col items-center justify-content gap-y-2 overflow-y-auto xs:w-9/12"
      >
        <div className="w-full flex p-2 items-center justify-end">
          <span className="flex items-center justify-center">
            <i
              className="text-slate-600 fa-solid fa-x cursor-pointer"
              onClick={closeModal}
            ></i>
          </span>
        </div>

        {/* title */}
        <div className="w-full">
          <input
            className="w-full text-xl bg-slate-100/[0] p-2 rounded-md placeholder:text-slate-600 outline-none focus:bg-slate-100/[.40]"
            type="text"
            value={task.title}
            placeholder="Title"
            onChange={(e) => {
              setTask({
                ...task,
                title: e.target.value,
              });
            }}
          />
        </div>

        {/* sub tasks */}
        <ModalContext.Provider value={{ task, setTask }}>
          <SubTasks />
        </ModalContext.Provider>

        {/* begin and due date */}
        <div className="w-full flex items-center justify-between">
          <div className="">
            {task.start_date ? (
              <div className="flex gap-x-1 items-center justify-center">
                <label>Start</label>
                <input
                  className="text-center bg-slate-100/[.5] rounded-md hover:bg-slate-100/[1] p-1"
                  type="date"
                  name="start_date"
                  value={task.start_date}
                  onChange={(e) => {
                    setTask({
                      ...task,
                      start_date: e.target.value,
                    });
                  }}
                />
              </div>
            ) : (
              <span
                className="cursor-default hover:bg-slate-100/[0.5] rounded-md p-2"
                onClick={setStartDate}
              >
                Set Start Date
              </span>
            )}
          </div>
          <div className="">
            {task.due_date ? (
              <div className="flex gap-x-1 items-center justify-center">
                <label>Due </label>
                <input
                  className="text-center bg-slate-100/[.5] rounded-md hover:bg-slate-100/[1] p-1"
                  type="date"
                  name="due_date"
                  value={task.due_date}
                  onChange={(e) => {
                    setTask({
                      ...task,
                      due_date: e.target.value,
                    });
                  }}
                />
              </div>
            ) : (
              <span
                className="cursor-default hover:bg-slate-100/[0.5] rounded-md p-2"
                onClick={setDueDate}
              >
                Set Due Date
              </span>
            )}
          </div>
        </div>

        {/* notes */}
        <div className="w-full">
          <textarea
            className="w-full h-14 max-h-[270px] bg-slate-100/[0] rounded-md p-2 outline-none focus:bg-slate-100/[.4]"
            placeholder="Add Notes"
            name="description"
            id="subtask-note"
            onInput={handleInput}
          ></textarea>
        </div>

        {/* assigning */}
        <div className="w-full flex items-center justify-start gap-x-2 flex-wrap ">
          <div className="flex gap-x-1">{assignments}</div>
          <div onKeyDown={addAssignment} className="hidden " id="assign-input">
            <input
              type="text"
              className="p-2 outline-none bg-transparent max-w-[100px] border-[1px] border-slate-600 focus:border-slate-600/[.7] rounded-md"
              onChange={(e) => {
                setAssignInput({
                  ...assignInput,
                  value: e.target.value,
                });
              }}
            />
          </div>
          <div
            className="flex gap-x-2 items-center justify-center p-2 rounded-md cursor-default hover:bg-slate-100/[.5] hover:text-slate-700"
            onClick={showAssignInput}
          >
            <i className="fa-solid fa-user-plus"></i>
            <span className="">Assign to</span>
          </div>
        </div>

        {/* save button */}
        <div className="w-full flex justify-end px-3">
          <button
            className="px-2 py-1 rounded-md bg-slate-600 text-white hover:bg-slate-800"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = (state, parentProps) => {
  return {
    list: state.listsReducer.lists[state.listsReducer.selectedList],
    task: state.listsReducer.lists[state.listsReducer.selectedList].tasks.find(
      (task) => {
        return task.id === parentProps.taskId;
      }
    ),
  };
};

const mapDispatchToProps = () => {
  return {};
};

const ConnectedTaskModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskModal);

export { ConnectedTaskModal as TaskModal, ModalContext };
