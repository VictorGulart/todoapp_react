import "./lists_display.css";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  fetchLists,
  fetchUpdateList,
  fetchCreateList,
  fetchDeleteList,
} from "../../redux/action_creators/lists_actions";
import List from "../list_for_display/list";

const ListsDisplay = ({
  auth,
  token,
  lists,
  onLoadingFetchLists,
  createList,
}) => {
  useEffect(() => {
    if (auth) {
      onLoadingFetchLists(token);
    }
  }, []);

  return (
    <div className="lists-display">
      <div className="list-display__inner">
        {lists != 0 ? (
          lists.map((list, idx) => {
            // changed the key to list.id instead of idx
            return <List key={list.id} content={{ list }} />;
          })
        ) : (
          <div>Nothing to show</div>
        )}
      </div>
      <div
        className="list-display__add"
        onClick={() => {
          createList(token);
        }}
      >
        <i className="fas fa-plus-circle"></i>
      </div>
    </div>
  );
};

// this state passed is the entire application state
// so this function will receive this state and
// pass to the component only the attributes from the state
// that it needs access to.
const mapStateToProps = (state) => {
  const { lists } = state.listsReducer;
  const { token, auth } = state.fetchReducer;
  return {
    lists,
    token,
    auth,
  };
};

// dispatch is a function that allows our components
// to trigger actions that the redux store will respond to
// need to import the action creators for this
const mapDispatchToProps = (dispatch) => {
  return {
    onLoadingFetchLists: (token) => {
      dispatch(fetchLists(token));
    },
    createList: (token) => {
      dispatch(fetchCreateList(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListsDisplay);
