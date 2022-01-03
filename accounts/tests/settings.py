
from django.urls import reverse

# URLS
url_register = reverse('register')
url_login = reverse('login')
url_logout = reverse('logout')
url_user = reverse('user')

# USER
user_data = {
            "username": "johndoe",
            "password": "12345",
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
