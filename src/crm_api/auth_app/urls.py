from django.urls import path
from .views import (
    GoogleLoginView,
    MeView,
    PendingUsersListView,
    AllUsersListView,
    UpdateUserView,
)

urlpatterns = [
    path('auth/google/', GoogleLoginView.as_view()),
    path('auth/me/', MeView.as_view()),
    path('auth/users/pending/', PendingUsersListView.as_view()),
    path('auth/users/all/', AllUsersListView.as_view()),
    path('auth/users/update/', UpdateUserView.as_view()),
]