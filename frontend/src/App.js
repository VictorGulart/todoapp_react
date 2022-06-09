import "./styles/App.css";

// REDUX IMPORT
import { configureStore } from "./redux/store";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// REACT IMPORTS
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// APP AUTH
import LoginPage from "./components/auth/login/LoginPage";
import RegisterPage from "./components/auth/register/RegisterPage";
import Home from "./components/home/Home";
import Navigation from "./components/navigation/Navigation";
import { TaskModal } from "./components/task_modal/TaskModal";

function App() {
  return (
    <div className="flex w-full min-h-screen">
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/register" component={RegisterPage}></Route>

          {/* route to test components */}
          <Route path="/nav" component={Navigation}></Route>
          <Route path="/tmodal" component={TaskModal}></Route>
          {/* END */}
          <Route>
            {/* Make 404 page */}
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
