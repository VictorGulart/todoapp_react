# Generated by Django 3.2.6 on 2021-09-03 11:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20210902_2017'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todolist',
            name='users',
        ),
        migrations.AlterUniqueTogether(
            name='userrole',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='userrole',
            name='todo_list',
        ),
        migrations.RemoveField(
            model_name='userrole',
            name='user',
        ),
        migrations.AlterUniqueTogether(
            name='usertask',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='usertask',
            name='task',
        ),
        migrations.RemoveField(
            model_name='usertask',
            name='user',
        ),
        migrations.DeleteModel(
            name='Task',
        ),
        migrations.DeleteModel(
            name='ToDoList',
        ),
        migrations.DeleteModel(
            name='UserRole',
        ),
        migrations.DeleteModel(
            name='UserTask',
        ),
    ]
