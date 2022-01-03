from django.shortcuts import render

'''
    1) How to add authentication verification to the method and
    redirect whether the user is authenticated or not ??
    2) 

'''




# Create your views here.
def index( request ):
    return render( request, 'frontend/index.html' )

def login( request ):
    return render( request, 'frontend/index.html' )

def register( request ):
    return render( request, 'frontend/index.html' )

def listView( request, pk):
    return render( request, 'frontend/index.html' )

def taskView( request, task_pk):
    return render( request, 'frontend/index.html' )


