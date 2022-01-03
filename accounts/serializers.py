from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")

# Register Serializer
class RegisterSerializer( serializers.ModelSerializer ):
    email = serializers.EmailField( validators=[ UniqueValidator( queryset=User.objects.all() ) ] )
    class Meta:
        model = User
        fields = ("id", "username", "email", "password")
        extra_kwargs = {"password":{'write_only': True}}

    def create( self, validated_data ):
        ''' Creates user with with hashed password '''
        user = User.objects.create_user( **validated_data )
        return user 


# Login Serializer
class LoginSerializer( serializers.Serializer ):
    username = serializers.CharField()
    password = serializers.CharField()
    
    
    def validate( self, data ):
        user =  authenticate( **data )

        if user and user.is_active:
            return user

        raise serializers.ValidationError("Incorrect Credentials")











