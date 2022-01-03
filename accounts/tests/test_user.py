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
from accounts.tests.settings import url_register, url_user, user_data, set_up_credentials, tear_down_credentials



class GetUserTest( APITestCase ):
    def setUp( self ):
        # Set up User
        res = self.client.post( url_register, user_data, format="json")
        self.user = res.data['data']['user']
        self.user_token = res.data['data']['token']
        
        # Set user credential
        self.client.credentials(
                HTTP_AUTHORIZATION=f'Token {self.user_token}'
        )
        super().setUp()
    
    def tearDown( self ):
        super().tearDown()
            
    
    def test_get_user_details_with_token( self ):
        ''' 
            Test we can get the user details with token 
        '''
        
        res = self.client.get( url_user, user_data, format="json")

        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( res.status_code, 200 )
        self.assertIsNotNone(res.data['data']['user'])
    
    def test_get_user_details_without_token( self ):
        ''' 
            Test we can get the user details without token 
            Expects a HTTP_403_UNAUTHORIZED
        '''
        tear_down_credentials(self)
        res = self.client.get( url_user, user_data, format="json")

        self.assertEqual( res.status_code, 403 )
        self.assertIsNotNone( res.data['message'])

        set_up_credentials(self)

    def test_password_is_hashed( self ):
        ''' 
            Internal test to check the password was hashed.
        '''
        user = User.objects.get( pk = self.user.get( 'id' ) )
        self.assertNotEqual( user.password, user_data['password'] )
