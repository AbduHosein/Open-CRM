from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.conf import settings
from .models import UserProfile


class GoogleLoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        credential = request.data.get('credential')
        if not credential:
            return Response({'error': 'No credential provided'}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                credential, google_requests.Request(), settings.GOOGLE_CLIENT_ID
            )
        except ValueError as e:
            return Response({'error': 'Invalid token'}, status=401)

        email = idinfo.get('email')

        try:
            total_users = User.objects.all().count()
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=idinfo.get('given_name', ''),
                last_name=idinfo.get('family_name', ''),
            )
            user_status = 'APPROVED' if total_users == 0 else 'PENDING'
            UserProfile.objects.create(
                user=user, picture=idinfo.get('picture', ''), status=user_status
            )
            return Response({'status': 'pending'}, status=202)
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.status == 'PENDING':
                return Response({'status': 'pending'}, status=202)
            if profile.status == 'REJECTED':
                return Response({'status': 'rejected'}, status=403)
        except UserProfile.DoesNotExist:
            UserProfile.objects.create(user=user, status='APPROVED')

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'email': user.email,
                'name': idinfo.get('name'),
                'picture': idinfo.get('picture'),
                'is_staff': user.is_staff,
            },
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = UserProfile.objects.get(user=user)
        return Response({
            'email': user.email,
            'name': user.get_full_name(),
            'picture': profile.picture,
            'is_staff': user.is_staff,
        })


class PendingUsersListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        pending_users = UserProfile.objects.filter(status='PENDING')
        data = [
            {
                'id': profile.id,
                'email': profile.user.email,
                'name': profile.user.get_full_name(),
                'requested_at': profile.requested_at,
                'picture': profile.picture,
            }
            for profile in pending_users
        ]
        return Response(data)


class AllUsersListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = UserProfile.objects.all()
        data = [
            {
                'id': profile.id,
                'email': profile.user.email,
                'name': profile.user.get_full_name(),
                'status': profile.status,
                'requested_at': profile.requested_at,
                'picture': profile.picture,
                'is_staff': profile.user.is_staff,
            }
            for profile in users
        ]
        return Response(data)


class UpdateUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        email = request.data.get('email')
        action = request.data.get('action')

        try:
            profile = UserProfile.objects.get(user__email=email)
            user = profile.user
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        if user == request.user and action in ['delete', 'demote', 'revoke']:
            return Response({'error': 'You cannot perform this action on your own account'}, status=400)

        if action == 'approve':
            profile.status = 'APPROVED'
            profile.save()
        elif action == 'reject':
            profile.status = 'REJECTED'
            profile.save()
        elif action == 'revoke':
            profile.status = 'REVOKED'
            profile.save()
        elif action == 'promote':
            user.is_staff = True
            user.save()
        elif action == 'demote':
            user.is_staff = False
            user.save()
        elif action == 'delete':
            user.delete()
        else:
            return Response({'error': 'Invalid action'}, status=400)

        return Response({'message': 'User updated successfully'})