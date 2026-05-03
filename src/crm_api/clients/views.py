# DRF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# Application 
from .models import Client
from .serializers import ClientSerializer
# DRF_YASG
from drf_yasg.utils import swagger_auto_schema
from .api_schemas import *

# Client Crud Views
class ClientListView(APIView):
    @swagger_auto_schema(
        request_body=client_request_schema,
        responses={
            202: 'Client created successfully',
            400: 'Bad request',
        },
        operation_id="create_client", 
        operation_description="Creates a new client"
    )
    def post(self, request):
        serializer = ClientSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # Create the client
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @swagger_auto_schema(
        request_body=None,
        responses={
            200: 'OK',
            400: 'Bad request',
        },
        operation_id="get_clients_list", 
        operation_description="Retrieves all clients in the database"
    )
    def get(self, request):
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ClientDetailView(APIView):
    @swagger_auto_schema(
        request_body=None,
        responses={
            200: 'OK',
            404: 'Not Found',
        },
        operation_id="get_client", 
        operation_description="Retrieves a client"
    )
    def get(self, request, pk):
        try:
            client = Client.objects.get(pk=pk)
            serializer = ClientSerializer(client)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Client.DoesNotExist as e:
            return Response({"error": "Client does not exist!"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        request_body=client_request_schema,
        responses={
            200: 'Client updated successfully',
            400: 'Bad request',
            404: 'Not Found',
        },
        operation_id="patch_client", 
        operation_description="Updates a client"
    )
    def patch(self, request, pk):
        try:
            client = Client.objects.get(pk=pk)
            serializer = ClientSerializer(client, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # Update the client
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Client.DoesNotExist as e:
            return Response({"error": "Client does not exist!"})

    @swagger_auto_schema(
        responses={
            200: 'Client deleted successfully',
            404: 'Not Found',
        },
        operation_id="delete_client", 
        operation_description="Delete a client"
    )
    def delete(self, request, pk):
        try:
            client = Client.objects.get(pk=pk)
            client.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Client.DoesNotExist:
            return Response({"error": "Client does not exist!"}, status=status.HTTP_404_NOT_FOUND)