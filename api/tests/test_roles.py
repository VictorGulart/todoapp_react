from django.urls.base import reverse
from rest_framework.test import APITestCase

from api.tests.settings import set_up_credentials, tear_down_credentials, change_credentials, \
                    create_second_user, create_third_user, \
                    user_data, task_data, list_data, url_register, url_create_list, \
                    url_create_role, url_update_role, url_delete_role

# API Models
from api.models import Role

from pdb import set_trace

class TestAssignments( APITestCase ):

    def setUp( self, *args, **kwargs ) -> None:
        super().setUp( *args, **kwargs )

        # Set up user
        res = self.client.post( url_register, user_data, format='json' )
        self.user = res.data['data']['user']
        self.user_token = res.data['data']['token']
        set_up_credentials( self )

        # Set up a test list
        res = self.client.post( url_create_list, list_data, format='json' )
        self.test_list = res.data['data']['list']

    def tearDown( self, *args, **kwargs ) -> None:
        super().tearDown( *args, **kwargs )

    def test_owner_role_creation( self ):
        '''
            Test if after creating a list, 
            the user creator has a role of owner
        '''
        role = Role.objects.get( user=self.user['id'], task_list=self.test_list['id'] )

        self.assertIsNotNone( role )
        self.assertEqual( role.user.id, self.user['id'] )
        self.assertEqual( role.task_list.id, self.test_list['id'] )
        self.assertEqual( role.get_role_display().lower() , 'owner' )

    def test_create_a_role( self ):
        '''
            Create a role for a second user
            VIEWER ROLE
        '''
        user, token = create_second_user( self )
        
        # pass the role - OWNER, EDITOR, WORKER, VIEWER
        data ={
            'data': {
                'role': 'VIEWER'
            }
        }

        res = self.client.post( url_create_role, data, format='json' )
        roles = Role.objects.all()

        self.assertEqual( res.status_code, 201 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone( res.data.get('message', None) )
        self.assertNotEqual( res.data.get('message', None), '' )
        self.assertEqual( len(roles), 2 )
        self.assertEqual( roles[1].get_role_display().lower(), 'viewer' )

    def test_update_role( self ):
        ''' 
            Send the new role in JSON
        '''
        user, token = create_second_user( self )

        # create role
        data = {
            'data' : {
                'role':'VIEWER'
            }
        }
        res = self.client.post( url_create_role, data, format='json' )

        # update role
        data = {
            'data' : {
                'role':'EDITOR'
            }
        }
        res = self.client.post( url_update_role, data, format='json' )

        self.assertEqual( res.status_code, 200 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertEqual( Role.objects.all()[1].get_role_display().lower(), 'editor' )
    
    def test_delete_role( self ):
        '''
            Delete an app successfuly
        '''
        # Create a second list
        self.client.post( url_create_list, list_data, format='json' )

        self.assertEqual( len(Role.objects.all() ), 2 ) # because there is one by default

        res = self.client.delete( url_delete_role ) # data not needed 

        self.assertEqual( res.status_code, 200 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone( res.data.get( 'message', None) )
        self.assertNotEqual( res.data['message'], '' )
        self.assertEqual( len(Role.objects.all() ), 1 ) # because there is one by default
    
    def test_try_create_with_no_auth( self ):
        '''
            Try to create a role but there are no credentials
        '''

        user, token = create_second_user( self )

        tear_down_credentials( self ) # remove credentials

        res = self.client.post( url_create_role, format='json' )

        self.assertEqual( res.status_code, 403 ) # goes to default custom exception handler
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNotNone( res.data.get( 'message', None) )
        self.assertNotEqual( res.data['message'], '' )

        set_up_credentials( self )

    def test_try_update_with_no_auth( self ):
        '''
            Try to update a role but there are no credentials
        '''

        user, token = create_second_user( self )
        res = self.client.post( url_create_role, format='json' )

        # Check Creation
        self.assertEqual( res.status_code, 201 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone( res.data.get( 'message', None) )
        self.assertNotEqual( res.data['message'], '' )

        tear_down_credentials( self ) # remove credentials

        data ={
            'data': {
                'role': 'EDITOR'
            }
        }

        res = self.client.post( url_update_role, data, format='json' ) 

        self.assertEqual( res.status_code, 403 ) # goes to default custom exception handler
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNotNone( res.data.get( 'message', None) )
        self.assertNotEqual( res.data['message'], '' )

        set_up_credentials( self )

    def test_try_delete_with_no_auth( self ):
        '''
            Try to delete a role but there are no credentials
        '''

        user, token = create_second_user( self )
        res = self.client.post( url_create_role, format='json' )

        # Check Creation
        self.assertEqual( res.status_code, 201 )
        self.assertEqual( res.data['status'], 'success' )
        self.assertIsNotNone( res.data.get( 'message', None) )
        self.assertNotEqual( res.data['message'], '' )

        tear_down_credentials( self ) # remove credentials

        res = self.client.delete( url_delete_role, format='json' ) 

        self.assertEqual( res.status_code, 403 ) # goes to default custom exception handler
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNotNone( res.data.get( 'message', None) )
        self.assertNotEqual( res.data['message'], '' )

        set_up_credentials( self )
    
    def test_try_delete_role_not_found( self ):
        '''
            Try to delete a role but there is none defined
        '''
         # make sure the list exists

        user, token = create_second_user( self )

        res = self.client.delete( reverse( 'delete-role', kwargs={
            'lst' : 1,
            'user' : 2
        } ), format='json' ) 
        
        self.assertEqual( res.status_code, 404 ) # goes to default custom exception handler
        self.assertEqual( res.data['status'], 'error' )
        self.assertIsNotNone( res.data.get( 'message', None) )
        self.assertNotEqual( res.data['message'], '' )

