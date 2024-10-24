# Generated by Django 5.0.6 on 2024-08-19 13:39

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FightFinderAPI', '0003_bookmark_bookmarked_on_delete_recommendation'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='LikeDislike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.SmallIntegerField(choices=[(1, 'Like'), (-1, 'Dislike')])),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('fight', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FightFinderAPI.fight')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'fight')},
            },
        ),
    ]
