import React from "react";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { fetchDeleteList } from "../../redux/action_creators/lists_actions";
import { fetchDeleteTask } from "../../redux/action_creators/task_actions";

function Task({ content }) {
  let { token, task, deleteTask } = content;
  const history = useHistory();

  const onClickDeleteTask = (e) => {
    e.preventDefault();
    deleteTask(token, task);
  };

  return (
    <div
      className="task"
      onDoubleClick={() => {
        history.push({
          pathname: "/task/" + task.id,
          state: { from_list: task.from_list },
        });
      }}
    >
      <div className="task__inner">
        <div className="content"> {task.title} </div>
        <div className="actions">
          <div className="edit_task">
            {/* <Redirect component={} */}
            <Link
              to={{
                pathname: "/task/" + task.id,
                state: { from_list: task.from_list },
              }}
            >
              <i className="fas fa-pencil-alt"></i>
            </Link>
          </div>
          <div className="delete_task" onClick={onClickDeleteTask}>
            <i className="fas fa-trash"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

const List = ({ content, token, deleteList, deleteTask }) => {
  const arrow = useRef(null);
  const tasks_container = useRef(null);
  const { list } = content;

  useEffect(() => {
    // Only set in the first render, so that it does not affect
    // other functionlities that cause a re-render
    var height = tasks_container.current.scrollHeight;
    tasks_container.current.style.maxHeight = "0px";
    tasks_container.current.style.padding = "0px";
  }, []);

  const handleArrowClick = (e) => {
    arrow.current.classList.toggle("open");
    var height = tasks_container.current.scrollHeight;

    if (tasks_container.current.classList.contains("hidden")) {
      tasks_container.current.style.maxHeight = `calc(${height + "px"} + 3rem)`;
      tasks_container.current.style.padding = "";
      tasks_container.current.classList.remove("hidden");
    } else {
      tasks_container.current.classList.add("hidden");
      tasks_container.current.style.maxHeight = "0px";
      tasks_container.current.style.padding = "0px";
    }
  };

  const onClickDeleteList = (e) => {
    e.preventDefault();
    deleteList(token, list.id);
  };

  return (
    <div className="list__container">
      <div className="list" onClick={handleArrowClick}>
        <div className="arrow" ref={arrow}>
          <i className="fas fa-chevron-right"></i>
        </div>
        <div className="list__title">{list.title}</div>
        <div className="actions">
          <div className="edit">
            <Link to={"/list/" + list.id}>
              <i className="fas fa-pencil-alt"></i>
            </Link>
          </div>
          <div className="delete" onClick={onClickDeleteList}>
            <i className="fas fa-trash"></i>
          </div>
        </div>
      </div>
      <div className="tasks__container hidden" ref={tasks_container}>
        <div className="tasks__container__inner">
          {list.tasks.map((task, idx) => {
            // changed the key to task.id instead of idx
            return <Task key={task.id} content={{ token, task, deleteTask }} />;
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { token } = state.fetchReducer;
  return {
    token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteList: (token, list_id) => {
      dispatch(fetchDeleteList(token, list_id));
    },
    deleteTask: (token, task) => {
      dispatch(fetchDeleteTask(token, task));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
