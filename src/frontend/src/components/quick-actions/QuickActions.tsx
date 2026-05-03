import { useNavigate } from 'react-router-dom';
import {
  IconUserPlus,
  IconUserSearch,
  IconLayoutKanban,
  IconBolt,
} from '@tabler/icons-react';
import {
  Card,
  SimpleGrid,
  Text,
  Title,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import classes from '../feature-cards/FeatureCards.module.css';
import actionClasses from './QuickActions.module.css';

const ACTIONS = [
  {
    label: 'New Client',
    icon: IconUserPlus,
    to: '/clients?action=create',
  },
  {
    label: 'New Lead',
    icon: IconUserSearch,
    to: '/leads?action=create',
  },
  {
    label: 'New Project',
    icon: IconLayoutKanban,
    to: '/projects?action=create',
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card
      shadow="md"
      radius="md"
      padding="xl"
      className={classes.card}
      style={{ cursor: 'default' }} // card itself isn't a link
    >
      <ThemeIcon className={classes.icon} size={52} radius="md">
        <IconBolt size={28} stroke={1.5} />
      </ThemeIcon>

      <Title order={4} className={classes.cardTitle} mt="md">
        Quick Actions
      </Title>

      <Text fz="sm" className={classes.cardDescription} mt="sm">
        Jump straight into creating a record or logging an update.
      </Text>

      <SimpleGrid cols={2} spacing="sm" mt="lg">
        {ACTIONS.map(({ label, icon: Icon, to }) => (
          <UnstyledButton
            key={label}
            className={actionClasses.actionButton}
            onClick={() => navigate(to)}
          >
            <Icon size={16} className={actionClasses.actionIcon} />
            <Text fz="xs" className={actionClasses.actionLabel}>
              {label}
            </Text>
          </UnstyledButton>
        ))}
      </SimpleGrid>
    </Card>
  );
}