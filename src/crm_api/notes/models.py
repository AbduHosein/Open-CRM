from django.db import models

class Note(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    lead    = models.ForeignKey('leads.Lead',       null=True, blank=True, on_delete=models.SET_NULL, related_name='notes')
    client  = models.ForeignKey('clients.Client',   null=True, blank=True, on_delete=models.SET_NULL, related_name='notes')
    project = models.ForeignKey('projects.Project', null=True, blank=True, on_delete=models.SET_NULL, related_name='notes')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Note {self.id} ({self.created_at:%Y-%m-%d})"