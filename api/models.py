from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Role(models.Model):
    # User ability to create or edit depends on the role
    task_list = models.ForeignKey("TaskList", related_name="roles", on_delete=models.CASCADE)
    user = models.ForeignKey("auth.user", related_name="roles", on_delete=models.CASCADE)

    OWNER = 1
    EDITOR = 2
    WORKER = 3
    VIEWER = 4

    ROLE_CHOICES_DICT ={ 
        'OWNER'  : 1,
        'EDITOR' : 2,
        'WORKER' : 3,
        'VIEWER' : 4 
    }

    ROLE_CHOICES = (
        (OWNER,  "Owner"),
        (EDITOR, "Editor"),
        (WORKER, "Worker"),
        (VIEWER, "Viewer")
    )

    # default - gives the smallest access possible
    role = models.PositiveIntegerField(choices=ROLE_CHOICES, default=OWNER)

    class Meta:
        unique_together = [["task_list", "user"]]


class Assignment(models.Model):
    # From the relation between User and Task
    user = models.ForeignKey("auth.user", related_name="assignments", on_delete=models.CASCADE)
    task = models.ForeignKey("Task", related_name="assignments", on_delete=models.CASCADE)

    class Meta:
        unique_together = [["user", "task"]]


class TaskList(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(blank=True, null=True)
    complete = models.BooleanField(default=False)
    users = models.ManyToManyField(
        "auth.user", through=Role, related_name="tasklists", through_fields=(["task_list", "user"]))

    def __str__(self):
        return self.title

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(blank=True, null=True)
    complete = models.BooleanField(default=False)
    visible = models.BooleanField(default=True)  # only completed can be hidden
    from_list = models.ForeignKey(
        TaskList, related_name="tasks", on_delete=models.CASCADE)
    users = models.ManyToManyField("auth.user", related_name="tasks", through=Assignment)
    

    def __str__(self):
        return self.title

class SubTask(models.Model):
    title = models.CharField(max_length=200)
    complete = models.BooleanField(default=False)
    from_task = models.ForeignKey(
        Task, related_name="sub_tasks", on_delete=models.CASCADE 
    )

