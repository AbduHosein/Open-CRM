from rest_framework import serializers
from .models import Project
import notes.models as Note

class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.lead.name', read_only=True)
    company = serializers.CharField(source='client.lead.company', read_only=True)
    latest_note = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        
    def get_latest_note(self, obj):
        note = obj.notes.first()  # ordered by -created_at
        return note.content if note else ''