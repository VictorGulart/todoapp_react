from django.urls import path
from . import views

urlpatterns = [
        path("", views.index, name="index"),
        path("login/", views.login, name="login"),
        path("register/", views.register, name="register"),
        path("list/<int:pk>", views.listView, name="get-list"),
        path("task/<int:task_pk>", views.taskView, name="get-list"),




        # temporary for component creation
        path("nav/", views.test, name="nav-test"),
        path("tmodal/", views.test, name="tmodal-test")
]
