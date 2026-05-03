import { Link } from 'react-router-dom';
import { QuickActions } from '../quick-actions/QuickActions';
import {
  IconUsers,
  IconUserSearch,
  IconCurrencyDollar,
  IconCalendarClock,
  IconArrowRight,
  IconDashboard,
} from '@tabler/icons-react';
import { Card, Group, SimpleGrid, Text, Title, ThemeIcon, Stack, Anchor } from '@mantine/core';
import classes from './FeatureCards.module.css';

const SECTIONS = [
  {
    title: 'Clients',
    to: '/clients',
    icon: IconUsers,
    description:
      'Manage your active and inactive clients. Track billing cycles, contract dates, payment methods, and preferred contact info — all linked back to the originating lead.',
    highlights: [
      { icon: IconCurrencyDollar, label: 'Billing & payment tracking' },
      { icon: IconCalendarClock, label: 'Contract start / end dates' },
    ],
  },
  {
    title: 'Projects',
    to: '/projects',
    icon: IconDashboard,
    description:
      'Track project status, deadlines, and assigned team members. Link projects to clients and leads for a complete view of your pipeline and workload.',
    highlights: [
      { icon: IconCalendarClock, label: 'Project deadlines' },
      { icon: IconCurrencyDollar, label: 'Project budget tracking' },
    ],
  },
  {
    title: 'Leads',
    to: '/leads',
    icon: IconUserSearch,
    description:
      'Track prospective clients through your pipeline — from first contact to won or lost. Log follow-ups, estimated value, source, and pipeline status in one place.',
    highlights: [
      { icon: IconCalendarClock, label: 'Follow-up scheduling' },
      { icon: IconCurrencyDollar, label: 'Estimated deal value' },
    ],
  },
  
];

export function FeatureCards() {
  const cards = SECTIONS.map((section) => (
    <Card
      key={section.title}
      shadow="md"
      radius="md"
      padding="xl"
      className={classes.card}
      component={Link}
      to={section.to}
    >
      <ThemeIcon className={classes.icon} size={52} radius="md">
        <section.icon size={28} stroke={1.5} />
      </ThemeIcon>

      <Title order={4} className={classes.cardTitle} mt="md">
        {section.title}
      </Title>

      <Text fz="sm" className={classes.cardDescription} mt="sm">
        {section.description}
      </Text>

      <Stack gap={6} mt="lg">
        {section.highlights.map(({ icon: HIcon, label }) => (
          <Group key={label} gap="xs">
            <HIcon size={14} className={classes.highlightIcon} />
            <Text fz="xs" className={classes.highlightLabel}>
              {label}
            </Text>
          </Group>
        ))}
      </Stack>

      <Group mt="xl" justify="flex-end">
        <Anchor component="span" className={classes.cta} fz="sm">
          Go to {section.title} <IconArrowRight size={14} style={{ verticalAlign: 'middle' }} />
        </Anchor>
      </Group>
    </Card>
  ));

  return (
    <div>
      <Title order={4} className={classes.sectionHeader} mb="md">
        Your CRM
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
        <QuickActions />
        {cards}
      </SimpleGrid>
    </div>
  );
}
