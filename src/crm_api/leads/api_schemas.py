from drf_yasg import openapi

# Define the request body schema using openapi.Schema or a serializer
lead_request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    required=["name"],
    properties={
        "name": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=255,
            description="Lead's full name or primary contact name.",
            example="John Smith",
        ),
        "email": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_EMAIL,
            description="Lead email address.",
            example="john@acme.com",
        ),
        "phone": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=50,
            description="Lead phone number.",
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
            enum=[
                "REFERRAL",
                "WEBSITE",
                "INSTAGRAM",
                "COLD_OUTREACH",
                "NETWORKING",
                "OTHER",
            ],
            description="Where the lead came from.",
            example="REFERRAL",
            default="OTHER",
        ),
        "status": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=[
                "NEW",
                "CONTACTED",
                "DISCOVERY",
                "PROPOSAL",
                "NEGOTIATION",
                "WON",
                "LOST",
            ],
            description="Current pipeline status of the lead.",
            example="NEW",
            default="NEW",
        ),
        "estimated_value": openapi.Schema(
            type=openapi.TYPE_NUMBER,
            format="decimal",
            description="Estimated monetary value of the lead.",
            example=2500.00,
            nullable=True,
        ),
        "last_contacted": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATETIME,
            description="Datetime when the lead was last contacted.",
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


lead_patch_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    description="Partial update of a Lead. Only include fields that should be updated.",
    properties={
        "name": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=255,
            description="Lead's full name or contact name.",
            example="John Smith",
        ),
        "email": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_EMAIL,
            description="Lead email address.",
            example="john@acme.com",
        ),
        "phone": openapi.Schema(
            type=openapi.TYPE_STRING,
            maxLength=50,
            description="Lead phone number.",
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
            enum=[
                "REFERRAL",
                "WEBSITE",
                "INSTAGRAM",
                "COLD_OUTREACH",
                "NETWORKING",
                "OTHER",
            ],
            description="Where the lead came from.",
            example="WEBSITE",
        ),
        "status": openapi.Schema(
            type=openapi.TYPE_STRING,
            enum=[
                "NEW",
                "CONTACTED",
                "DISCOVERY",
                "PROPOSAL",
                "NEGOTIATION",
                "WON",
                "LOST",
            ],
            description="Current pipeline status.",
            example="CONTACTED",
        ),
        "estimated_value": openapi.Schema(
            type=openapi.TYPE_NUMBER,
            format="decimal",
            nullable=True,
            description="Estimated monetary value of the lead.",
            example=3000.00,
        ),
        "last_contacted": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATETIME,
            nullable=True,
            description="Datetime when the lead was last contacted.",
            example="2026-03-08T15:30:00Z",
        ),
        "next_follow_up": openapi.Schema(
            type=openapi.TYPE_STRING,
            format=openapi.FORMAT_DATETIME,
            nullable=True,
            description="Datetime scheduled for next follow-up.",
            example="2026-03-15T10:00:00Z",
        ),
    },
)
