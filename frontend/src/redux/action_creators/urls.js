// URL BASE
let getUrl = window.location;
let baseUrl =
  getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split("/")[0];

// User

export let user_login = baseUrl + "api/auth/login/";
export let user_logout = baseUrl + "api/auth/logout/";
export let user_register = baseUrl + "api/auth/register/";

// Tasks
export let get_task = baseUrl + "api/task/";
export let create_task = baseUrl + "api/create-task/";
export let update_task = baseUrl + "api/update-task/";
export let delete_task = baseUrl + "api/delete-task/";

// Lists
export let get_lists = baseUrl + "api/lists";
export let get_list = baseUrl + "api/list/";
export let create_list = baseUrl + "api/create-list/";
export let update_list = baseUrl + "api/update-list/"; // add list id
export let delete_list = baseUrl + "api/delete-list/"; // add list id
