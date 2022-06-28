from django.urls.base import reverse
from rest_framework.test import APITestCase

from api.tests.settings import set_up_credentials, tear_down_credentials, change_credentials, \
                    create_second_user, create_third_user, \
                    user_data, list_data, task_data, subtask_data, url_register, url_create_list, \
                    url_create_task, url_create_subtask, url_update_subtask, url_delete_subtask
                    

from api.models import SubTask

from copy import deepcopy

from pdb import set_trace

'''
    Test getting and creating a subtask
'''

class TestSubTasks(APITestCase):
    def setUp(self, *args, **kwargs) -> None:
        super().setUp(*args, **kwargs)

        # Set up the user and it's credential
        res = self.client.post( url_register, user_data, format='json' )
        self.user = res.data['data']['user']
        self.user_token = res.data['data']['token']

        set_up_credentials( self ) # add header authorization
        
        self.client.post( url_create_list, list_data, format='json' ) # create main list
        self.client.post( url_create_task, task_data, format='json' ) # create main task

    
    def tearDown(self) -> None:
        return super().tearDown()

    def test_create(self):
        '''
            Creates a simple task
        '''
        res = self.client.post( url_create_subtask,  subtask_data, format='json')
        # set_trace() 
        self.assertEqual(res.data.get("status", None), "success")
        self.assertEqual(res.status_code, 201)
        self.assertIsNotNone(res.data.get("data", None))
        self.assertIsNotNone(res.data['data'].get("subtask", None))
        self.assertIsNotNone(res.data.get("data", None))
    
    def test_fail_create_no_title(self):
        '''
            Creates a simple task
        '''
        data = deepcopy(subtask_data)
        del data['title']

        res = self.client.post( url_create_subtask,  data, format='json')
        self.assertEqual(res.data.get("status", None), "fail")
        self.assertEqual(res.status_code, 400)
        self.assertIsNotNone(res.data.get("data", None))
        self.assertIsNotNone(res.data['data'].get("errors", None))
        self.assertNotEqual(res.data['data'].get("message", None), "")
    
    def test_fail_create_no_task(self):
        '''
            Creates a simple task
        '''
        data = deepcopy(subtask_data)
        del data['from_task']

        res = self.client.post( url_create_subtask,  data, format='json')
        self.assertEqual(res.data.get("status", None), "fail")
        self.assertEqual(res.status_code, 400)
        self.assertIsNotNone(res.data.get("data", None))
        self.assertIsNotNone(res.data['data'].get("errors", None))
        self.assertNotEqual(res.data['data'].get("message", None), "")
    