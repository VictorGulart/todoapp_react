// REDUX IMPORT
import { configureStore } from "./redux/store";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// REACT IMPORTS
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// APP imports
import "./styles/App.css";
import NavBar from "./components/nav_bar/nav_bar.js";
import ListsDisplay from "./components/lists_display/lists_display.js";
import ListSlidePage from "./components/list_slide_page/list_slide_page";
import TaskSlidePage from "./components/task_slide_page/task_slide_page";

// APP AUTH imports
import PrivateRoute from "./components/auth/privateRoute";
import LoginPage from "./components/auth/login";
import RegisterPage from "./components/auth/register";

function Messages() {
  const messages = [];

  return (
    <div className="message">
      <span></span>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Messages />
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <NavBar />
            <ListsDisplay />
          </PrivateRoute>
          <Route path="/list/:list_id">
            {/* Special List component, for individual lists */}
            <NavBar />
            <ListSlidePage />
          </Route>
          <Route path="/task/:task_id">
            <NavBar />
            <TaskSlidePage />
          </Route>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/register" component={RegisterPage}></Route>
          <Route>
            <div>Opps... Page not Found!</div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

// Separate const for store, now using redux-persist
const store = configureStore();

const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
