from rest_framework import serializers
from .models import Client
import notes.models as Note


class ClientSerializer(serializers.ModelSerializer):
    latest_note = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = '__all__'

    def get_latest_note(self, obj):
        note = obj.notes.first()
        return note.content if note else ''
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add lead details if available
        if instance.lead:
            representation['lead_name'] = instance.lead.name
            representation['lead_company'] = instance.lead.company
            representation['lead_email'] = instance.lead.email
            representation['lead_phone'] = instance.lead.phone
            representation['lead_source'] = instance.lead.source
        else:
            representation['lead_name'] = None
            representation['lead_company'] = None
            representation['lead_email'] = None
            representation['lead_phone'] = None
            representation['lead_source'] = None
        return representation
