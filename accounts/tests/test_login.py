# DJANGO
from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse

# DJANGO REST FRAMEWORK
from rest_framework.test import APIRequestFactory, APITestCase
from rest_framework.authtoken.models import Token

# TODO APP
from accounts.api import RegisterAPI, LoginAPI, GetUserAPI

# Settings
from accounts.tests.settings import url_register, url_login, url_logout, user_data, set_up_credentials, tear_down_credentials


class UserLoginTest( APITestCase ):
    def setUp( self ):
        res = self.client.post( url_register, user_data, format="json")
        self.user = res.data['data']['user']
        self.user_token = res.data['data']['token']
        
        super().setUp()
    
    def tearDown( self ):
        super().tearDown()

    def test_user_login( self ):
        ''' 
            Test user login.
            Test that response has user and token.
            Test that password is not on user dictionary.
        ''' 

        user = {
            'username': user_data['username'],
            'password': '12345',
        }

        res = self.client.post( url_login, user, format="json" )

        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone(res.data['data']['user'])
        self.assertIsNotNone(res.data['data']['token'])
        self.assertNotIn( 'password', res.data['data']['user'])
    
    def test_user_login_wrong_pass( self ):
        ''' 
            Test fail login with HTTP_400_BAD_REQUEST.
            Wrong password but just a message is return, 
            not specifying what is wrong.
        ''' 

        user = {
            'username': user_data['username'],
            'password': '123',
        }
        res = self.client.post( url_login, user, format="json" )

        self.assertEqual( res.data['status'], 'fail' )
        self.assertEqual( res.status_code, 400 )
        self.assertIsNotNone(res.data['message'])
        self.assertIsNone( res.data['data']['errors'].get( 'password', None))
 
    def test_user_login_wrong_username( self ):
        ''' 
            Test fail login with HTTP_400_BAD_REQUEST.
            Wrong username but just a message is return, 
            not specifying what is wrong.
        ''' 

        user = {
            'username': 'john',
            'password': user_data['password'],
        }
        res = self.client.post( url_login, user, format="json" )

        self.assertEqual( res.data['status'], 'fail' )
        self.assertEqual( res.status_code, 400 )
        self.assertIsNotNone(res.data['message'])
        self.assertIsNone( res.data['data']['errors'].get( 'username', None))

    def test_user_login_no_data( self ):
        ''' 
            Test fail login with HTTP_400_BAD_REQUEST.
            Wrong username but just a message is return, 
            not specifying what is wrong.
        ''' 

        user = {}
        res = self.client.post( url_login, user, format="json" )

        self.assertEqual( res.data['status'], 'fail' )
        self.assertEqual( res.status_code, 400 )
        self.assertIsNotNone(res.data['message'])
        self.assertIsNotNone( res.data['data']['errors'].get( 'username', None))
        self.assertIsNotNone( res.data['data']['errors'].get( 'password', None))
    
    def test_user_logout( self ):
        ''' 
            Test user logout
        ''' 

        set_up_credentials( self )
        res = self.client.post( url_logout, format="json" )

        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( res.status_code, 200 )
        self.assertIsNotNone(res.data['message'])
        self.assertIsNone( res.data.get( 'data', None ) )

        tear_down_credentials( self )

    def test_user_logout_no_token( self ):
        ''' 
            Try to log out user without a token
        ''' 

        res = self.client.post( url_logout, format="json" )

        self.assertEqual( res.data['status'], 'error' )
        self.assertEqual( res.status_code, 403 )
        self.assertIsNotNone(res.data['message'])
        self.assertIsNone( res.data.get( 'data', None ) )

    
               

       
  
    