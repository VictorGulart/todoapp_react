from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

# Register Serializer
class RegisterSerializer( serializers.ModelSerializer ):
    email = serializers.EmailField( validators=[ UniqueValidator( queryset=User.objects.all() ) ] )
    confirm_password = serializers.CharField()
    class Meta:
        model = User
        fields = ("id", "username", "email", "password",  "confirm_password")
        extra_kwargs = {"password":{'write_only': True}, }

    def create( self, validated_data ):
        ''' Creates user with with hashed password '''
        user = User.objects.create_user( **validated_data )
        return user 
    
    def validate(self, attrs):
        confirm_password = attrs.pop("confirm_password")
        if confirm_password != attrs['password']:
            raise serializers.ValidationError("Passwords should match.")

        data = super().validate(attrs)
        return data
        



# Login Serializer
class LoginSerializer( serializers.Serializer ):
    username = serializers.CharField()
    password = serializers.CharField()
    
    
    def validate( self, data ):
        user =  authenticate( **data )

        if user and user.is_active:
            return user

        raise serializers.ValidationError("Incorrect Credentials")











