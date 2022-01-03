// import "./task_slide_page.css";
import { useHistory, useLocation, useParams, Redirect } from "react-router";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  fetchUpdateTask,
  fetchDeleteTask,
} from "../../redux/action_creators/task_actions";

const TaskSlidePage = ({ token, lists, updateTask, deleteTask }) => {
  /**
   * Do a bubble search on the lists
   * or just fecth the task and check if the list is
   * on the users lists
   */

  let { task_id } = useParams();

  const history = useHistory();
  const location = useLocation();

  // check for direct URL access
  // ?? or get from API
  if (location.state === undefined) {
    return <Redirect to="/" />;
  }

  const { from_list } = location.state;

  let initList = lists.find((list) => {
    return list.id === from_list;
  });

  let initTask = initList.tasks.find((task) => {
    return task.id === parseInt(task_id);
  });

  // Avoid problem of task being empty
  if (initList === undefined || initTask === undefined) {
    return <Redirect to="/" />;
  }

  const [task, setTask] = useState(initTask);
  const formatDate = (date) => {
    // format date from json for input tag
    let newDate = new Date(date);
    const [year, month, day] = [
      newDate.getFullYear(),
      newDate.getMonth() + 1,
      newDate.getDate(),
    ];

    return date
      ? `${year}-${month.toString().length == 1 ? "0" + month : month}-${
          day.toString().length == 1 ? "0" + day : day
        }`
      : "";
  };

  const saveTask = (e) => {
    e.preventDefault();
    updateTask(token, task);
  };

  const delTask = (e) => {
    e.preventDefault();
    deleteTask(token, task);
  };

  return (
    <div className="container">
      <form onSubmit={saveTask}>
        <fieldset className="container" style={{ paddingTop: "2rem" }}>
          <div className="input-group rel">
            <input
              type="text"
              name="title"
              placeholder=" "
              value={task.title}
              onChange={(e) => {
                e.preventDefault();
                setTask({
                  ...task,
                  title: e.target.value,
                });
              }}
            />
            <label htmlFor="title" className="input-label--anim">
              Title
            </label>
          </div>
          <div className="input-group rel">
            <textarea
              type="text"
              id="description"
              placeholder=" "
              name="description"
              value={task.description}
              onChange={(e) => {
                e.preventDefault();
                setTask({
                  ...task,
                  description: e.target.value,
                });
              }}
            ></textarea>
            <label htmlFor="description" className="textarea-label--anim">
              Description
            </label>
          </div>
          <label
            htmlFor="complete"
            className="input-group f-row"
            style={{ alignItems: "center" }}
          >
            <input
              type="checkbox"
              id="complete"
              name="commplete"
              value="complete"
              onChange={(e) => {
                setTask({
                  ...task,
                  complete: !task.complete,
                });
              }}
              checked={task.complete}
            />
            Complete
          </label>
          <div className="input-group f-row">
            <label htmlFor="start_date">Started on: </label>
            <span>{new Date(task.start_date).toLocaleDateString()}</span>
          </div>
          <div className="input-group f-row">
            <label htmlFor="end_date">Finished on: </label>
            <input
              type="date"
              id="end_date"
              value={formatDate(task.end_date)}
              onChange={(e) => {
                setTask({
                  ...task,
                  end_date: e.target.value,
                });
              }}
            ></input>
          </div>
          <div
            className="input-group f-row"
            style={{ justifyContent: "flex-end" }}
          >
            <button className="btn-custom" onClick={delTask}>
              <i className="fas fa-trash"></i>
            </button>
            <button type="submit" className="btn-custom">
              Save
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

const mapStateToProps = (state, otherProps) => {
  let { token } = state.fetchReducer;
  let { lists } = state.listsReducer;

  return {
    token,
    lists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTask: (token, task) => {
      dispatch(fetchUpdateTask(token, task));
    },
    deleteTask: (token, task) => {
      dispatch(fetchDeleteTask(token, task));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskSlidePage);
