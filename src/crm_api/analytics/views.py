# DRF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# Application 
from leads.models import Lead
from clients.models import Client
from projects.models import Project
# DRF_YASG
from drf_yasg.utils import swagger_auto_schema


class AnalyticsView(APIView):
    @swagger_auto_schema(
        request_body=None,
        responses={
            200: 'OK',
            400: 'Bad request',
        },
        operation_id="get_analytics", 
        operation_description="Retrieves analytics data for leads, clients and projects"
    )
    def get(self, request):
        # This logic may change in the future
        active_leads = Lead.objects.filter(status__in=['NEW', 'CONTACTED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION']).count()
        active_clients = Client.objects.filter(status='ACTIVE').count()
        active_projects = Project.objects.filter(status='ACTIVE').count()
        data = {
            'active_leads': active_leads,
            'active_clients': active_clients,
            'active_projects': active_projects,
        }
        return Response(data, status=status.HTTP_200_OK)