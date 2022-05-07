from django.urls.base import reverse
from rest_framework.test import APITestCase 

#### Settings ####
from api.tests.settings import set_up_credentials, tear_down_credentials, change_credentials, \
                            create_second_user, create_third_user, \
                            url_register, url_create_list, \
                            url_get_task, url_create_task, url_update_task, url_delete_task, \
                            user_data, task_data, list_data

# Models Import
from api.models import Assignment
from django.contrib.auth.models import User

import copy

import pdb


class TestTasks( APITestCase ):
    def setUp( self, *args, **kwargs ):
        super().setUp( *args, **kwargs)

        # Set up the user
        res = self.client.post( url_register, user_data, format='json' )
        self.user = res.data['data']['user']
        self.user_token = res.data['data']['token']

        set_up_credentials( self ) # add header authorization
        
        self.client.post( url_create_list, list_data, format='json' ) # create main list

    def test_create_task( self ):
        ''' 
            Test task creation.
            Creates a task, simple without assignments.
        '''

        res = self.client.post( url_create_task, task_data, format='json' )

        self.assertEqual( res.status_code, 201 )
        self.assertEqual( res.data.get('status'), 'success' )
        self.assertIsNotNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertIsNotNone( res.data['data'].get('task', None) )
    
    def test_create_task_default_owner( self ):
        '''
            Test that the user that creates the task has the task automatically
            assigned to himself.
        '''
        res = self.client.post( url_create_task, task_data, format='json' )

        # check the assignment model for the new task assignment
        task = res.data['data']['task']
        assignment = Assignment.objects.get( task=task.get('id'), user=self.user['id'] )        

        self.assertIsNotNone( assignment )
        self.assertEqual( assignment.user.id, 1)
        self.assertEqual( assignment.task.id, 1)
    
    def test_create_task_with_roles( self ):
        '''
            Try to create a task with a 2nd user that does
            not have a role set up.
        '''
        user, token = create_second_user( self )
        
        data = copy.deepcopy( task_data )
        data['assignments'] = [ 2 ]

        change_credentials( self, token )
        res = self.client.post( url_create_task, data, format='json' )

        self.assertEqual( res.status_code, 403 )
        self.assertEqual( res.data.get('status'), 'error' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )

        set_up_credentials( self )

    def test_create_task_without_authentication( self ):
        '''
            Try to create a task without authentication.    
            Without a token!
        '''
        tear_down_credentials( self )
        
        res = self.client.post( url_create_task, task_data, format='json' )

        self.assertEqual( res.status_code, 403 )
        self.assertEqual( res.data.get('status'), 'error' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )

        set_up_credentials( self )
    
    def test_create_assign_task_without_role( self ):
        '''
            Try to create a task with a 2nd user that does
            not have a role set up.
        '''
        user, token = create_second_user( self )
        change_credentials( self, token )
        res = self.client.post( url_create_task, task_data, format='json' )

        self.assertEqual( res.status_code, 403 )
        self.assertEqual( res.data.get('status'), 'error' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )

        set_up_credentials( self )

    def test_create_assign_task_without_role( self ):
        '''
            Try to create a task with a 2nd user that does
            not have a role set up.
        '''
        user, token = create_second_user( self )

        change_credentials( self, token )

        res = self.client.post( url_create_task, task_data, format='json' )

        self.assertEqual( res.status_code, 403 )
        self.assertEqual( res.data.get('status'), 'error' )
        self.assertIsNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('message', None) )

        set_up_credentials( self )
    
    def test_create_task_with_assignments( self ):
        '''
            Create a task and assign to a 2nd user
            This is a double test, it tests the assignment, and
            Also the assignment of a task to a user that does not have a role 
            on the list so the mimimum role level is assigned to it.
        '''
        user, token = create_second_user( self )

        data = copy.deepcopy( task_data )
        data['assignments'].append( 2 ) # add user

        res = self.client.post( url_create_task, data, format='json' )

        user = User.objects.get( pk=2 )
        assignment = Assignment.objects.get( user=user )

        self.assertEqual( res.status_code, 201 )
        self.assertIsNotNone( assignment )
        self.assertEqual( res.data.get('status'), 'success' )
        self.assertIsNotNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data.get('warning_messages', None) )
        self.assertIsNotNone( res.data.get('message', None) )
    
    def test_create_task_with_subtasks( self ):
        ...

    def test_update_task_title_desc( self ):
        '''
            Update title and description of the task
        '''

        # Create task
        res = self.client.post( url_create_task, task_data, format='json' )

        # update task
        data = copy.deepcopy( res.data['data']['task'] )

        data['title'] = "New Title"
        data['description']  = "New Description"

        res = self.client.patch( url_update_task, data, format='json' )

        # Assertions
        self.assertEqual( res.data.get('status', None), 'success' )
        self.assertIsNotNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data['data'].get('task', None) )
        self.assertNotEqual( res.data['data']['task'].get( 'title' ), task_data['title'] )
        self.assertNotEqual( res.data['data']['task'].get( 'description' ), task_data['description'] )

    def test_try_update_task_title_desc( self ):
        '''
            Tries to update title and description of the wrong task
        '''

        # Create task
        res = self.client.post( url_create_task, task_data, format='json' )

        # update task
        data = copy.deepcopy( res.data['data']['task'] )

        data['title'] = "New Title"
        data['description']  = "New Description"

        res = self.client.patch( reverse( 'update-task', kwargs={'pk':2} ) , data, format='json' )

        # Assertions
        self.assertEqual( res.data.get('status', None), 'error' )
        self.assertIsNotNone( res.data.get('message', None) )

    def test_update_task_not_including_assignments( self ):
        '''
            Update the task without including new assignments
            assignments values is an empty list [], meaning
            nothing to update.
        '''

        # Assign task to a 2nd user

        user, token = create_second_user( self )
        data = copy.deepcopy( task_data )
        data['assignments'] = [2]

        # Create task
        res = self.client.post( url_create_task, data, format='json' )

        # update task
        data = copy.deepcopy( res.data['data']['task'] )

        data['title'] = "New Title"
        data['description']  = "New Description"
        data['assignments'] = [] 
        
        res = self.client.patch( url_update_task , data, format='json' )

        # Assertions
        self.assertEqual( res.data.get('status', None), 'success' )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertIsNotNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data['data'].get('task', None) )

        # confirm that the assignments did not change
        self.assertEqual( len( res.data['data']['task']['assignments'] ), 2 )

    def test_complete_task( self ):
        '''
            Completes task
        '''

        # Create task
        res = self.client.post( url_create_task, task_data, format='json' )

        current_end = res.data['data']['task']['end_date']

        # update task
        data = copy.deepcopy( res.data['data']['task'] )
        data['complete'] = True 
        
        res = self.client.patch( url_update_task , data, format='json' )

        # Assertions
        self.assertEqual( res.data.get('status', None), 'success' )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertIsNotNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data['data'].get('task', None) )
        self.assertTrue( res.data['data']['task']['complete'] )

    def test_update_add_another_assignment( self ):
        '''
            Adds a 3rd user to the assignments list.
            Only passes to the API a list [3], the other 2 will be kept
        '''

        user, token = create_second_user( self )
        user, token = create_third_user( self )

        # Create task with 2nd user
        data = copy.deepcopy( task_data )
        data['assignments'] = [ 2 ] 
        res = self.client.post( url_create_task, data, format='json' )

        # Update task
        data = copy.deepcopy( res.data['data']['task'] )
        data['assignments'] = [ 3 ] 
        
        res = self.client.patch( url_update_task , data, format='json' )

        # Assertions
        self.assertEqual( res.data.get('status', None), 'success' )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertIsNotNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data['data'].get('task', None) )
        self.assertEqual( len( res.data['data']['task'].get('assignments', None) ), 3 )

    def test_get_task( self ):
        '''
            Get a task in detail
        '''
        self.client.post( url_create_task, task_data, format='json' )
        res = self.client.get( url_get_task )
 
        # Assertions
        self.assertEqual( res.data.get('status', None), 'success' )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertIsNotNone( res.data.get('data', None) )
        self.assertIsNotNone( res.data['data'].get('task', None) )

    def test_try_to_get_a_task( self ):
        '''
            Tries to get a task that is not assigned to the user
        '''
        self.client.post( url_create_task, task_data, format='json' )

        user, token = create_second_user( self )
        change_credentials( self, token )

        res = self.client.get( url_get_task )

        # Assertions
        self.assertEqual( res.data.get('status', None), 'error' )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertNotEqual( res.data.get('message', None), '' )
        self.assertIsNone( res.data.get('data', None) )

        set_up_credentials( self )

    def test_delete_task( self ):
        '''
            Delete a task
        '''
        self.client.post( url_create_task, task_data, format='json' )

        res = self.client.delete( url_delete_task )

        # Assertions
        self.assertEqual( res.data.get('status', None), 'success' )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertNotEqual( res.data.get('message', None), '' )
        self.assertIsNone( res.data.get('data', None) )

    def test_try_delete_task( self ):
        '''
            An user tries to delete a task without a role set up
        '''
        # 2nd user
        user, token = create_second_user( self )

        # Creates a task with 1st user
        self.client.post( url_create_task, task_data, format='json' )

        # Try to delete with 2nd user
        change_credentials( self, token )
        res = self.client.delete( url_delete_task )

        # Assertions
        self.assertEqual( res.data.get('status', None), 'error' )
        self.assertEqual( res.status_code, 401)
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertNotEqual( res.data.get('message', None), '' )
        self.assertIsNone( res.data.get('data', None) )

        set_up_credentials( self )




