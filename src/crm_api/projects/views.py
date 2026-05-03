# DRF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
# Application 
from .models import Project
from .serializers import ProjectSerializer
# DRF_YASG
from drf_yasg.utils import swagger_auto_schema
from .api_schemas import *

# Project Crud Views
class ProjectListView(APIView):
    @swagger_auto_schema(
        request_body=project_request_schema,
        responses={
            202: 'Project created successfully',
            400: 'Bad request',
        },
        operation_id="create_project", 
        operation_description="Creates a new project"
    )
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # Create the project
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @swagger_auto_schema(
        request_body=None,
        responses={
            200: 'OK',
            400: 'Bad request',
        },
        operation_id="get_projects_list", 
        operation_description="Retrieves all projects in the database"
    )
    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ProjectDetailView(APIView):
    @swagger_auto_schema(
        request_body=None,
        responses={
            200: 'OK',
            404: 'Not Found',
        },
        operation_id="get_project", 
        operation_description="Retrieves a project"
    )
    def get(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            serializer = ProjectSerializer(project)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist as e:
            return Response({"error": "Project does not exist!"}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        request_body=project_request_schema,
        responses={
            200: 'Project updated successfully',
            400: 'Bad request',
            404: 'Not Found',
        },
        operation_id="patch_project", 
        operation_description="Updates a project"
    )
    def patch(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            serializer = ProjectSerializer(project, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # Update the project
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Project.DoesNotExist as e:
            return Response({"error": "Project does not exist!"})

    @swagger_auto_schema(
        responses={
            200: 'Project deleted successfully',
            404: 'Not Found',
        },
        operation_id="delete_project", 
        operation_description="Delete a project"
    )
    def delete(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response({"error": "Project does not exist!"}, status=status.HTTP_404_NOT_FOUND)