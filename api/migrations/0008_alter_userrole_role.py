# Generated by Django 3.2.4 on 2021-09-01 17:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userrole',
            name='role',
            field=models.PositiveIntegerField(choices=[(1, 'Owner'), (2, 'Editor'), (3, 'Worker'), (4, 'Viewer')], default=1),
        ),
    ]
