from django.urls import path
from .views import *

urlpatterns = [
    path('projects/', ProjectListView.as_view(), name='projects-list' ),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='projects-details' ),

]
