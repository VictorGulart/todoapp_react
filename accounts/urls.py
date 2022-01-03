from django.urls import path, include
from .api import RegisterAPI, LoginAPI, GetUserAPI, LogoutAPI


urlpatterns = [
        path( "api/auth/login/", LoginAPI, name="login" ),
        path( "api/auth/register/", RegisterAPI, name="register" ),
        path( "api/auth/user/", GetUserAPI, name="user" ),
        path( "api/auth/logout/", LogoutAPI, name="logout" )
        ]
