from django.db import models

class Client(models.Model):
    STATUS_CHOICES = [
        ("ACTIVE", "Active"),
        ("INACTIVE", "Inactive"),
    ]

    BILLING_CYCLE_CHOICES = [
        ("MONTHLY", "Monthly"),
        ("QUARTERLY", "Quarterly"),
        ("ANNUALLY", "Annually"),
        ("ONE-TIME", "One-Time"),
    ]

    # May be irrelevant if we use Stripe or other payment processor, but good for tracking and reporting
    PAYMENT_METHOD_CHOICES = [
        ("CREDIT CARD", "Credit Card"),
        ("DEBIT CARD", "Debit Card"),
        ("BANK TRANSFER", "Bank Transfer"),
        ("PAYPAL", "PayPal"),
        ("CASH", "Cash"),
        ("OTHER", "Other"),
    ]

    PREFERRED_CONTACT_METHOD_CHOICES = [
        ("EMAIL", "Email"),
        ("PHONE", "Phone"),
        ("SMS", "SMS"),
        ("OTHER", "Other"),
    ]

    # All the person info
    lead = models.ForeignKey("leads.Lead", null=True, blank=True, on_delete=models.CASCADE)
    # Unique to client fields:
    create_time = models.DateTimeField(auto_now_add=True)
    last_contacted = models.DateTimeField(null=True, blank=True)
    next_follow_up = models.DateTimeField(null=True, blank=True)

    # Financial details 
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLE_CHOICES, default="MONTHLY")
    billing_cycle_date = models.DateField(null=True, blank=True)
    billing_cycle_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, null=True, blank=True)
    initial_quote = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Details 
    contract_start_date = models.DateField(null=True, blank=True)
    contract_end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="ACTIVE")
    preferred_contact_method = models.CharField(max_length=20, choices=PREFERRED_CONTACT_METHOD_CHOICES, null=True, blank=True)

    def __str__(self):
        return self.name
    
    @property
    def name(self):
        return self.lead.name if self.lead else ""

    @property
    def email(self):
        return self.lead.email if self.lead else ""

    @property
    def company(self):
        return self.lead.company if self.lead else ""
    
    @property
    def phone(self):
        return self.lead.phone if self.lead else ""
    
    @property
    def source(self):
        return self.lead.source if self.lead else ""