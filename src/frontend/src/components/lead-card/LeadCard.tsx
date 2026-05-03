import { Badge, Button, Card, Group, Text, Stack } from '@mantine/core';
import { modals } from '@mantine/modals';
import { EditLeadForm } from '../edit-lead-modal/EditLeadModal';
import classes from './LeadCard.module.css';


interface LeadCardProps {
  // Define any props if needed in the future
  id: number;
  fullName: string;
  phone: string;
  notes: string;
  badges: { emoji: string; label: string }[];
  email: string;
  created: string;
  lastContacted: string;
  nextFollowUp: string;
  company: string;
  source: string;
  estimated_value: number | null;
  displayTags?: boolean;
  onLeadUpdated: () => void;
}

export function LeadCard({ id, fullName, phone, notes, badges, email, created, lastContacted, nextFollowUp, company, source, estimated_value, onLeadUpdated, displayTags = true }: LeadCardProps) {
  const features = badges.map((badge) => (
    <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section} mt="md">
        <Group justify="space-between" mb="xs">
          <Badge size="md" variant="dark">{company}</Badge>
          <Badge size="sm" variant="outline">{source}</Badge>
        </Group>
        <Text fz="lg" fw={500}>{fullName}</Text>
        <Text fz="sm" c="dimmed">{email || 'N/A'} · {phone || 'N/A'}</Text>
        <Stack gap={2} mt="sm">
          <Text fz="sm">📅 Created: {created}</Text>
          <Text fz="sm">📞 Last contacted: {lastContacted}</Text>
          <Text fz="sm">🔔 Next follow-up: {nextFollowUp}</Text>
          {estimated_value !== null && (
            <Text fz="sm">💰 Est. value: ${Number(estimated_value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
          )}
        </Stack>
        {notes && (
          <Text fz="xs" c="dimmed" mt="xs" lineClamp={2}>
            {notes}
          </Text>
        )}
      </Card.Section>
      
      
      {displayTags && (
        <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Filter Tags
        </Text>
        <Group gap={7} mt={5}>
          {features}
        </Group>
      </Card.Section>
      )}
      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }} onClick={() => modals.open({ title: 'Edit Lead', children: <EditLeadForm id={id} onLeadUpdated={onLeadUpdated} /> })}>
          Edit
        </Button>
      </Group>
    </Card>
  );
}