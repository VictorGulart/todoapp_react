import { connect } from "react-redux";
import Navigation from "../navigation/Navigation";
import ListView from "../list_view/ListView";
import TaskModal from "../task_modal/TaskModal";
import { Redirect } from "react-router-dom";
import { useEffect } from "react";
import {
  fetchLists,
  resetListStorage,
} from "../../redux/action_creators/lists_actions";

const Home = ({ auth, token, getLists, resetLists }) => {
  useEffect(() => {
    // When the user logs out it cleans the storage
    return () => {
      resetLists();
    };
  }, []);

  useEffect(() => {
    // get the lists when the user is authenticated
    if (auth) {
      getLists(token);
    }
  });
  return auth ? (
    <div className="flex flex-col grow h-full">
      <Navigation />
      <ListView />
    </div>
  ) : (
    <Redirect to="/login" />
  );
};

const mapStateToProps = (state) => ({
  user: state.fetchReducer.user,
  auth: state.fetchReducer.auth,
  token: state.fetchReducer.token,
});

const mapDispatchToProps = (dispatch) => {
  return {
    resetLists: () => {
      dispatch(resetListStorage());
    },
    getLists: (token) => {
      dispatch(fetchLists(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
