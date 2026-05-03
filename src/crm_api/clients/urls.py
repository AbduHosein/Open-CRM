from django.urls import path
from .views import *

urlpatterns = [
    path('clients/', ClientListView.as_view(), name='clients-list' ),
    path('clients/<int:pk>/', ClientDetailView.as_view(), name='clients-details' ),

]
