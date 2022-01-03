# Django
from django.core.exceptions import PermissionDenied
from django.db.models import fields
from django.db.models.query import QuerySet
from django.contrib.auth.models import User
from django.utils.timezone import now

# DRF
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response

# From app
from .models import TaskList, Task, Role, Assignment

# Debugging
from pdb import set_trace

class AssignmentrSrl(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ('user', 'task')
    
    def create(self, validated_data):
        '''
            Check if the task is related to the list
            Check if the user as a role
            Returns an newly crated Assignment instance
        '''

        try:


            # List validation
            if self.initial_data.get( 'from_list', None):
                lst = self.initial_data['from_list']
            else: 
                raise serializers.ValidationError( 'Missing list id.' )
            
            lst = TaskList.objects.get( pk = lst )
            task = validated_data['task']

            if task.from_list != lst:
                raise serializers.ValidationError( 'List and Task are not related.' )

            # Role Validation
            # create role or not ?
            if len( lst.roles.filter( user=validated_data['user'] ) ) == 0:
                raise serializers.ValidationError( 'The user is not related to the list.' )

            assignment = Assignment.objects.create( **validated_data )

            return assignment

        except Exception as e:
            raise e

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
    
class TaskSrl(serializers.ModelSerializer):
    assignments = serializers.ListSerializer(
        child = serializers.ModelField(model_field=Assignment()._meta.get_field('user')),
        allow_empty=True
    )

    def __init__(self, *args, **kwargs):
        super().__init__( *args, **kwargs )
        self.warning_messages = []

    class Meta:
        model = Task
        fields = ("id", "assignments", "title", "description", "start_date",
                  "end_date", "complete", "from_list")
    
    def to_representation(self, instance):
        return super().to_representation(instance)
    
    def validate_assignments( self, data ):
        '''
            Validates the list o users passed.
            Should be a list of valid users otherwise returns error.
        '''
        for user_id in data:
            if not User.objects.get( pk=user_id ):
                raise serializers.ValidationError(f'Error validating user accounts.')

        return data
    
    def validate(self, attrs):
        data = super().validate(attrs)
        return data

    def create(self, validated_data):
        ''' 
            Creates a Task.
            The user must have a role of Owner or editor to create a new task.
            If other users do not have a role the assignment of the task will fail
            for them.
        '''

        user = None
        request = self.context.get('request')
        assignments = None

        try: 
            # get the main user
            if hasattr(request, "user"):
                user = request.user

            # get the assignments if there is any
            assignments = validated_data.pop("assignments")

            # get the list, why? to check if the user has permission
            list = validated_data.get("from_list")
            role = list.roles.get(user=user.id)
            
            if role is None or role.role > 2:
                raise PermissionDenied("You don't have permission.")


            # create the task on list obj
            task = Task.objects.create(**validated_data)
            task.save()

            # assign the task by default to the user from request
            task.assignments.create(user=user)

            # if there are assignments, make them
            if assignments != None:
                for new_user in assignments:
                    task.assignments.create(user=new_user)

            return task
        except Exception as e:
            raise(e)

    def update(self, instance, validated_data):
        '''
            Updates a task instance
        '''

        # check if the user
        user = None
        assignments = None
        req = self.context.get('request')

        if hasattr(req, 'user'):
            user = req.user
            
        # check for user role

        role = Role.objects.get(task_list=instance.from_list, user=user)
        if role.role >= 2 :
            raise PermissionDenied('User does not have authorization.')
        
        # remove assignments from validated data
        assignments = validated_data.pop('assignments')

        # add changes to the instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save() # save the changes

        # updated assignments
        # check if the assignments already exist first
        # later create assignments for those that do not exist

        return instance

class RoleSrl(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["user", "role"]
        depht = 1

class CreateRoleSrl(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', "user", "role")

class UserSrl(serializers.ModelSerializer):
    ''' I might need to customize to get the roles in here '''
    # roles = serializers.PrimaryKeyRelatedField(source="role_set", many=True, queryset=Role.objects.all())
    username = serializers.CharField(read_only=True)
    role = serializers.SerializerMethodField( method_name='get_roles' )

    class Meta:
        model = User
        fields = ('id', 'username', "email", 'role')
    
    def get_roles( self, obj ):
        request = self.context.get('request')
        tasklist_id = self.context.get('tasklist_id') 
        try:
            tasklist = TaskList.objects.get( id=tasklist_id )
            role = tasklist.roles.get( user=request.user )
        except Exception as e:
            raise e
            
        return role

class TaskListSrlDetail(serializers.ModelSerializer):
    # users = serializers.SerializerMethodField(read_only=True, method_name='get_users')
    roles = RoleSrl(many=True)
    tasks = TaskSrl(many=True)

    class Meta:
        model = TaskList
        fields = "__all__"
        
class TaskListSrl(serializers.ModelSerializer):

    roles = CreateRoleSrl(many=True, write_only=True) # do i need the roles here, maybe not
    tasks = serializers.SerializerMethodField(method_name="get_tasks")

    def __init__( self, *args, **kwargs ):
        super().__init__(*args, **kwargs)

        self.warning_messages = []

    class Meta:
        model = TaskList
        exclude = ('users',)
    
    def validate_roles( self, roles ):
        for role in roles:
            if not ( role.get( 'user', None ) and role.get( 'role', None ) ):
                raise serializers.ValidationError('User or role is missing.', code=status.HTTP_400_BAD_REQUEST)
        return roles 

    def create( self, validated_data ):
        
        try:
            # Get Request
            user = None
            request = self.context.get( 'request' )
            if hasattr( request, "user" ):
                user = request.user

            roles = validated_data.pop( "roles" )
            tasklist = TaskList.objects.create( **validated_data )

            # Create role for the current user by default as a owner
            if user is not None:
                tasklist.roles.create( user = user, role=1 )
            else:
                raise User.NotFound( "The user does not exist." )

            # Create other roles
            for role in roles:
                tasklist.roles.create(task_list=tasklist, **role)

        except Exception as e:
            raise e

        return tasklist

    def update(self, instance, validated_data):
        ''' 
            Updates the title, description, complete, or/and roles.
            Missing role checking, only owners and editors can change.
        '''
        try:
            roles = validated_data.pop('roles')
            user = None
            request = self.context.get( 'request' )

            if hasattr( request, 'user' ):
                user = request.user

            if user.roles.get( task_list=instance ).role >2:
                raise serializers.ValidationError( "User does not have authentication." )

            for attr, value in validated_data.items():
                setattr(instance, attr, value)

            instance.save()
        except Exception as e:
            raise e

        try:
            # M2M
            # get all the roles in the task list
            for role in roles:
                role_instance, created = instance.roles.get_or_create(user=role.get("user"))
                if created:
                    setattr(role_instance, "role", role.get("role"))
                    role_instance.save()

        except Role.DoesNotExist:
            raise (Role.DoesNotExist)

        return instance

    def get_tasks( self, obj ):
    
        try:
            request = self.context.get("request")
            user = None

            if hasattr( request, "user" ):
                user = request.user
            
            tasks = Task.objects.filter( from_list = obj.id )
            tasks = tasks.filter( users=user.id)

            return TaskSrl(tasks, many=True).data
        except Exception as e:
            raise e        

