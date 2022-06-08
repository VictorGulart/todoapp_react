import { connect } from "react-redux";
import { useRef } from "react";
import SideLink from "./side_links/SideLink";
import LinksContainer from "./side_links/LinksContainer";

// ROUTER
import { Redirect } from "react-router-dom";

// REDUX
import { userLogOut } from "../../redux/action_creators/user_actions";
import {
  fetchCreateList,
  selectList,
} from "../../redux/action_creators/lists_actions";

function Navigation({ lists, token, logoutUser, createList }) {
  const sideMenu = useRef();

  // EDIT LATER -> SIDE MENU
  const systemLists = [
    // This need to be implemented on the backend
    { id: "0", title: "Day" },
    { id: "1", title: "Reminders" },
    { id: "2", title: "Notes" },
    { id: "3", title: "Tasks" },
  ];

  let defaultLists = systemLists.map((list, idx) => {
    return (
      <SideLink key={`dflist-${idx}`} listId={list.id} text={list.title} />
    );
  });

  const myLists = lists.map((list, idx) => {
    return (
      <SideLink key={`mylist-${idx}`} listId={list.id} text={list.title} />
    );
  });

  const closeMenu = () => {
    // Closes the side menu
    sideMenu.current.classList.remove("left-0");
    sideMenu.current.classList.add("left-[-100%]");
  };

  const openMenu = () => {
    // Opens the side menu
    sideMenu.current.classList.remove("left-[-100%]");
    sideMenu.current.classList.add("left-0");
  };

  const addList = () => {
    // Redux & API call to create a new list
    // At the moment the list created is by default
    console.log("New List being created.");
    createList(token);
  };

  return (
    <div className="block w-full h-12">
      {/* Top Bar Menu */}
      <nav className="w-screen h-12 bg-emerald-600 fixed">
        <div className="flex h-full w-full items-center justify-center px-4">
          <div className="">
            <i
              className="text-slate-100 fa-solid fa-bars cursor-pointer"
              onClick={openMenu}
            ></i>
          </div>
          <div className="grow flex items-center justify-center">
            <span
              className="text-white text-2xl"
              style={{ fontFamily: "Indie Flower" }}
            >
              To Do App
            </span>
          </div>
          <div className="flex gap-x-3 items-center justify-center">
            <div className="authBtns">
              {token !== undefined ? (
                <a
                  className="cursor-pointer rounded-md p-[5px] text-slate-100 hover:text-slate-900 hover:bg-slate-100"
                  onClick={() => {
                    logoutUser(token);
                    <Redirect to="/login" />;
                  }}
                >
                  Log Out
                </a>
              ) : (
                <div className="flex gap-x-3 items-center justify-center">
                  <span
                    className="cursor-pointer rounded-md p-[5px] text-slate-100 hover:text-slate-900 hover:bg-slate-100"
                    onClick={() => {
                      <Redirect to="/login" />;
                    }}
                  >
                    Login
                  </span>
                  <span
                    className="cursor-pointer rounded-md p-[5px] text-slate-100 hover:text-slate-900 hover:bg-slate-100"
                    onClick={() => {
                      <Redirect to="/register" />;
                    }}
                  >
                    Register
                  </span>
                </div>
              )}
            </div>
            <i className="fa-solid fa-user text-white cursor-pointer"></i>
            <i className="fa-solid fa-gear text-white cursor-pointer"></i>
          </div>
        </div>
      </nav>

      {/* Side Menu */}
      <div
        ref={sideMenu}
        className="z-50 transition-left duration-300 absolute top-0 left-[-100%] bg-green-300 flex-col flex w-full xs:w-96 fixed h-screen overflow-x-hidden overflow-y-auto"
      >
        <div className="flex items-end justify-end p-4">
          <i
            className="fa-solid fa-x text-slate-600 cursor-pointer"
            onClick={closeMenu}
          ></i>
        </div>
        <div className="grow flex items-start justify-center">
          <div className="w-11/12 h-5/6 flex flex-col items-center justify-start">
            {/* APP NAME */}
            <div className="w-full h-12 flex items-center justify-center">
              <span
                className="text-slate-600 text-2xl underline decoration-white underline-offset-4"
                style={{ fontFamily: "Indie Flower" }}
              >
                To Do App
              </span>
            </div>

            {/* USER NAME & PROFILE LINK */}
            <div className="w-full flex gap-x-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex border-2 border-slate-400 hover:border-slate-600">
                {/* photo profile */}
                <a
                  href="#"
                  className="w-full h-full flex items-center justify-center"
                >
                  <i className="fa-solid fa-user text-green-300 text-2xl cursor-pointer"></i>
                </a>
              </div>
              <div className="flex items-center justify-center">
                <a
                  href="#"
                  className="text-slate-600 hover:underline hover:decoration-slate-600 hover:text-current hover:underline-offset-2"
                >
                  Victor Gulart
                </a>
              </div>
            </div>

            {/* LINE DIVIDER */}
            <div className="w-2/6 h-px border border-white bg-slate-100 mt-6 mb-2"></div>

            {/* Unassigned TASKS, REMINDERS, NOTES */}
            <LinksContainer containerId="defLists">
              {defaultLists}
            </LinksContainer>

            {/* LINE DIVIDER */}
            <div className="w-2/6 h-px border border-white bg-slate-100 mt-6 mb-2"></div>

            {/* LISTS */}

            <LinksContainer containerId={"myLists"}>{myLists}</LinksContainer>

            <div className="w-full flex gap-x-2 p-3 items-center justify-center">
              <div
                className="flex gap-x-2 items-center justify-center text-slate-800 hover:text-slate-500 cursor-pointer"
                onClick={addList}
              >
                <i className="transition duration-200  text-2xl fa-solid fa-circle-plus "></i>
                <span className="">Add List</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.fetchReducer.token,
    systemLists: state.listsReducer.systemLists,
    lists: state.listsReducer.lists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: (token) => {
      dispatch(userLogOut(token));
    },
    createList: (token) => {
      dispatch(fetchCreateList(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
