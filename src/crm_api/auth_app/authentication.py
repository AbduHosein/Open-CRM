from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from .models import UserProfile

class CustomJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get('Authorization')
        if not header or not header.startswith('Bearer '):
            return None

        token = header.split(' ')[1]

        try:
            validated = AccessToken(token)
            user = User.objects.get(id=validated['user_id'])
        except Exception:
            raise AuthenticationFailed('Invalid or expired token')

        try:
            profile = UserProfile.objects.get(user=user)
            if profile.status != 'APPROVED':
                raise AuthenticationFailed('Account is not approved')
        except UserProfile.DoesNotExist:
            raise AuthenticationFailed('No profile found')

        return (user, token)