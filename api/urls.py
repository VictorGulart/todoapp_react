from django.urls import path
from . import api


urlpatterns = [
    # API OVERVIEW
    path("api/", api.APIOverview, name="api-overview"),

    # Lists
    path("api/lists/", api.userTaskLists, name="lists"),
    path("api/list/<str:pk>/", api.userTaskList, name="list"),
    path("api/create-list/", api.createTaskList, name="create-list"),
    path("api/update-list/<str:pk>/", api.updateTaskList, name="update-list"),
    path("api/delete-list/<str:pk>/", api.deleteTaskList, name="delete-list"),


    # Tasks
    path("api/task/<str:pk>/", api.userTask, name="task"),
    path("api/create-task/", api.createTask, name="create-task"),
    path("api/update-task/<str:pk>/", api.updateTask, name="update-task"),
    path("api/delete-task/<str:pk>/", api.deleteTask, name="delete-task"),

    # Roles
    path("api/create-role/<str:lst>/<str:user>/",
         api.createRole, name="create-role"),
    path("api/update-role/<str:lst>/<str:user>/",
         api.updateRole, name="update-role"),
    path("api/delete-role/<str:lst>/<str:user>/",
         api.deleteRole, name="delete-role"),

    # Assignments
    path("api/create-assignment/<str:task>/<str:user>/",
         api.createAssignment, name="create-assignment"),
    path("api/delete-assignment/<str:task>/<str:user>/",
         api.deleteAssignment, name="delete-assignment"),
]
