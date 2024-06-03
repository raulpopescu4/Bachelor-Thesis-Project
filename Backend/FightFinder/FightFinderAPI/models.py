from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    preferences = models.TextField()  

    def __str__(self):
        return self.user.username

class Fight(models.Model):
    fighter1 = models.CharField(max_length=100)
    fighter2 = models.CharField(max_length=100)
    date = models.DateField()
    details = models.TextField()

    def __str__(self):
        return f"{self.fighter1} vs {self.fighter2}"

class Recommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recommendation_text = models.TextField()
    fights = models.ManyToManyField(Fight)

    def __str__(self):
        return f"Recommendation for {self.user.username}"

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fight = models.ForeignKey(Fight, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} bookmarked {self.fight}"
