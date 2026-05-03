from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    status = models.CharField(choices=[
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('REVOKED', 'Revoked'),
    ], default='PENDING', max_length=10)
    picture = models.URLField(blank=True)
    requested_at = models.DateTimeField(auto_now_add=True)