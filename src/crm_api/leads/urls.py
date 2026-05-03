from django.urls import path
from .views import *

urlpatterns = [
    path('leads/', LeadsListView.as_view(), name='leads-list'),
    path('leads/overdue-followups/', OverdueFollowUpsView.as_view(), name='overdue-followups'),
    path('leads/<int:pk>/', LeadsDetailView.as_view(), name='leads-details'),
]