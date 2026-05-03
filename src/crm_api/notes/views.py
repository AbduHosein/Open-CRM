from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Note
from .serializers import NoteSerializer

class NoteListView(ListCreateAPIView):
    serializer_class = NoteSerializer

    def get_queryset(self):
        qs = Note.objects.all()
        for param in ('lead', 'client', 'project'):
            val = self.request.query_params.get(param)
            if val:
                qs = qs.filter(**{param: val})
        return qs

class NoteDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer