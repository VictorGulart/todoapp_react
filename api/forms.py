from django import forms
from django.contrib.auth.forms import UserCreationForm, User
from django.contrib.auth.models import User
from django.forms import fields


class RegisterForm(UserCreationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={"class": "input", "placeholder": "Username"}))
    email = forms.CharField(
        widget=forms.EmailInput(attrs={"class": "input", "placeholder": "Email"}))
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "input", "placeholder": "******"}), label="Password")

    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "input", "placeholder": "******"}), label="Repeat Password")

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
