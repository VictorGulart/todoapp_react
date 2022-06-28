import { connect } from "react-redux";
import { useState, useEffect, useRef, createContext } from "react";
import SubTasks from "./SubTasks";
import { fetchUpdateTask } from "../../redux/action_creators/task_actions";
import { useContext } from "react";

const ModalContext = createContext();

const ConfirmPopUp = ({ message }) => {
  const { saveTask, toSave, setToSave } = useContext(ModalContext);

  // Pop Up Modal
  // returns true or false to the function handler

  const accept = (e) => {
    console.log("Saving the changes");
    saveTask(e);
    setToSave({
      save: false,
      popUpVisible: false,
      closeModal: true,
    });
  };

  const reject = () => {
    console.log("Discarding the changes");
    setToSave({
      save: false,
      popUpVisible: false,
      closeModal: true,
    });
  };

  return (
    <div
      className={
        "bg-slate-600/[.6] absolute inset-0 flex items-center justify-center" +
        (toSave.popUpVisible ? "" : " hidden")
      }
    >
      <div className="bg-white w-60 h-40 flex items-center justify-center rounded-md flex-col gap-y-2 relative">
        {/* X btn to close */}
        <i
          className="fa-solid fa-x self-end hover:pointer absolute top-4 right-4"
          onClick={() => {
            // Should not change anything on the state yet
            // Just hide the pop up
            setToSave({
              ...toSave,
              popUpVisible: false,
            });
          }}
        ></i>
        {/* Message */}
        <span className="text-lg text-center">{message}</span>
        {/* Buttons */}
        <div className="flex gap-x-1.5">
          <button
            className="px-2 py-1 rounded-md bg-slate-600 text-white hover:bg-slate-800"
            onClick={(e) => {
              accept(e);
            }}
          >
            Ok
          </button>
          <button
            className="px-2 py-1 rounded-md bg-slate-600 text-white hover:bg-slate-800"
            onClick={() => {
              // Should not change anything on the state yet
              // Just hide the pop up
              setToSave({
                ...toSave,
                popUpVisible: false,
              });
            }}
          >
            Cancel
          </button>
          <button
            className="px-2 py-1 rounded-md bg-slate-600 text-white hover:bg-slate-800"
            onClick={reject}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

function TaskModal({ token, task: origTask, handleTaskEdit, updateTask }) {
  let assignments;

  let initTask = {
    title: "",
    description: "",
    start_date: "",
    end_date: "",
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

  // Internal State
  const [task, setTask] = useState(origTask || initTask); // The copy of the original task imported as internal state
  const taskRef = useRef(null);

  // To confirm changes
  const [toSave, setToSave] = useState({
    save: false,
    popUpVisible: false,
    closeModal: false,
  });
  // To check wether there were changes on the task or not
  const [assignInput, setAssignInput] = useState({ hidden: true, value: "" });

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";

    // update the text area
    setTask({
      ...task,
      description: e.target.value,
    });
    if (!toSave.save) {
      setToSave({
        ...toSave,
        save: true,
      });
    }
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

  useEffect(() => {
    if (toSave.closeModal === true && toSave.save === false) {
      // Just close the modal
      handleTaskEdit({ edit: false, taskId: null });
    } else if (toSave.closeModal === true && toSave.save === true) {
      // Show the popup
      setToSave({
        ...toSave,
        popUpVisible: true,
        closeModal: false,
      });
    }
  }, [toSave.closeModal]);

  const fromJsonDate = (jsonDate) => {
    // Receives a string date in JSON format
    // Returns a javascript date object
    let date = new Date(jsonDate);
    let year = date.getFullYear();
    let month =
      date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    let day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    let final = `${year}-${month}-${day}`;

    return final;
  };

  const toJsonDate = (dateString) => {
    let date = new Date(dateString);
    return date.toJSON();
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

  const delAssignment = (e) => {
    let assigned_to = task.assignments;
    assigned_to.splice(e.target.parentNode.id, 1);

    setTask({
      ...task,
      assignments: assigned_to,
    });
  };

  // API call to save task on DB and Redux
  const saveTask = (e) => {
    e.preventDefault();
    updateTask(token, task);
    setToSave({
      save: false,
      popUpVisible: false,
      closeModal: true,
    });
  };

  // assignments array
  assignments = task.assignments.map((assignment, idx) => {
    return (
      <div
        id={idx}
        key={`assign-${idx}`}
        className="text-slate-600 p-2 flex items-center justify-center gap-x-2 bg-slate-100/[.3] rounded-md"
      >
        <span className="text-center">{assignment.email}</span>
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
              onClick={() => {
                setToSave({
                  ...toSave,
                  closeModal: true,
                });
              }}
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
              if (!toSave.save) {
                setToSave({
                  ...toSave,
                  save: true,
                });
              }
            }}
          />
        </div>

        {/* sub tasks */}
        <ModalContext.Provider value={{ task, setTask, toSave, setToSave }}>
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
                  value={fromJsonDate(task.start_date)}
                  onChange={(e) => {
                    setTask({
                      ...task,
                      start_date: toJsonDate(e.target.value),
                    });
                    if (!toSave.save) {
                      setToSave({
                        ...toSave,
                        save: true,
                      });
                    }
                  }}
                />
              </div>
            ) : (
              <span
                onClick={() => {
                  console.log("Setting the Start Date");
                  let date = new Date();
                  setTask({
                    ...task,
                    start_date: date.toJSON(),
                  });
                }}
                className="cursor-default hover:bg-slate-100/[0.5] rounded-md p-2"
              >
                Set Start Date
              </span>
            )}
          </div>
          <div className="">
            {task.end_date ? (
              <div className="flex gap-x-1 items-center justify-center">
                <label>Due </label>
                <input
                  className="text-center bg-slate-100/[.5] rounded-md hover:bg-slate-100/[1] p-1"
                  type="date"
                  name="end_date"
                  value={fromJsonDate(task.end_date)}
                  onChange={(e) => {
                    setTask({
                      ...task,
                      end_date: toJsonDate(e.target.value),
                    });
                    if (!toSave.save) {
                      setToSave({
                        ...toSave,
                        save: true,
                      });
                    }
                  }}
                />
              </div>
            ) : (
              <span
                onClick={() => {
                  let date = new Date();

                  setTask({
                    ...task,
                    end_date: date.toJSON(),
                  });
                }}
                className="cursor-default hover:bg-slate-100/[0.5] rounded-md p-2"
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
            value={task.description}
          ></textarea>
        </div>

        {/* assigning */}
        {/* <div className="w-full flex items-center justify-start gap-x-2 flex-wrap ">
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
        </div> */}

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

      <ModalContext.Provider
        value={{
          saveTask,
          toSave,
          setToSave,
        }}
      >
        <ConfirmPopUp message={"Save the changes?"} />
      </ModalContext.Provider>
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
    token: state.fetchReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTask: (token, task) => {
      dispatch(fetchUpdateTask(token, task));
    },
  };
};

const ConnectedTaskModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskModal);

export { ConnectedTaskModal as TaskModal, ModalContext };
