from django.contrib import admin
from . import models

# Register your models here.


class RoleTabAdmin(admin.TabularInline):
    model = models.Role


class TaskListAdmin(admin.ModelAdmin):
    inlines = (RoleTabAdmin, )
    list_display = ("id", "title",)


admin.site.register(models.TaskList, TaskListAdmin)


class AssignmentTabAdmin(admin.TabularInline):
    model = models.Assignment


class TaskAdmin(admin.ModelAdmin):
    inlines = (AssignmentTabAdmin, )
    list_display = ("id", "title", "from_list", "from_list_id")


admin.site.register(models.Task, TaskAdmin)


class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "task_list", "task_list_id", "role")


admin.site.register(models.Role, RoleAdmin)


class AssignmentAdmin(admin.ModelAdmin):
    list_display = ("user", "task", "task_id")


admin.site.register(models.Assignment, AssignmentAdmin)
