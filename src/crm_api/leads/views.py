# DRF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# Application 
from .models import Lead
from .serializers import LeadSerializer
# DRF_YASG
from drf_yasg.utils import swagger_auto_schema
from .api_schemas import *
# For overdue follow-ups
from django.utils import timezone
from clients.models import Client


# Lead Crud Views
class LeadsListView(APIView):
    @swagger_auto_schema(
        request_body=lead_request_schema,
        responses={
            202: 'Lead created successfully',
            400: 'Bad request',
        },
        operation_id="create_lead", 
        operation_description="Creates a new lead"
    )
    def post(self, request):
        serializer = LeadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # Create the lead
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @swagger_auto_schema(
        request_body=None,
        responses={
            200: 'OK',
            400: 'Bad request',
        },
        operation_id="get_leads_list", 
        operation_description="Retrieves all leads in the database"
    )
    def get(self, request):
        leads = Lead.objects.all()
        serializer = LeadSerializer(leads, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LeadsDetailView(APIView):
    @swagger_auto_schema(
        request_body=None,
        responses={
            200: 'OK',
            404: 'Not Found',
        },
        operation_id="get_lead", 
        operation_description="Retrieves a lead"
    )
    def get(self, request, pk):
        try:
            lead = Lead.objects.get(pk=pk)
            serializer = LeadSerializer(lead)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Lead.DoesNotExist as e:
            return Response({"error": "Lead does not exist!"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        request_body=lead_request_schema,
        responses={
            200: 'Lead updated successfully',
            400: 'Bad request',
            404: 'Not Found',
        },
        operation_id="patch_lead", 
        operation_description="Updates a lead"
    )
    def patch(self, request, pk):
        try:
            lead = Lead.objects.get(pk=pk)
            serializer = LeadSerializer(lead, data=request.data, partial=True)            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # Update the lead
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Lead.DoesNotExist as e:
            return Response({"error": "Lead does not exist!"}, status=status.HTTP_404_NOT_FOUND)
    
    @swagger_auto_schema(
        responses={
            200: 'Lead deleted successfully',
            404: 'Not Found',
        },
        operation_id="delete_lead", 
        operation_description="Delete a lead"
    )
    def delete(self, request, pk):
        try:
            lead = Lead.objects.get(pk=pk)
            lead.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Lead.DoesNotExist as e:
            return Response({"error": "Lead does not exist!"}, status=status.HTTP_404_NOT_FOUND)

class OverdueFollowUpsView(APIView):
    @swagger_auto_schema(
        request_body=None,
        responses={200: 'OK'},
        operation_id="get_overdue_followups",
        operation_description="Returns leads and clients where next_follow_up is past and record is still active, sorted most overdue first."
    )
    def get(self, request):
        DEAD_LEAD_STATUSES = {'WON', 'LOST'}
        DEAD_CLIENT_STATUSES = {'INACTIVE'}

        now = timezone.now()

        overdue_leads = Lead.objects.filter(
            next_follow_up__lt=now
        ).exclude(status__in=DEAD_LEAD_STATUSES)

        overdue_clients = Client.objects.filter(
            next_follow_up__lt=now
        ).exclude(status__in=DEAD_CLIENT_STATUSES).select_related('lead')

        results = []

        for lead in overdue_leads:
            days = (now - lead.next_follow_up).days
            results.append({
                'id':             lead.pk,
                'name':           lead.name,
                'type':           'lead',
                'next_follow_up': lead.next_follow_up.isoformat(),
                'status':         lead.status,
                'days_overdue':   days,
            })

        for client in overdue_clients:
            days = (now - client.next_follow_up).days
            results.append({
                'id':             client.pk,
                'name':           client.name,
                'type':           'client',
                'next_follow_up': client.next_follow_up.isoformat(),
                'status':         client.status,
                'days_overdue':   days,
            })

        results.sort(key=lambda x: x['days_overdue'], reverse=True)

        return Response(results, status=status.HTTP_200_OK)
     
    