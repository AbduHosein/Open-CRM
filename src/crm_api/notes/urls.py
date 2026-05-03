from django.urls import path
from .views import NoteListView, NoteDetailView

urlpatterns = [
    path('notes/', NoteListView.as_view(), name='notes-list'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='notes-detail'),
]