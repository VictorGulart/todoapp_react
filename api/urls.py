from django.urls import path
from . import api
from .api import TaskLists, TaskListView, TaskView, RolesView, SubTaskView


urlpatterns = [
    # API OVERVIEW
    path("api/", api.APIOverview, name="api-overview"),

    # CLASS BASED VIEWS
    path("api/lists/", TaskLists.as_view(), name="lists"),
    path("api/list/<str:pk>/", TaskListView.as_view(), name="list"),
    path("api/create-list/", TaskListView.as_view(), name="create-list"),
    path("api/update-list/<str:pk>/", TaskListView.as_view(), name="update-list"),
    path("api/delete-list/<str:pk>/", TaskListView.as_view(), name="delete-list"),

    path("api/task/<str:pk>/", TaskView.as_view(), name="task"),
    path("api/create-task/", TaskView.as_view(), name="create-task"),
    path("api/update-task/<str:pk>/", TaskView.as_view(), name="update-task"),
    path("api/delete-task/<str:pk>/", TaskView.as_view(), name="delete-task"),

    path("api/subtask/<str:pk>/", SubTaskView.as_view(), name="subtask"),
    path("api/create-subtask/", SubTaskView.as_view(), name="create-subtask"),
    path("api/update-subtask/<str:pk>/", SubTaskView.as_view(), name="update-subtask"),
    path("api/delete-subtask/<str:pk>/", SubTaskView.as_view(), name="delete-subtask"),

    path("api/create-role/<str:lst>/<str:user>/",
         RolesView.as_view(), name="create-role"),
    path("api/update-role/<str:lst>/<str:user>/",
         RolesView.as_view(), name="update-role"),
    path("api/delete-role/<str:lst>/<str:user>/",
         RolesView.as_view(), name="delete-role"),


    # Assignments
    path("api/create-assignment/<str:task>/<str:user>/",
         api.createAssignment, name="create-assignment"),
    path("api/delete-assignment/<str:task>/<str:user>/",
         api.deleteAssignment, name="delete-assignment"),

#   Testing classes with different methods
#     path("api/role/<str:lst>/<str:user>/",
#          RolesView.as_view(), name="create-role"),
#     path("api/role/<str:lst>/<str:user>/",
#          RolesView.as_view(), name="update-role"),
#     path("api/role/<str:lst>/<str:user>/",
#          RolesView.as_view(), name="delete-role"),

###############
## OLD LINKS ##
###############

    # Lists
#     path("api/lists/", api.userTaskLists, name="lists"),
#     path("api/list/<str:pk>/", api.userTaskList, name="list"),
#     path("api/create-list/", api.createTaskList, name="create-list"),
#     path("api/update-list/<str:pk>/", api.updateTaskList, name="update-list"),
#     path("api/delete-list/<str:pk>/", api.deleteTaskList, name="delete-list"),

    # Tasks
#     path("api/task/<str:pk>/", api.userTask, name="task"),
#     path("api/create-task/", api.createTask, name="create-task"),
#     path("api/update-task/<str:pk>/", api.updateTask, name="update-task"),
#     path("api/delete-task/<str:pk>/", api.deleteTask, name="delete-task"),

#     # Roles
#     path("api/create-role/<str:lst>/<str:user>/",
#          api.createRole, name="create-role"),
#     path("api/update-role/<str:lst>/<str:user>/",
#          api.updateRole, name="update-role"),
#     path("api/delete-role/<strst>/<str:user>/",
#          api.deleteRole, name="delete-role"),


]
