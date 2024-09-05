from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.db.models.signals import post_delete
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferences = models.TextField()  

    def __str__(self):
        return self.user.username

class Fight(models.Model):
    title = models.CharField(max_length=100, default='dana vs trump')
    fighter1 = models.CharField(max_length=100)
    fighter2 = models.CharField(max_length=100)
    card = models.CharField(max_length=100, default='UFC 999')
    date = models.DateField()
    details = models.TextField()

    def __str__(self):
        return f"{self.fighter1} vs {self.fighter2}"

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fight = models.ForeignKey(Fight, on_delete=models.CASCADE)
    bookmarked_on = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username} bookmarked {self.fight}"
    
@receiver(post_delete, sender=Bookmark)
def delete_likes_dislikes_on_unbookmark(sender, instance, **kwargs):
    LikeDislike.objects.filter(user=instance.user, fight=instance.fight).delete()

class LikeDislike(models.Model):
    LIKE = 1
    DISLIKE = -1

    CHOICES = (
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fight = models.ForeignKey('Fight', on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=CHOICES)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ('user', 'fight')

    def save(self, *args, **kwargs):
        if not Bookmark.objects.filter(user=self.user, fight=self.fight).exists():
            raise ValueError("Cannot like/dislike a fight that is not bookmarked.")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} {'liked' if self.value == 1 else 'disliked'} {self.fight.title}"