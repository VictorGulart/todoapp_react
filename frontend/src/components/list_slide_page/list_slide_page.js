import React from "react";
import { connect } from "react-redux";
import { useParams, Redirect } from "react-router";
import { Link } from "react-router-dom";
import {
  fetchList,
  fetchUpdateList,
  fetchDeleteList,
} from "../../redux/action_creators/lists_actions";
import { fetchCreateTask } from "../../redux/action_creators/task_actions";
import { useState, useEffect } from "react";

const ListSlidePage = ({
  token,
  lists,
  fetchList,
  updateList,
  deleteList,
  createTask,
}) => {
  /* 
        This will be a page that will slide from the right
        to the main page so that the user can edit the list

        ??
            Maybe I'll need to add to the list serializer an 
            user_role attribute so that the UI can check if the user
            can edit or not.
            And the backend will use this 
        ??

        Here the user should be able to:

        OWNER AND EDITOR
        edit a list -> 
            title, description, 
            add/delete task (edit only the title for now, later assign)
            complete
            end_date
        
        it can view ->
            the users that have access to it
            the current tasks
        
        
        WORKER AND VIEWER
        it can only view -> 
            title, description, complete, start_date, end_date

        it can view ->
            the current tasks assigned to him
        
    */
  let { list_id } = useParams();

  let initList = lists.find((list) => {
    return list.id == list_id;
  });

  // If lists does not exits then redirect
  if (initList === undefined) {
    return <Redirect to="/" />;
  }

  const createTasksTags = (tasks) => {
    // Create the HTML tags from the objects
    return tasks.map((task, idx) => {
      return (
        <div className="" id={idx} key={idx}>
          <Link
            to={{
              pathname: `/task/${task.id}`,
              state: { from_list: task.from_list },
            }}
          >
            {task.title}
          </Link>
        </div>
      );
    });
  };

  const [list, setList] = useState(initList);
  const [tasks, setTasks] = useState(createTasksTags(initList.tasks));

  useEffect(() => {
    setList(
      lists.find((list) => {
        return list.id === parseInt(list_id);
      })
    );
  }, [lists]);

  useEffect(() => {
    // update tasks
    if (list.tasks !== undefined) {
      setTasks(createTasksTags(list.tasks));
    }
  }, [list.tasks]);

  // This link is o synchronize the db and redux
  const syncList = (e) => {
    // Refresh the list on redux
    e.preventDefault();
    fetchList(token, list_id);
  };

  const delList = (e) => {
    // Deletes the list
    e.preventDefault();
    deleteList(token, list_id);
  };

  const saveList = (e) => {
    // Saves the list
    e.preventDefault();

    // Format date into an acceptable format -> JSON
    list.end_date = new Date(list.end_date).toJSON();
    updateList(token, list);
  };

  const onClickCreateTask = (e) => {
    // Creates a new Task
    e.preventDefault();
    createTask(token, list_id);
  };

  const formatDate = (date) => {
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

  return (
    <div className="container">
      <form onSubmit={saveList} method="post">
        <fieldset className="container" style={{ paddingTop: "2rem" }}>
          <div className="input-group rel">
            <input
              type="text"
              id="title"
              placeholder=" "
              value={list.title}
              required
              onChange={(e) => {
                setList({
                  ...list,
                  title: e.target.value,
                });
              }}
            />
            <label htmlFor="title" className="input-label--anim">
              Title
            </label>
          </div>
          <label
            className="input-group"
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              id="complete"
              value="complete"
              onChange={(e) => {
                setList({
                  ...list,
                  complete: !list.complete,
                });
              }}
              checked={list.complete}
            />
            Complete
          </label>
          <div className="input-group rel">
            <textarea
              name=""
              id="description"
              cols="30"
              rows="6"
              value={list.description}
              placeholder=" "
              onChange={(e) => {
                setList({
                  ...list,
                  description: e.target.value,
                });
              }}
            ></textarea>
            <label htmlFor="description" className="textarea-label--anim">
              Description
            </label>
          </div>
          <div className="input-group f-row">
            <label htmlFor="start_date">Started on: </label>
            <span>{new Date(list.start_date).toLocaleDateString()}</span>
          </div>
          <div className="input-group f-row">
            <label htmlFor="end_date">Finished on: </label>
            <input
              type="date"
              id="end_date"
              value={formatDate(list.end_date)}
              onChange={(e) => {
                setList({
                  ...list,
                  end_date: e.target.value,
                });
              }}
            ></input>
          </div>
          <div className="input-group">
            <div className="input-group f-row">
              <button className="btn-custom " onClick={onClickCreateTask}>
                New Task <i className="fas fa-plus-circle"></i>
              </button>
            </div>
            <div className="input-group">
              <ul>{tasks}</ul>
            </div>
          </div>

          <div
            className="input-group f-row"
            style={{ justifyContent: "flex-end" }}
          >
            <button className="btn-custom" onClick={syncList}>
              <i className="fas fa-sync"></i>
            </button>
            <button className="btn-custom" onClick={delList}>
              <i className="fas fa-trash"></i>
            </button>
            <button className="btn-custom" type="submit">
              Save
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  let { token } = state.fetchReducer;
  let { lists } = state.listsReducer;
  return {
    token,
    lists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchList: (token, list_id) => {
      dispatch(fetchList(token, list_id));
    },
    updateList: (token, list) => {
      dispatch(fetchUpdateList(token, list));
    },
    deleteList: (token, list_id) => {
      dispatch(fetchDeleteList(token, list_id));
    },
    createTask: (token, list_id) => {
      dispatch(fetchCreateTask(token, list_id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListSlidePage);
