# Imports from Django
from turtle import pd
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, request, JsonResponse
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, ValidationError
from django.contrib import messages

# Imports from Rest Framework
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework import status, authentication, permissions
from rest_framework.views import APIView

# Import login and register forms
from .forms import RegisterForm

# Import API Models
from .models import TaskList, Task, Role, Assignment

# Import Serializers
from .serializers import AssignmentrSrl, RoleSrl, TaskListSrl, TaskListSrlDetail, TaskSrl, SubTaskSrl

from pdb import set_trace

###################
#### API VIEWS ####
###################

@api_view(["GET"])
@permission_classes([AllowAny, ])
def APIOverview(request: request) -> Response:
    api_urls: Dict = {
        "Role": "/list-role/<str:pk>",
        # LISTS
        "Lists": "/lists/",
        "List": "/list/<str:pk>/",
        "Create list": "/create-list/",
        "Update list": "/update-list/",
        "Delete list": "/delete-list/<str:pk>",
        # TASKS
        "Task": "/task/<str:pk>",
        "Create task": "/create-task/",
        "Update task": "/update-task/<str:pk>",
        "Delete task": "/delete-task/<str:pk>",
        # OTHER
        "Create role": "/create-role/<str:lst>/<str:user>",
        "Update role": "/update-role/<str:lst>/<str:user>",
        "Delete role": "/delete-role/<str:lst>/<str:user>",
        "Create assignment": "/create-assignment/<str:task>/<str:user>",
        "Update assignment": "/update-assignment/<str:task>/<str:user>",
        "Delete assignment": "/delete-assignment/<str:task>/<str:user>"
    }
    return Response(api_urls)


#####################
#### Assignments ####
#####################

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createAssignment( request: request, task: str, user: str ) -> Response:
    
    '''
       Creates an assignment 
    '''
    data = {
        'user'      : user,
        'task'      : task,
        'from_list' : request.data['from_list']
    }

    try:
        task = Task.objects.get( pk=task )
        user = User.objects.get( pk=user )
        role = Role.objects.get( task_list=task.from_list, user=user )

        if not role:
            raise Role.DoesNotExist 
        if not user:
            raise User.DoesNotExist
        if not task:
            raise Task.DoesNotExist

        serializer = AssignmentrSrl(data=data)
        if serializer.is_valid():
            serializer.save()

    except User.DoesNotExist:
        return Response(
                {
                    'status': 'error',
                    'message': 'User not found.'
                },
                status = status.HTTP_404_NOT_FOUND
        )
    except Task.DoesNotExist:
        return Response(
                {
                    'status': 'error',
                    'message': 'Task not found.'
                },
                status = status.HTTP_404_NOT_FOUND
        )
    except Role.DoesNotExist:
        return Response(
                {
                    'status': 'error',
                    'message': f'{request.user.username} does not have permission. '
                },
                status = status.HTTP_401_UNAUTHORIZED
        )
    except PermissionDenied:
        return Response(
                {
                    'status': 'error',
                    'message': f'{request.user.username} does not have permission. '
                },
                status = status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        return Response(
            {
                'status':'error',
                'message': str(e)
            }, 
            status = status.HTTP_400_BAD_REQUEST
        )

    return Response(
        {
            'status': 'success', 
            'data': {
                'assignment' : serializer.data,
            },
            'message': 'Assignment created successfully.'
        },
        status = status.HTTP_201_CREATED
    )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, ])
def deleteAssignment(request: request, task: str, user: str) -> Response:
    '''
        Deleting assignment from a user
    '''
    try:
        task = Task.objects.get(id=task)

        # Check if the user has the role to delete 
        role = task.from_list.roles.get( user = request.user )

        if role.role > 2:
            raise PermissionDenied

        assign = task.assignments.get(user=user)
        assign.delete()

        return Response(
                {
                    'status': "success",
                    'message':'Assignment has been removed from the user.'
                }
        )
    except Assignment.DoesNotExist:
        return Response(
                {
                    'status': 'error',
                    'message': 'Assignment requested does not exist. '
                },
                status = status.HTTP_404_NOT_FOUND
        )
    except Task.DoesNotExist:
        return Response(
                {
                    'status': 'error',
                    'message': 'Task requested does not exist. '
                },
                status = status.HTTP_404_NOT_FOUND
        )
    except Role.DoesNotExist:
        return Response(
                {
                    'status': 'error',
                    'message': f'{request.user.username} does not have permission. '
                },
                status = status.HTTP_401_UNAUTHORIZED
        )
    except PermissionDenied:
        return Response(
                {
                    'status': 'error',
                    'message': f'{request.user.username} does not have permission. '
                },
                status = status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        raise e

#############################
#### Classed Based Views ####
#############################

# Different url links for class based views 
# aren't necessary, all it's needed are the 
# different arguments and obviously the 
# different HTTP methods. The class will 
# direct it to the correct method.

class TaskLists(APIView):
    authentication_classes = [TokenAuthentication]
    
    def get(self, request, format=None):
        ''' 
        Returns a list of the TaskLists of the logged user. 
        '''
        try:
            user = User.objects.get(id=request.user.id)
            lists = user.tasklists.all()
            serializer = TaskListSrl(lists, many=True, context={"request": request})
            return Response(
                {
                    'status':'success',
                    'data': {
                        'lists': serializer.data
                    }
                },
                status = status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    'status': 'error', 
                    'message': str(e),
                }
            )

class TaskListView(APIView):
    def get(self, request, pk, format=None):
        """ 
            Shows only if the user has access to it.
            Shows a list in more detail. Also includes users and roles. 
        """

        try:
            user = User.objects.get( id=request.user.id )
            # lst = TaskList.objects.get( id=pk )

            lst = user.tasklists.all()
            lst = lst.get(id=pk)

            if lst:
                serializer = TaskListSrlDetail(lst, context={'request':request})
                return Response(
                    {
                        'status':'success',
                        'data': {
                            'list' : serializer.data
                        },
                        'message': '',
                    },
                    status = status.HTTP_200_OK
                )
            else: # not the correct user
                return Response(
                    {
                        'status':'error',
                        'message': 'Task list not found.' # maybe should change to permission error
                    },
                    status = status.HTTP_404_NOT_FOUND
                )
        except TaskList.DoesNotExist:
            return Response(
                    {
                        'status':'error',
                        'message': 'Task list not found.' # maybe should change to permission error
                    },
                    status = status.HTTP_404_NOT_FOUND
                )
    
    def post(self, request, format=None):
        ''' 
            Creates a new TaskList
        '''
        serializer = TaskListSrl( data=request.data, context={"request": request} )

        if not serializer.is_valid():
            return Response(
                    {
                        'status':'fail',
                        'data': { 
                            'errors': serializer.errors
                        },
                        'warning_messages': serializer.warning_messages,
                        'message': 'Theres an error with the data.'
                    },
                    status = status.HTTP_400_BAD_REQUEST
            )

        serializer.save()
        return Response(
                {
                    'status':'success',
                    'data': {
                        'list':serializer.data,
                    },
                    'warning_messages': serializer.warning_messages,
                    'message': 'List created successfully.'
                },
                status = status.HTTP_201_CREATED
        )

    def patch(self, request, pk, format=None):
        """ 
            Make changes to the a list.
        """

        try:
            task_list = TaskList.objects.get(id=pk)
            serializer = TaskListSrl( instance=task_list, data=request.data, context={"request": request})

            if serializer.is_valid():
                serializer.save()
            else:
                return Response(
                    {
                        'status':'fail',
                        'data': { 
                            'errors': serializer.errors
                        },
                        'warning_messages': serializer.warning_messages,
                        'message': 'Theres an error with the data.'
                    },
                    status = status.HTTP_400_BAD_REQUEST
                )    
        except TaskList.DoesNotExist:
            return Response(
                    {
                        'status':'error',
                        'message': 'Task list not found.' # maybe should change to permission error
                    },
                    status = status.HTTP_404_NOT_FOUND
                )
        return Response(
                    {
                        'status':'success',
                        'data':{
                            'list': serializer.data
                        },
                        'message': 'Task list updated.' # maybe should change to permission error
                    },
                    status = status.HTTP_200_OK
                )

    def delete(self, request, pk, format=None):
        '''
            Deletes a TaskList.
            All the tasks will also be delete.
        '''
    
        try:

            task_list = TaskList.objects.get(id=pk)
            # Check the user has a higher role to delete the task

            if task_list.roles.get(user=request.user.id).role > 2:
                return Response(data=
                    {
                        'status': 'error',
                        'message': f'{request.user.username} needs a lower level authorization.',
                    }, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            task_list.delete()
            return Response(
                    {
                        'status': 'success',
                        'data': None,
                        'message': 'The list has been deleted.'
                    }
            )

        except TaskList.DoesNotExist:
            return Response(data=
                    {
                        'status': 'error',
                        'message': 'List does not exist.',
                    }, 
                    status=status.HTTP_404_NOT_FOUND)
        except Role.DoesNotExist:
            # user is not assigned/linked to the list
            return Response(data=
                    {
                        'status': 'error',
                        'message': f'{request.user.username} does not have the authorization.',
                    }, 
                    status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
           raise e

class TaskView(APIView):
    '''
        CRUD operations on taks
    '''

    def get(self, request, pk, format=None):
        ''' 
            Returns a task in more detail
        '''
        try:
            user = User.objects.get(id=request.user.id)
            task = Task.objects.get(id=pk)
            if user in task.users.all():
                serializer = TaskSrl(task, context={ 'request': request, 'tasklist_id':pk })
                return Response(
                        {
                            'status':'success',
                            'data': { 
                                'task': serializer.data
                            },
                            'warning_messages': serializer.warning_messages,
                            'message': ''
                        },
                        status = status.HTTP_200_OK
                )
            else:
                raise User.DoesNotExist

        except User.DoesNotExist:
            return Response(
                    {
                        'status':'error',
                        'data': None,
                        'message': 'User not found.'
                    },
                    status = status.HTTP_404_NOT_FOUND
            )
        except Task.DoesNotExist:
            return Response(
                    {
                        'status':'error',
                        'data': None,
                        'message': 'Task not found.'
                    },
                    status = status.HTTP_404_NOT_FOUND
            )
        except Role.DoesNotExist:
            return Response(
                    {
                        'status':'error',
                        'warning_messages': serializer.warning_messages,
                        'message': 'User does not have authorization.'
                    },
                    status = status.HTTP_403_FORBIDDEN
            )
        except PermissionDenied:
            return Response(
                    {
                        'status':'error',
                        'message': 'User does not have authorization.'
                    },
                    status = status.HTTP_403_FORBIDDEN
            )
        except Exception as e:
            return Response(
                    {
                        'status':'error',
                        'message': str(e)
                    },
                    status = status.HTTP_400_BAD_REQUEST
            )

    def post(self, request, format=None):
        ''' 
            Creates a new task.
            By default assigns a role of owner to the user.
        '''

        try: 
            serializer = TaskSrl(data=request.data, context={"request": request})

            if serializer.is_valid():
                serializer.save()
            else:
                return Response(
                    {
                        'status':'fail',
                        'data': { 
                            'errors': serializer.errors
                        },
                        'warning_messages': serializer.warning_messages,
                        'message': 'Theres an error with the data.'
                    },
                    status = status.HTTP_400_BAD_REQUEST
                )

            return Response(
                    {
                        'status':'success',
                        'data': { 
                            'task': serializer.data
                        },
                        'warning_messages': serializer.warning_messages,
                        'message': 'The task was created successfully.'
                    },
                    status = status.HTTP_201_CREATED
            )
        except Task.DoesNotExist:
            return Response(
                    {
                        'status':'error',
                        'data': None,
                        'warning_messages': serializer.warning_messages,
                        'message': 'Task not found.'
                    },
                    status = status.HTTP_404_NOT_FOUND
            )

        except Role.DoesNotExist:
            return Response(
                    {
                        'status':'error',
                        'warning_messages': serializer.warning_messages,
                        'message': 'User does not have authorization.'
                    },
                    status = status.HTTP_403_FORBIDDEN
            )
        except PermissionDenied:
            return Response(
                    {
                        'status':'error',
                        'warning_messages': serializer.warning_messages,
                        'message': 'User does not have authorization.'
                    },
                    status = status.HTTP_403_FORBIDDEN
            )
    
    def patch(self, request, pk, format=None):
        '''
        Make changes to a specific task.
        '''
        try: 
            task = Task.objects.get(id=pk)

            serializer = TaskSrl(instance=task, data=request.data,
                                 context={"request": request})

            if serializer.is_valid():

                serializer.save()
                return Response(
                        {
                            'status':'success',
                            'data': { 
                                'task': serializer.data
                            },
                            'warning_messages': serializer.warning_messages,
                            'message': 'The task was updated successfully.'
                        },
                        status = status.HTTP_201_CREATED
                )
            else:
                raise ValidationError("Something is wrong")
        except PermissionDenied:
            return Response(
                    {
                        'status':'error',
                        'message': 'Task was not found.'
                    },
                    status = status.HTTP_401_UNAUTHORIZED
                )
        except Task.DoesNotExist:
            return Response(
                    {
                        'status':'error',
                        'message': 'Task was not found.'
                    },
                    status = status.HTTP_404_NOT_FOUND
                )
        except ValidationError:
            return Response(
                    {
                        'status':'fail',
                        'data': { 
                            'errors': serializer.errors
                        },
                        'warning_messages': serializer.warning_messages,
                        'message': 'Theres an error with the data.'
                    },
                    status = status.HTTP_400_BAD_REQUEST
                )

    def delete(self, request, pk, format=None):
        ''' 
            Deletes a task
        '''
        try:

            task = Task.objects.get(id=pk)

            lst = TaskList.objects.get( pk=task.from_list.id ) 

            role = lst.roles.get( user=request.user.id )

            if role.role > 2:
                raise PermissionDenied

            task.delete()
            return Response(
                    {
                        'status': 'success',
                        'data': None,
                        'message' : 'Task was deleted successfully.'
                    } 
            )

        except Task.DoesNotExist:
            return Response(
                {
                        'status': 'error',
                        'message': 'Task does not exist.',
                }, 
                status=status.HTTP_404_NOT_FOUND
            )

        except Role.DoesNotExist:
            return Response(data=
                    {
                        'status': 'error',
                        'message': f'{request.user.username} does not have the authorization.',
                    }, 
                    status=status.HTTP_401_UNAUTHORIZED)
    
        except PermissionDenied:
            return Response(
                    {
                            'status': 'error',
                            'message': f'{request.user} needs a lower level authorization.' ,
                    }, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

        except Exception as e:
            raise e

class SubTaskView(APIView):
    def get(self, request, pk, format=None):
        ...

    def post(self, request, format=None):
        '''
            Creating a simple subtask.
            The task ID is the 'from_task' attribute
        '''
        try:

            
            if request.user == None:
                raise User.DoesNotExist 

            task = Task.objects.get(pk=request.data.get('from_task', None))


            if task is None:
                raise Task.DoesNotExist
            
            # Create the subtask serializer
            serializer = SubTaskSrl(data=request.data)


            if serializer.is_valid():
                serializer.save()
            else:
                return Response(
                    {
                        'status':'fail',
                        'data': { 
                            'errors': serializer.errors
                        },
                        'warning_messages': serializer.warning_messages,
                        'message': 'Theres an error with the data.'
                    },
                    status = status.HTTP_400_BAD_REQUEST
                )
            

            return Response(
                    {
                        'status':'success',
                        'data': { 
                            'subtask': serializer.data
                        },
                        'warning_messages': serializer.warning_messages,
                        'message': 'The subtask was created successfully.'
                    },
                    status = status.HTTP_201_CREATED
            )

        except User.DoesNotExist:
           return Response(
                    {
                        'status':'error',
                        'data': None,
                        'message': 'User not found.'
                    },
                    status = status.HTTP_404_NOT_FOUND
            )
        except Task.DoesNotExist:
           return Response(
                    {
                        'status':'error',
                        'data': None,
                        'message': 'Task not found.'
                    },
                    status = status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'status' : 'error',
                    'message' : str(e)
                },
                status = status.HTTP_400_BAD_REQUEST
            )

    def patch(self, request, pk, format=None):
        ...

    def delete(self, request, pk, format=None):
        ...

class RolesView(APIView):
    
    def get(self, request, format=None):
        ...
    
    def post(self, request, lst, user, format=None):
        '''
            Creates a specific role
        '''

        try: 
            user = User.objects.get( pk=user )
            task_list = TaskList.objects.get( pk=lst )

            if request.data.get('role', None):
                role = request.data['role']
            else:
                return Response(
                {
                    'status' : 'error',
                    'message' : 'Role missing.'
                },
                status = status.HTTP_400_BAD_REQUEST
            )

            if Role.ROLE_CHOICES_DICT.get(role, None):
                role = Role.ROLE_CHOICES_DICT[role]
            else:
                raise Role.DoesNotExist

            Role.objects.create( user = user, task_list = task_list, role=role )



        except User.DoesNotExist:
            return Response(
                {
                    'status' : 'error',
                    'message' : 'User not Found'
                },
                status = status.HTTP_404_NOT_FOUND
            )
        except TaskList.DoesNotExist:
            return Response(
                {
                    'status' : 'error',
                    'message' : 'TaskList not Found'
                },
                status = status.HTTP_404_NOT_FOUND
            )
        except Role.DoesNotExist:
            return Response(
                {
                    'status' : 'error',
                    'message' : 'Role not Found'
                },
                status = status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'status' : 'error',
                    'message' : str(e)
                },
                status = status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                'status': 'success', 
                'message': 'Role created successfully.'
            },
            status = status.HTTP_201_CREATED
        )
    
    def patch(self, request, lst, user, format=None):
        '''
            Changes the role of the user
            Pass a new role, if there is no existing role return error
        '''

        try:
            if not Role.objects.get( user=user, task_list=lst ):
                raise Role.DoesNotExist

            user = User.objects.get( pk=user )
            task_list = TaskList.objects.get( pk=lst )
 
            if request.data.get('role', None):
                role = request.data['role']
            else:
                return Response(
                {
                    'status' : 'error',
                    'message' : 'Role missing.'
                },
                status = status.HTTP_400_BAD_REQUEST
            )

            if Role.ROLE_CHOICES_DICT.get(role, None):
                role = Role.ROLE_CHOICES_DICT[role]
            else:
                raise Role.DoesNotExist

            instance = Role.objects.get( user = user, task_list = task_list )
            setattr( instance, 'role', role )
            instance.save()

        except User.DoesNotExist:
            return Response(
                {
                    'status' : 'error',
                    'message' : 'User not Found'
                },
                status = status.HTTP_404_NOT_FOUND
            )
        except TaskList.DoesNotExist:
            return Response(
                {
                    'status' : 'error',
                    'message' : 'TaskList not Found'
                },
                status = status.HTTP_404_NOT_FOUND
            )
        except Role.DoesNotExist:
            return Response(
                {
                    'status' : 'error',
                    'message' : 'Role not Found'
                },
                status = status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {
                    'status' : 'error',
                    'message' : str(e)
                },
                status = status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {
                'status':'success',
                'message': 'Role was updated successfully.'
            },
            status = status.HTTP_200_OK
        )
    
    def delete(self, request, lst, user, format=None):
        ''' 
            Removes the connection of the 
            This should also remove the user connections to the tasks of the list.
        '''
        try:
            user = User.objects.get(id=user)
            lst = TaskList.objects.get(id=lst)
            role = user.roles.get(task_list=lst.id)

            role.delete()
            for assign in lst.tasks.all().filter(assignments=user.id):
                if assign.user == user and assign.task.from_list == lst:
                    assign.delete()

            return Response(
                            {
                                'status': "success",
                                'message':'Role and Tasks for the user were deleted.'
                            },
                            status = status.HTTP_200_OK
                    )
        except User.DoesNotExist:
            return Response(
                    {
                        'status': 'error',
                        'message': f'User does not have permission. '
                    },
                    status = status.HTTP_401_UNAUTHORIZED
            )
        except TaskList.DoesNotExist:
            return Response(
                    {
                        'status': 'error',
                        'message': f'TaskList does not exist. '
                    },
                    status = status.HTTP_404_NOT_FOUND
            )
        except Role.DoesNotExist:
            return Response(
                    {
                        'status': 'error',
                        'message': f'{request.user.username} is not associated with the list. '
                    },
                    status = status.HTTP_404_NOT_FOUND
            )
        except Assignment.DoesNotExist:
            return Response(
                    {
                        'status': 'error',
                        'message': f'{request.user.username} does not have permission. '
                    },
                    status = status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            raise e