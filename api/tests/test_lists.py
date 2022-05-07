# DJANGO
from django.test import TestCase
from django.urls import reverse

# DJANGO REST FRAMEWORK
from rest_framework.test import APIRequestFactory, APITestCase
from rest_framework.authtoken.models import Token

# FROM API APP
from api.tests.settings import url_register, \
    user_data, set_up_credentials, tear_down_credentials, change_credentials, \
    list_data, url_get_list, url_get_lists, url_create_list, url_update_list, url_delete_list

from api.tests.settings import create_second_user 

import copy
import pdb

# Create your tests here.

class TaskListsTests( APITestCase ):

    def setUp( self, *args, **kwargs ):
        super().setUp( *args, **kwargs)

        # Get an user
        self.user = self.client.post( url_register, user_data, format='json' ).data['data']
        self.user_token = self.user['token']
        set_up_credentials( self )
    
    def test_create_list( self ):
        ''' 
            Test task creation with minimum data.
            Creates a list and creates a task
        '''

        res = self.client.post( url_create_list, list_data, format='json' )
        self.assertIsNotNone( res.data )
        self.assertEqual( res.status_code, 201 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone( res.data['data'].get( 'list' ) )
    
    def test_data_returned_list_creation( self ):
        '''
            Test what data is being returned after creating a task list.
            Check that the task list don't have user information.
        '''
        
        res = self.client.post( url_create_list, list_data, format='json' )
        self.assertIsNotNone( res.data )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone( res.data['data']['list']['title'] )
        self.assertIsNotNone( res.data['data']['list']['description'] )
        self.assertFalse( res.data['data']['list']['complete'] )
        self.assertIsNotNone( res.data['data']['list']['start_date'] )
        self.assertIsNone( res.data['data']['list']['end_date'] )
        self.assertIsNone( res.data['data']['list'].get('roles', None) ) # this is a write only field
        self.assertEqual( res.data['data']['list']['tasks'], [] )
        self.assertIsNotNone( res.data['message'] )
        self.assertIsNone( res.data['data'].get('warning_messages', None) ) # this field is empty here
    
    def test_create_list_no_auth( self ):
        '''
            Test creating a task list without being authenticated.
        '''
        tear_down_credentials( self )
        res = self.client.post( url_create_list, list_data, format='json' )
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNotNone( res.data['message'] )
        self.assertIsNone( res.data.get('data', None) ) # this field is empty here
        set_up_credentials( self )
    
    def test_create_with_roles( self ):
        data = copy.deepcopy( list_data )
        user, token = create_second_user(self)

        data['roles'] = [
            {
                'user': user.get( 'id', None ),
                'role': 4
            }
        ]
        res = self.client.post( url_create_list, data, format='json' )
        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( res.status_code, 201 )
        self.assertIsNotNone( res.data['data'] )

    def test_create_list_with_roles_user_missing( self ):
        '''
            Tries to create a list and also create a role for another user
            but the user id is missing.
            Should return an fail status.
        '''

        data = copy.deepcopy( list_data )

        data['roles'] = [
            {
                'role': 4
            }
        ]

        res = self.client.post( url_create_list, data, format='json' )

        self.assertEqual( res.data['status'], 'fail' )
        self.assertEqual( res.status_code, 400 )
        self.assertIsNotNone( res.data['data'] )
        self.assertIsNotNone( res.data['data'].get( 'errors', None ) )
        self.assertIsNotNone( res.data.get( 'message', None ) )
    
    def test_create_list_with_roles_role_missing( self ):
        '''
            Tries to create a list and also create a role for another user
            but the role itself is missing.
            Should return an fail status.
        '''

        data = copy.deepcopy( list_data )
        user, token = create_second_user(self)

        data['roles'] = [
            {
                'user': user.get( 'id', None )
            }
        ]

        res = self.client.post( url_create_list, data, format='json' )

        self.assertEqual( res.data['status'], 'fail' )
        self.assertEqual( res.status_code, 400 )
        self.assertIsNotNone( res.data['data'] )
        self.assertIsNotNone( res.data['data'].get( 'errors', None ) )
        self.assertIsNotNone( res.data.get( 'message', None ) )
    
    def test_create_list_without_title( self ):
        '''
            Tries to create a list without a title.
        '''

        data = copy.deepcopy( list_data )
        data['title'] = ''

        res = self.client.post( url_create_list, data, format='json' )

        self.assertEqual( res.data['status'], 'fail' )
        self.assertEqual( res.status_code, 400 )
        self.assertIsNotNone( res.data['data'] )
        self.assertIsNotNone( res.data['data'].get( 'errors', None ) )
        self.assertIsNotNone( res.data.get( 'message', None ) )   
    
    def test_get_list_of_lists( self ):
        '''
            Test getting all the lists from an user
        '''
        self.client.post( url_create_list, list_data, format='json' ) # creates a list
        res = self.client.get( url_get_lists, format='json' )

        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( res.status_code, 200 )
        self.assertIsNotNone( res.data['data'] )
        self.assertEqual( len(res.data['data']['lists']), 1 )
        self.assertIsNotNone( res.data['data']['lists'][0].get( 'title', None ) )
        self.assertIsNotNone( res.data['data']['lists'][0].get( 'description', None ) )
        self.assertIsNotNone( res.data['data']['lists'][0].get( 'complete', None ) )
        self.assertIsNotNone( res.data['data']['lists'][0].get( 'start_date', None ) )
        self.assertIsNone( res.data['data']['lists'][0].get( 'end_date') )
        self.assertIsNotNone( res.data['data']['lists'][0].get( 'tasks', None ) )
        self.assertIsNone( res.data['data']['lists'][0].get( 'roles', None ) )
    
    def test_get_list_of_lists_without_auth( self ):
        '''
            Try getting all the lists from an user
            without authentication -> error
        '''
        self.client.post( url_create_list, list_data, format='json' ) # creates a list

        # remove credentials
        tear_down_credentials( self )
        res = self.client.get( url_get_lists, format='json' )

        self.assertEqual( res.data['status'], 'error' )
        self.assertEqual( res.status_code, 401 )
        self.assertIsNotNone( res.data.get( 'message', None ) )   

        # set up credentials for next tests
        set_up_credentials( self )

    def test_get_a_list( self ):
        '''
            Get a specific list with all fields except assignments.
            roles and tasks should be there
        '''
        self.client.post( url_create_list, list_data, format='json' ) # creates a list
        res = self.client.get( url_get_list, format='json' ) # try accessing the list from user 1

        self.assertEqual(  res.status_code, 200)
        self.assertEqual(  res.data.get( 'status', None ), 'success' )
        self.assertIsNotNone( res.data.get('data'), None )
        self.assertIsNotNone( res.data['data'].get('list') )
        self.assertEqual( len(res.data['data']['list'].get('users')), 1 )
        self.assertEqual( len(res.data['data']['list'].get('tasks')), 0 )
        self.assertEqual( res.data.get( 'message', None ), '' )

    def test_get_a_list_without_auth( self ):
        '''
            Try getting a list from an user
            without authentication
        '''
        self.client.post( url_create_list, list_data, format='json' ) # creates a list

        tear_down_credentials( self ) # remove credentials 
        
        res = self.client.get( url_get_list, format='json' ) # try accessing the list from user 1

        self.assertEqual(  res.status_code, 403)
        self.assertEqual(  res.data.get( 'status', None ), 'error' )
        self.assertIsNotNone( res.data.get('message'), None )

        set_up_credentials( self ) # add credentials back

    def test_get_a_list_from_another_user( self ):
        '''
            Try getting a list from an user
            without authentication
        '''
        user, token = create_second_user(self)
        change_credentials( self, token ) # change the user
        res = self.client.get( url_get_list, format='json' ) # try accessing the list from user 1

        self.assertNotEqual(  token, self.user_token)
        self.assertEqual(  res.status_code, 404)
        self.assertEqual(  res.data.get( 'status', None ), 'error' )
        self.assertIsNotNone( res.data.get( 'message', None ) )

        set_up_credentials( self )
    
    def test_get_a_list_with_a_task( self ):
        '''
            Get a list and check that there's a task 
        '''
        pass
    
    def test_updating_list_title( self ):
        '''
            Update the list successfully
        '''
        data = copy.deepcopy(list_data)
        data['title'] = "updated title"
        del data['description']

        self.client.post( url_create_list, list_data, format='json' )
        res = self.client.patch( url_update_list, data, format='json' )

        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( res.status_code, 200 )
        self.assertNotEqual( res.data['data']['list'].get('title'), list_data.get('title') )
        self.assertIsNotNone( res.data['data'] )
        self.assertIsNotNone( res.data.get( 'message', None ) )   
    
    def test_updating_desc( self ):
        '''
            Update the description successfully
        '''
        data = copy.deepcopy(list_data)
        data['description'] = "updated successfully"

        self.client.post( url_create_list, list_data, format='json' )
        res = self.client.patch( url_update_list, data, format='json' )

        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( res.status_code, 200 )
        self.assertNotEqual( res.data['data']['list'].get('description'), list_data.get('description') )
        self.assertIsNotNone( res.data['data'] )
        self.assertIsNotNone( res.data.get( 'message', None ) )   
    
    def test_updating_complete_to_true( self ):
        '''
            Mark the list as complete
        '''
        data = copy.deepcopy(list_data)
        data['complete'] = True
        del data['description']

        self.client.post( url_create_list, list_data, format='json' )
        res = self.client.patch( url_update_list, data, format='json' )

        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( res.status_code, 200 )
        self.assertIsNotNone( res.data['data'] )
        self.assertNotEqual( res.data['data'].get('complete'), False)
        self.assertIsNotNone( res.data.get( 'message', None ) )   
    
    def test_updating_complete_to_false( self ):
        '''
            Mark the list as incomplete
        '''
        data = copy.deepcopy(list_data)
        data['complete'] = False
        del data['description']

        self.client.post( url_create_list, list_data, format='json' )
        res = self.client.patch( url_update_list, data, format='json' )

        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( res.status_code, 200 )
        self.assertIsNotNone( res.data['data'] )
        self.assertNotEqual( res.data['data'].get('complete'), True)
        self.assertIsNotNone( res.data.get( 'message', None ) )   
    
    def test_delete_list( self ):
        '''
            Delete a list successfully
        '''

        self.client.post( url_create_list, list_data, format='json' )

        res = self.client.delete( url_delete_list )

        self.assertEqual( res.status_code, 200)
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertEqual( res.data.get('message'), 'The list has been deleted.' )

    def test_delete_list_without_auth( self ):
        '''
            Try to delete a list without authorization
        '''
        self.client.post( url_create_list, list_data, format='json' )

        tear_down_credentials( self )
        res = self.client.delete( url_delete_list )

        self.assertEqual( res.status_code, 403)
        self.assertEqual( res.data.get('status'), 'error')
        self.assertIsNotNone( res.data.get('message', None) )

        set_up_credentials( self )

    def test_delete_list_not_found( self ):
        '''
            Try to delete a list without authorization
        '''
        # self.client.post( url_create_list, list_data, format='json' )

        res = self.client.delete( url_delete_list )
        self.assertEqual( res.status_code, 404)
        self.assertEqual( res.data.get('status'), 'error')
        self.assertIsNotNone( res.data.get('message', None) )

    def test_delete_list_low_auth( self ):
        '''
            Try to delete a list with low authorization
        '''
        user, token = create_second_user(self)
        data = copy.deepcopy( list_data )

        data['roles'] = {
            'user': 2,
            'role': 4
        }

        self.client.post( url_create_list, list_data, format='json' )

        change_credentials( self, token ) # Change credentials to the 2nd user

        res = self.client.delete( url_delete_list ) # try to delete list with the 2nd user

        self.assertEqual( res.status_code, 401)
        self.assertEqual( res.data.get('status'), 'error')
        self.assertIsNotNone( res.data.get('message', None) )
