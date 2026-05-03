from drf_yasg import openapi

project_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["name", "client"],
    properties={
        "client": openapi.Schema(
            type=openapi.TYPE_INTEGER,
            description="ID of the associated client.",
            example=1,
        ),
        "name": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=255,
            description="Project name.",
            example="Acme Website Redesign",
        ),
        "description": openapi.Schema(
            type=openapi.TYPE_STRING,
            description="Project description.",
            example="Full redesign of the Acme Construction website.",
        ),
        "status": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
            description="Current status of the project.",
            example="ACTIVE",
            default="ACTIVE",
        ),
        "priority": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["LOW", "MEDIUM", "HIGH"],
            description="Project priority level.",
            example="MEDIUM",
            default="MEDIUM",
        ),
        "tags": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description="List of tags for the project.",
            example=["web", "redesign", "maintenance"],
        ),
        "start_date": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE,
            description="Project start date.",
            example="2026-04-01",
            nullable=True,
        ),
        "end_date": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE,
            description="Actual project completion date.",
            example="2026-06-30",
            nullable=True,
        ),
        "deadline": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE,
            description="Target deadline for the project.",
            example="2026-06-15",
            nullable=True,
        ),
        "agreed_value": openapi.Schema(
            type=openapi.TYPE_NUMBER,
            format="decimal",
            description="Agreed monetary value of the project.",
            example=5000.00,
            nullable=True,
        ),
        "currency": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=3,
            description="Currency code.",
            example="USD",
            default="USD",
        ),
    },
)

project_patch_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    description="Partial update of a Project. Only include fields that should be updated.",
    properties={
        "name": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=255,
            description="Project name.",
            example="Acme Website Redesign",
        ),
        "description": openapi.Schema(
            type=openapi.TYPE_STRING,
            description="Project description.",
            example="Updated scope to include SEO work.",
        ),
        "status": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
            description="Current status of the project.",
            example="ON_HOLD",
        ),
        "priority": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["LOW", "MEDIUM", "HIGH"],
            description="Project priority level.",
            example="HIGH",
        ),
        "tags": openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING),
            description="List of tags for the project.",
            example=["web", "seo"],
        ),
        "start_date": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE,
            nullable=True,
            description="Project start date.",
            example="2026-04-01",
        ),
        "end_date": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE,
            nullable=True,
            description="Actual project completion date.",
            example="2026-07-15",
        ),
        "deadline": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATE,
            nullable=True,
            description="Target deadline for the project.",
            example="2026-07-01",
        ),
        "agreed_value": openapi.Schema(
            type=openapi.TYPE_NUMBER,
            format="decimal",
            nullable=True,
            description="Agreed monetary value of the project.",
            example=6500.00,
        ),
        "currency": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=3,
            description="Currency code.",
            example="USD",
        ),
    },
)