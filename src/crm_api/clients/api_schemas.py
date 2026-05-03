from drf_yasg import openapi

client_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["name"],
    properties={
        "name": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=255,
            description="Client's full name or primary contact name.",
            example="John Smith",
        ),
        "email": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_EMAIL,
            description="Client email address.",
            example="john@acme.com",
        ),
        "phone": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=50,
            description="Client phone number.",
            example="+1-617-555-1234",
        ),
        "company": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=255,
            description="Company name.",
            example="Acme Construction",
        ),
        "source": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["REFERRAL", "WEBSITE", "INSTAGRAM", "COLD_OUTREACH", "NETWORKING", "OTHER"],
            description="Where the client came from.",
            example="REFERRAL",
            default="OTHER",
        ),
        "status": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["ACTIVE", "INACTIVE", "CHURNED"],
            description="Current status of the client.",
            example="ACTIVE",
            default="ACTIVE",
        ),
        "estimated_value": openapi.Schema(
            type=openapi.TYPE_NUMBER,
            format="decimal",
            description="Estimated monetary value of the client.",
            example=2500.00,
            nullable=True,
        ),
        "last_contacted": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATETIME,
            description="Datetime when the client was last contacted.",
            example="2026-03-08T14:30:00Z",
            nullable=True,
        ),
        "next_follow_up": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATETIME,
            description="Datetime for the next follow-up.",
            example="2026-03-15T10:00:00Z",
            nullable=True,
        ),
    },
)

client_patch_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    description="Partial update of a Client. Only include fields that should be updated.",
    properties={
        "name": openapi.Schema(type=openapi.TYPE_STRING, maxLength=255, example="John Smith"),
        "email": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL, example="john@acme.com"),
        "phone": openapi.Schema(type=openapi.TYPE_STRING, maxLength=50, example="+1-617-555-1234"),
        "company": openapi.Schema(type=openapi.TYPE_STRING, maxLength=255, example="Acme Construction"),
        "source": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["REFERRAL", "WEBSITE", "INSTAGRAM", "COLD_OUTREACH", "NETWORKING", "OTHER"],
            example="WEBSITE",
        ),
        "status": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=["ACTIVE", "INACTIVE", "CHURNED"],
            example="INACTIVE",
        ),
        "estimated_value": openapi.Schema(type=openapi.TYPE_NUMBER, format="decimal", nullable=True, example=3000.00),
        "last_contacted": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, nullable=True, example="2026-03-08T15:30:00Z"),
        "next_follow_up": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_DATETIME, nullable=True, example="2026-03-15T10:00:00Z"),
    },
)