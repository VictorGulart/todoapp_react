import { connect } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";

const useFocus = () => {
  const htmlRef = useRef(null);
  const setFocus = () => {
    htmlRef.current && htmlRef.current.focus();
  };

  return [htmlRef, setFocus];
};

const SubTask = ({ subtask: origTask, delSubTask, removeTargetSubTask }) => {
  const [inputRef, setInputFocus] = useFocus();
  const [subtask, setSubtask] = useState(origTask);

  useEffect(() => {
    setInputFocus();
  }, []);

  return (
    <div
      id={subtask.id} //parent will keep the array index
      key={`subtask-${subtask.id}`}
      className="w-full flex items-center justify-center hover:bg-slate-100/[0.5] cursor-default rounded-md p-2"
    >
      <input
        type="text"
        className="w-full rounded-md bg-slate-100/[0] placeholder:text-slate-600 outline-none "
        ref={inputRef}
        onFocus={(e) => {
          e.target.parentNode.classList.add("bg-slate-100/[0.5]");
        }}
        onBlur={(e) => {
          if (e.target.value === "") {
            removeTargetSubTask();
          }
          e.target.parentNode.classList.remove("bg-slate-100/[0.5]");
        }}
        onChange={(e) => {
          setSubtask({
            ...subtask,
            title: e.target.value,
          });
        }}
        onKeyDown={(e) => {
          // ENTER pressing when subtask has focus
          if (!e.repeat && e.key === "Enter") {
            e.preventDefault();

            // Delete if not edited
            if (e.target.value === "") {
              removeTargetSubTask();
            }
          }
        }}
        value={subtask.title}
        placeholder="New Task"
      />

      <i
        className="justify-end fa-solid fa-x text-xs pt-1 cursor-pointer"
        onClick={(e) => {
          delSubTask(e.target.parentNode.id);
        }}
      ></i>
    </div>
  );
};

const SubTasks = ({ task, setTask }) => {
  let subtasks;
  let initTask = {
    id: null,
    title: "",
    assignments: [], // a list of user objects
  };

  const delSubTask = (delId) => {
    let newSubs = task.sub_tasks.filter((sub) => {
      return parseInt(sub.id) !== parseInt(delId);
    });

    newSubs = setTask({
      ...task,
      sub_tasks: newSubs,
    });
  };

  const remTargetSubTask = () => {
    // Remove a subtask
    let newSubs;
    newSubs = task.sub_tasks.slice(0, task.sub_tasks.length - 1);

    setTask({
      ...task,
      sub_tasks: newSubs,
    });
  };

  // CHANGE ON API CALL
  const addSubTask = () => {
    let subtask = initTask;
    if (task.sub_tasks.length > 0) {
      subtask.id = task.sub_tasks[task.sub_tasks.length - 1].id + 1;
    } else {
      subtask.id = 0; // get the current length
    }
    setTask({
      ...task,
      sub_tasks: [...task.sub_tasks, subtask],
    });
  };

  subtasks = task.sub_tasks.map((sub, idx) => {
    // give focus if it is the last one
    return (
      <SubTask
        key={`subtask-${sub.id}`}
        subtask={sub}
        delSubTask={delSubTask}
        removeTargetSubTask={remTargetSubTask}
      />
    );
  });

  return (
    <div className="w-full min-h-[3rem] flex flex-col items-center justify-center gap-y-1">
      {/* sub tasks will go where */}
      <div
        id={"sub-tasks"}
        className="w-full max-h-32 overflow-y-auto xs:max-h-64"
      >
        {subtasks}
      </div>
      <div
        className="flex items-center justify-center gap-x-2 cursor-default p-2 rounded-md hover:text-slate-800 hover:bg-slate-100/[0.5]"
        onClick={() => {
          addSubTask();
        }}
      >
        <i className="fa-solid fa-circle-plus"></i>
        <div className="">Add Subtask</div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SubTasks);
