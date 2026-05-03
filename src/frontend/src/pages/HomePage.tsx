import { Container, Stack } from '@mantine/core';
import { UserGreeting } from '../components/user-greeting/UserGreeting';
import { FeatureCards } from '../components/feature-cards/FeatureCards';
import { OverdueFollowUps } from '../components/overdue-followups/OverdueFollowups';

const HomePage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <UserGreeting />
          <OverdueFollowUps />
          <FeatureCards />
        </Stack>
      </Container>
    </div>
  );
};

export default HomePage;
