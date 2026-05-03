"""
URL configuration for crm_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
# DRF yasg
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="CRM API Documentation",
      default_version='v1',
   ),
   public=True,
)
urlpatterns = [
    path('admin/', admin.site.urls),
    # Optional: Swagger UI connection
    path('api-spec/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # Leads
    path('', include('leads.urls')),
    # Clients
    path('', include('clients.urls')),
    # Projects
    path('', include('projects.urls')),
    # Analytics
    path('', include('analytics.urls')),
    # Notes
    path('', include('notes.urls')),
    # Auth
    path('api/', include('auth_app.urls')),
]

