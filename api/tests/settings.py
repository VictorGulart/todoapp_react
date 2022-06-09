
from django.urls import reverse

# URLS ACCOUNTS
url_register = reverse('register')
url_login = reverse('login')
url_logout = reverse('logout')
url_user = reverse('user')

# URLS API
# Lists
url_get_lists   = reverse( 'lists' )
url_get_list    = reverse( 'list', kwargs={"pk":1} ) # better to do it on test
url_create_list = reverse( 'create-list' )
url_update_list = reverse( 'update-list', kwargs={"pk":1} )
url_delete_list = reverse( 'delete-list', kwargs={"pk":1} ) 

# Tasks
url_get_task    = reverse( 'task', kwargs={"pk":1} ) # better to do it on test
url_create_task = reverse( 'create-task' )
url_update_task = reverse( 'update-task', kwargs={"pk":1} )
url_delete_task = reverse( 'delete-task', kwargs={"pk":1} ) 

# SubTask
url_get_subtask    = reverse( 'subtask', kwargs={"pk":1} ) # better to do it on test
url_create_subtask = reverse( 'create-subtask' )
url_update_subtask = reverse( 'update-subtask', kwargs={"pk":1} )
url_delete_subtask = reverse( 'delete-subtask', kwargs={"pk":1} ) 

# Roles
url_create_role = reverse( 'create-role', kwargs={ 'lst':1, 'user':2 } ) # create a role
url_update_role = reverse( 'update-role', kwargs={ 'lst':1, 'user':2 } )
url_delete_role = reverse( 'delete-role', kwargs={ 'lst':2, 'user':1 } )

# Assignments
url_create_assignment = reverse( 'create-assignment', kwargs={ 'task':1, 'user':2 } )
url_delete_assignment = reverse( 'delete-assignment', kwargs={ 'task':1, 'user':1 } )

# Dummy Data
list_data = {
    'title' : 'Test Task List',
    'description' : 'A description for the list.',
    'roles': [] 
}

task_data = {
    'title' :'Test Task',
    'description' : 'Task description',
    'assignments' : [],
    'from_list' : 1,
    'sub_tasks': [{'title':'new subtask', 'complete':False}, ]
}

subtask_data = {
    'title' : 'Test SubTask',
    'from_task' : 1
}

# DEAFAULT USER DATA
user_data = {
            "username": "johndoe",
            "password": "12345",
            "confirm_password": "12345",
            "email": "johndoe@gmail.com"
}


def set_up_credentials( self ):
    '''
        Quick set up of the authorization header  
    '''
    self.client.credentials( HTTP_AUTHORIZATION=f'Token {self.user_token}' )

def tear_down_credentials( self ):
    '''
        Quick tear down of the authorization header  
    '''
    self.client.credentials()

def change_credentials( self, token ):
    '''
        Quick change of the token to another user.  
    '''
    self.client.credentials( HTTP_AUTHORIZATION=f'Token {token}' )

def create_second_user( self ):
    '''
        Returns a dictionary with user information and a token value
    '''
    user_data = {
            'username': "johnduplicate",
            'password': "123456",
            'confirm_password': "123456",
            'email':'johnduplicate@gmail.com'
    }
    data = self.client.post( url_register, user_data, format='json' ).data['data']
    return data.get( 'user' ), data.get( 'token' ) 

def create_third_user( self ):
    '''
        Returns a dictionary with user information and a token value
    '''
    user_data = {
            'username': "johnduplicate3",
            'password': "123456",
            'confirm_password': "123456",
            'email':'johnduplicate3@gmail.com'
    }
    data = self.client.post( url_register, user_data, format='json' ).data['data']
    return data.get( 'user' ), data.get( 'token' ) 


