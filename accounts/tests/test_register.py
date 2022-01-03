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
from accounts.tests.settings import url_register, url_login, user_data


class UserRegistrationTest( APITestCase ):
    def setUp( self ):
        super().setUp()
    
    def tearDown( self ):
        super().tearDown()

    def test_user_create( self ):
        '''
            Test registering an user. 
            Test user object.
            Test response success and token is available.
        '''
        res = self.client.post( url_register, user_data, format="json")
        self.assertEqual( res.status_code, 201 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone(res.data['data']['token'])

    def test_username_create_fail( self ):
        '''
            Test registering an user without username. 
        '''
        user = {
            "email": user_data['email'],
            "password": user_data['password']
        }

        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIn('username', res.data['data']['errors'])

    def test_password_create_fail( self ):
        '''
            Test registering an user without password. 
        '''
        
        user = {
            "username": user_data['username'],
            "email": user_data['email'],
        }
        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIn('password', res.data['data']['errors'])

    def test_email_create_fail( self ):
        '''
            Test registering an user without email. 
        '''
        
        user = {
            'username': user_data['username'],
            'password': '123456',
        }
        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIn('email', res.data['data']['errors'])
    
    def test_email_pass_create_fail( self ):
        '''
            Test registering an user without email and password. 
        '''
        
        user = {
            'username': user_data['username'],
        }
        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIn('email', res.data['data']['errors'])
        self.assertIn('password', res.data['data']['errors'])
        self.assertEqual( len(res.data['data']['errors']), 2 )

    def test_email_username_create_fail( self ):
        '''
            Test registering an user without email and username. 
        '''
        
        user = {
            'password': '123456',
        }
        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIn('email', res.data['data']['errors'])
        self.assertIn('username', res.data['data']['errors'])
        self.assertEqual( len(res.data['data']['errors']), 2 )

    def test_username_pass_create_fail( self ):
        '''
            Test registering an user without email and username. 
        '''
        
        user = {
            'email': user_data['email'],
        }
        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIn('username', res.data['data']['errors'])
        self.assertIn('password', res.data['data']['errors'])
        self.assertEqual( len(res.data['data']['errors']), 2 )
    
    def test_username_pass_email_create_fail( self ):
        '''
            Test registering an user without any data. 
        '''
        
        user = {
        }
        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIn('username', res.data['data']['errors'])
        self.assertIn('password', res.data['data']['errors'])
        self.assertIn('email', res.data['data']['errors'])
        self.assertEqual( len(res.data['data']['errors']), 3 )

    def test_create_duplicate_user_username( self ):
        '''
            Test registering a duplicate user - same usermane
        '''
        user = {
            'username': user_data['username'],
            'email': 'johnduplicate@gmail.com',
            'password': '123456',
        }
        self.client.post( url_register, user_data, format="json" )
        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIsNotNone( res.data['message'] )

    def test_create_duplicate_user_email( self ):
        '''
            Test registering a duplicate user - same usermane
        '''
        user = {
            'username': 'johnduplicate',
            'email': user_data['email'],
            'password': '123456',
        }

        self.client.post( url_register, user_data, format="json" )
        res = self.client.post( url_register, user, format="json" )
        self.assertEqual( res.status_code, 400 )
        self.assertEqual( res.data['status'], 'fail' )
        self.assertIsNotNone( res.data['message'] )

   
