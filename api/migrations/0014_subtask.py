# Generated by Django 4.0 on 2022-04-25 07:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubTask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('complete', models.BooleanField(default=False)),
                ('from_task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sub_tasks', to='api.task')),
            ],
        ),
    ]
