from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import logout
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer

# Get User API
@api_view( ['GET'] )
@permission_classes([ IsAuthenticated, ])
def GetUserAPI( request ):
    return Response(
                    {
                        'status': 'success',
                        'data':{ 
                            "user": UserSerializer( instance=request.user ).data,
                        },
                        'message': f'The username is {request.user.username}.'
                    }
        )

# Register API
@api_view( ['POST'] )
@permission_classes([ AllowAny, ])
def RegisterAPI( request ):
    if request.method == 'POST':
        print(request.data)
        serializer = RegisterSerializer( data=request.data )

        if not serializer.is_valid():
            return Response(
                    {
                        'status': 'fail',
                        'data':{ 
                            "errors": serializer.errors,
                        },
                        'message': f'There\'s something wrong with registration.'
                    },
                    status = status.HTTP_400_BAD_REQUEST
            ) 
        
        user = serializer.save() # RegisterSerializer returns an user object
        token = Token.objects.create(user=user)

        return Response(
                    {
                        'status': 'success',
                        'data':{ 
                            "user": UserSerializer( instance=user ).data,
                            "token": token.key
                        },
                        'message': f'Welcome {user.username}.'
                    },
                    status = status.HTTP_201_CREATED
        )


# Login API
@api_view(['POST'])
@permission_classes([ AllowAny, ])
def LoginAPI( request ):
    if request.method == 'POST':
        serializer = LoginSerializer( data=request.data )

        if not serializer.is_valid():
            return Response(
                        {
                            'status': 'fail',
                            'message': f'Something is wrong with the username or password',
                            'data': {
                                'errors': serializer.errors
                            } 
                        },
                        status = status.HTTP_400_BAD_REQUEST
                    )

        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)

        return Response(
                    {
                        'status': 'success',
                        'data':{ 
                            "user": UserSerializer( instance=user ).data,
                            "token": token.key
                        },
                        'message': f'Welcome {user.username}.'
                    }
                )


@api_view(["POST"])
@permission_classes([ IsAuthenticated, ])
def LogoutAPI( request ):
    if request.method == "POST":
        user = User.objects.get( id=request.user.id )
        Token.objects.get( user=user ).delete()  # deletes the token
        logout( request )

        return Response(
            {
                'status':'success',
                'message': 'User logged out successfully'
            } 
        )


