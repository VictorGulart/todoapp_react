from rest_framework.test import APITestCase
from django.urls.base import reverse
from django.contrib.auth.models import User

from api.tests.settings import set_up_credentials, tear_down_credentials, change_credentials, \
                    create_second_user, create_third_user, url_register, \
                    user_data, task_data, list_data, \
                    url_create_list, url_create_task, \
                    url_create_role, \
                    url_create_assignment, url_delete_assignment

# API Models
from api.models import Task, Assignment, TaskList

# PDB Debugging
from pdb import set_trace


class TestAssignments( APITestCase ):

    def setUp(self) -> None:
        # Set up user
        res = self.client.post( url_register, user_data, format='json' )
        self.user = res.data['data']['user']
        self.user_token = res.data['data']['token']
        set_up_credentials( self )

        # Create a list
        self.client.post( url_create_list, list_data, format='json' )
        self.test_list = TaskList.objects.get( pk=1 )

        # Create a task
        self.client.post( url_create_task, task_data, format='json' )
        self.test_task = Task.objects.get( pk=1 )

        # Second user
        self.second_user, self.second_user_token = create_second_user( self ) 

        # Set up second user role
        data = {
            'role': 'EDITOR'
        }
        self.client.post( url_create_role, data, format='json' )

        return super().setUp()
    
    def tearDown(self) -> None:
        return super().tearDown()

    def test_create_assignment( self ):
        '''
            Create an assignment
        '''
        data = {
            'from_list': 1
        }
        res = self.client.post( url_create_assignment, data, format='json')
        set_trace() 
        self.assertEqual( res.status_code, 201 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data['data'].get('assignment', None) )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertNotEqual( res.data.get('message', None), '' )
        self.assertEqual( len( self.test_task.users.all() ), 2 )
        self.assertEqual( len( self.test_task.assignments.all() ), 2 )

    def test_delete_assignment( self ):
        '''
            Deletes an assignment
        '''

        # Create the assignment
        data = {
            'from_list': 1
        }
        self.client.post( url_create_assignment, data, format='json')

        res = self.client.delete( url_delete_assignment )

        self.assertEqual( res.status_code, 200 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertNotEqual( res.data.get('message', None), '' )
        self.assertEqual( len( self.test_task.users.all() ), 1 )
        self.assertEqual( len( self.test_task.assignments.all() ), 1 )



    def test_try_create_with_no_auth( self ):
        '''
            Try to create an assignment without auth
        '''
        data = {
            'from_list': 1
        }
        tear_down_credentials( self )

        res = self.client.post( url_create_assignment, data, format='json')
         
        self.assertEqual( res.status_code, 403 )
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertNotEqual( res.data.get('message', None), '' )
        self.assertEqual( len( self.test_task.users.all() ), 1 )
        self.assertEqual( len( self.test_task.assignments.all() ), 1 )

        set_up_credentials( self )

    def test_try_delete_with_no_auth( self ):
        '''
            Try to delete an assignment without auth
        '''
        data = {
            'from_list': 1
        }
        self.client.post( url_create_assignment, data, format='json')

        tear_down_credentials( self )

        res = self.client.delete( url_delete_assignment )
         
        self.assertEqual( res.status_code, 403 )
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertNotEqual( res.data.get('message', None), '' )
        self.assertEqual( len( self.test_task.users.all() ), 2 )
        self.assertEqual( len( self.test_task.assignments.all() ), 2 )

        set_up_credentials( self )
    
    def test_try_to_assign_nonexistent_task( self ):
        '''
            Try to assign a task that does not exist to an user
        '''
        data = {
            'from_list': 1
        }
        res = self.client.post( reverse( 'create-assignment', 
                kwargs={'user':2, 'task':2} ), data, format='json')
         
        self.assertEqual( res.status_code, 404 )
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertEqual( res.data.get('message', None), 'Task not found.' )
        self.assertEqual( len( self.test_task.users.all() ), 1 ) # confirm no assignment happened
        self.assertEqual( len( self.test_task.assignments.all() ), 1 )

    def test_try_to_assign_to_nonexistent_user( self ):
        '''
            Try to assign a task to an nonexistent user
        '''
        data = {
            'from_list': 1
        }
        res = self.client.post( reverse( 'create-assignment', 
                kwargs={'user':3, 'task':1} ), data, format='json')
         
        self.assertEqual( res.status_code, 404 )
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertEqual( res.data.get('message', None), 'User not found.' )
        self.assertEqual( len( self.test_task.users.all() ), 1 ) # confirm no assignment happened
        self.assertEqual( len( self.test_task.assignments.all() ), 1 )

