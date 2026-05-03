from rest_framework import serializers
from .models import Lead
from notes.models import Note


class LeadSerializer(serializers.ModelSerializer):
    latest_note = serializers.SerializerMethodField()
    
    class Meta:
        model = Lead
        fields = '__all__'
    
    def get_latest_note(self, obj):
        note = obj.notes.first()  # ordered by -created_at
        return note.content if note else ''