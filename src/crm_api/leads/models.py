from django.db import models

# Person - All their info on initial contact.
class Lead(models.Model):
    STATUS_CHOICES = [
        ("NEW", "New"),
        ("CONTACTED", "Contacted"),
        ("DISCOVERY", "Discovery Scheduled"),
        ("PROPOSAL", "Proposal Sent"),
        ("NEGOTIATION", "Negotiation"),
        ("WON", "Won"),
        ("LOST", "Lost"),
    ]

    SOURCE_CHOICES = [
        ("REFERRAL", "Referral"),
        ("WEBSITE", "Website"),
        ("INSTAGRAM", "Instagram"),
        ("COLD_OUTREACH", "Cold Outreach"),
        ("NETWORKING", "Networking"),
        ("OTHER", "Other"),
    ]
    # Metadata
    # TODO: Add user/roles? owner = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    company = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES, default="OTHER")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="NEW")
    estimated_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # Datetime Fields
    create_time = models.DateTimeField(auto_now_add=True)
    last_contacted = models.DateTimeField(null=True, blank=True)
    next_follow_up = models.DateTimeField(null=True, blank=True)

   

