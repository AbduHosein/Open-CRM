import { useEffect, useState } from 'react';
import { Avatar, Card, Divider, Group, SimpleGrid, Text, Title } from '@mantine/core';
import { IconGauge, IconUsers, IconUserSearch } from '@tabler/icons-react';
import classes from './UserGreeting.module.css';
import { useAuth } from '../../context/AuthContext';

export function UserGreeting() {
  const { user } = useAuth()
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);  
  const [activeLeads, setActiveLeads] = useState(0);
  const [activeClients, setActiveClients] = useState(0);
  const [activeProjects, setActiveProjects] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/analytics/')
      .then(r => r.json())
      .then(data => {
        setActiveLeads(data.active_leads);
        setActiveClients(data.active_clients);
        setActiveProjects(data.active_projects);
      });


  }, []);

  const STATS = [
    { label: 'Active Leads', value: activeLeads, icon: IconUserSearch },
    { label: 'Active Clients', value: activeClients, icon: IconUsers },
    { label: 'Active Projects', value: activeProjects, icon: IconGauge },
  ];

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('') ?? '?';

  const stats = STATS.map(({ label, value, icon: Icon }) => (
    <div key={label} className={classes.stat}>
      <Icon size={20} className={classes.statIcon} />
      <Text className={classes.statValue}>{value}</Text>
      <Text className={classes.statLabel}>{label}</Text>
    </div>
  ));

  return (
    <Card className={classes.card} radius="md" padding="xl">
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
        <Group gap="md">
          <Avatar className={classes.avatar} size={56} radius="xl">
            {initials}
          </Avatar>
          <div>
            <Group gap="xs" align="center">
              <Title order={3} className={classes.name}>
                Hello, {user?.name ?? 'Guest'}
              </Title>
            </Group>
            <Text className={classes.email}>{user?.email ?? ''}</Text>
          </div>
        </Group>
        <SimpleGrid cols={3} spacing="xl">
          {stats}
        </SimpleGrid>
      </Group>
      <Divider className={classes.divider} mt="xl" />
    </Card>
  );
}