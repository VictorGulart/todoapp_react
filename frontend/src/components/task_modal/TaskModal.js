import { connect } from "react-redux";
import { useState, useEffect, useRef } from "react";

// function TaskModal({ taskId, fetchTaskId, handleTaskEdit }) {
function TaskModal({ task: origTask, taskId, handleTaskEdit }) {
  // NOTES FOR THIS COMPONENT
  // Task Modal will fetch the task, with the ID it receives from ListView
  // need to include a fetch dispatch to get the friends to assign to

  // TEMPORARY
  // Receiving a task detail from listview - after will be an API call

  const closeModal = (e) => {
    // Check if the task changes were saved
    console.log("check if changes were saved!!");
    // Hide the modal
    handleTaskEdit({ edit: false, taskId: null });
  };

  let subTasks, assignments;
  let initTask = {
    title: "",
    notes: "",
    completed: false,
    start_date: null,
    due_date: null,
    assigned_to: [], // a list of user objects
    subtasks: [],
  };
  let initUser = {
    id: "2",
    name: "Doe",
    email: "doe@gmail.com",
    username: "TheDoe",
  };

  // Redux State (should be deleted)
  const [task, setTask] = useState(origTask || initTask);
  const [saved, setSaved] = useState(true); // store task saved state
  // Internal State
  const taskRef = useRef(null);
  const [assignInput, setAssignInput] = useState({ hidden: true, value: "" });
  const [subTaskFocus, setSubTaskFocus] = useState(false);

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  useEffect(() => {
    let text = document.querySelector("#subtask-note");
    if (text.value == "") {
      text.setAttribute("style", "height:" + 50 + "px;");
    } else {
      text.setAttribute("style", "height:" + text.scrollHeight + "px;");
    }

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
    if (assignInput.hidden === false) {
      document.querySelector("#assign-input").firstChild.focus();
    }
  }, [assignInput.hidden]);

  useEffect(() => {
    if (subTaskFocus === true) {
      document.querySelector("#sub-tasks").lastChild.firstChild.focus();
    } else if (subTaskFocus === false) {
      document.querySelector("#sub-tasks").lastChild.firstChild.blur();
    }
  }, [subTaskFocus]);

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

  // CHANGE ON API CALL
  const addSubTask = () => {
    setTask({
      ...task,
      subtasks: [
        ...task.subtasks,
        {
          id:
            task.subtasks.length !== 0
              ? task.subtasks[task.subtasks.length - 1].id + 1
              : 0,
          title: "",
        },
      ],
    });
    setSubTaskFocus(true);
  };

  const delSubTask = (e) => {
    let newSubs = task.subtasks;
    newSubs.splice(e.target.parentNode.id, 1);
    setTask({
      ...task,
      subtasks: newSubs,
    });
  };

  const removeTargetSubTask = (target) => {
    let newSubs = task.subtasks.filter((subtask) => {
      return subtask.id != target.id;
    });

    setTask({
      ...task,
      subtasks: newSubs,
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
        let assigned_to = task.assigned_to;
        assigned_to.push(initUser);
        setTask({
          ...task,
          assigned_to: assigned_to,
        });
        hideAssignInput();
      }
    }
  };

  // implement
  const delAssignment = (e) => {
    let assigned_to = task.assigned_to;
    assigned_to.splice(e.target.parentNode.id, 1);

    setTask({
      ...task,
      assigned_to: assigned_to,
    });
  };

  // implement
  const saveTask = (e) => {
    e.preventDefault();
    console.log("saving task");
  };

  // subtasks array
  subTasks = task.subtasks.map((subtask, idx) => {
    return (
      <div
        id={idx} //parent will keep the array index
        key={`subtask-${idx}`}
        className="w-full flex items-center justify-center hover:bg-slate-100/[0.5] cursor-default rounded-md p-2"
      >
        <input
          id={subtask.id}
          type="text"
          className="w-full rounded-md bg-slate-100/[0] placeholder:text-slate-600 outline-none "
          onFocus={(e) => {
            e.target.parentNode.classList.add("bg-slate-100/[0.5]");
          }}
          onBlur={(e) => {
            e.target.parentNode.classList.remove("bg-slate-100/[0.5]");
            setSubTaskFocus(false);
          }}
          onChange={(e) => {
            let newSubs = task.subtasks;
            newSubs[e.target.parentNode.id].title = e.target.value;
            setTask({
              ...task,
              subtasks: newSubs,
            });
          }}
          onKeyDown={(e) => {
            // ENTER pressing when subtask has focus
            if (!e.repeat && e.key === "Enter") {
              e.preventDefault();

              // Delete if not edited
              if (e.target.value === "") {
                removeTargetSubTask(e.target);
              } else {
                // Add a new subtask (like a continous system)
                setSubTaskFocus(false);
              }
            }
          }}
          value={subtask.title}
          placeholder="New Task"
        />

        <i
          className="justify-end fa-solid fa-x text-xs pt-1 cursor-pointer"
          onClick={delSubTask}
        ></i>
      </div>
    );
  });

  // assignments array
  assignments = task.assigned_to.map((assignment, idx) => {
    return (
      <div
        id={idx}
        key={`assign-${idx}`}
        className="text-slate-600 p-2 flex items-center justify-center gap-x-2 bg-slate-100/[.3] rounded-md"
      >
        <span className="text-center">{assignment.name}</span>
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
        <div className="w-full min-h-[3rem] flex flex-col items-center justify-center gap-y-1">
          {/* sub tasks will go where */}
          <div
            id={"sub-tasks"}
            className="w-full max-h-32 overflow-y-auto xs:max-h-64"
          >
            {subTasks}
          </div>
          <div
            className="flex items-center justify-center gap-x-2 cursor-default p-2 rounded-md hover:text-slate-800 hover:bg-slate-100/[0.5]"
            onClick={addSubTask}
          >
            <i className="fa-solid fa-circle-plus"></i>
            <div className="">Add Subtask</div>
          </div>
        </div>
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
            name=""
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskModal);
