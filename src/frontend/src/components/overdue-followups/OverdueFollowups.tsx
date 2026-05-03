import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Card,
  Divider,
  Group,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconAlertTriangle, IconArrowRight, IconCircleCheck } from '@tabler/icons-react';
import classes from './OverdueFollowUps.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OverdueItem {
  id: number;
  name: string;
  type: 'lead' | 'client';
  next_follow_up: string; // ISO datetime string from Django
  status: string;
  days_overdue: number;   // computed server-side
}

// ── Constants ─────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';
const MAX_VISIBLE = 5;

// ── Helpers ───────────────────────────────────────────────────────────────────

function urgencyColor(days: number): string {
  if (days > 10) return 'red';
  if (days > 4) return 'orange';
  if (days === 0) return 'green';
  return 'yellow';
}

function getDaysOverdue(nextFollowUp: string): number {
  const due = new Date(nextFollowUp.split('T')[0] + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
}

function statusLabel(status: string): string {
  const MAP: Record<string, string> = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    DISCOVERY: 'Discovery',
    PROPOSAL: 'Proposal',
    NEGOTIATION: 'Negotiation',
    ACTIVE: 'Active',
  };
  return MAP[status] ?? status;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function OverdueFollowUps() {
  const navigate = useNavigate();
  const [items, setItems] = useState<OverdueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/leads/overdue-followups/`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: OverdueItem[]) => {
        setItems(data); // already sorted server-side
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const visible = items.slice(0, MAX_VISIBLE);
  const overflow = items.length - MAX_VISIBLE;

  return (
    <Card className={classes.card} radius="md" padding="xl">
      {/* Header */}
      <Group justify="space-between" align="center" mb="md">
        <Group gap="sm">
          <ThemeIcon className={classes.icon} size={36} radius="md">
            <IconAlertTriangle size={18} stroke={1.75} />
          </ThemeIcon>
          <div>
            <Title order={5} className={classes.title}>
              Current & Overdue Follow-ups
            </Title>
            <Text fz="xs" className={classes.subtitle}>
              {loading ? 'Loading...' : `${items.length} item${items.length !== 1 ? 's' : ''} need attention`}
            </Text>
          </div>
        </Group>

        {!loading && !error && items.length > 0 && (
          <Badge variant="light" className={classes.countBadge} size="sm">
            {items.length}
          </Badge>
        )}
      </Group>

      <Divider className={classes.divider} mb="md" />

      {/* Body */}
      {loading ? (
        <Stack gap="sm">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={44} radius="sm" />
          ))}
        </Stack>
      ) : error ? (
        <Text fz="sm" className={classes.emptyText}>
          Could not load follow-ups. Check your connection.
        </Text>
      ) : items.length === 0 ? (
        <Group gap="xs" className={classes.allClear}>
          <IconCircleCheck size={16} />
          <Text fz="sm">All caught up - no overdue follow-ups.</Text>
        </Group>
      ) : (
        <Stack gap={6}>
          {visible.map((item) => {
            const daysOverdue = getDaysOverdue(item.next_follow_up);
            return (
              <UnstyledButton
                key={`${item.type}-${item.id}`}
                className={classes.row}
                onClick={() => navigate(`/${item.type}s/`)}
              >
                <div className={classes.rowLeft}>
                  <Text fz="sm" className={classes.name}>
                    {item.name}
                  </Text>
                  <Text fz="xs" className={classes.meta}>
                    {item.type === 'lead' ? 'Lead' : 'Client'} &middot; {statusLabel(item.status)}
                  </Text>
                </div>

                <Group gap="xs" wrap="nowrap">
                  <Badge
                    color={urgencyColor(daysOverdue)}
                    variant="light"
                    size="sm"
                    className={classes.badge}
                  >
                    {daysOverdue <= 0 ? 'Due Today' : `${daysOverdue}d overdue`}
                  </Badge>
                  <IconArrowRight size={13} className={classes.rowArrow} />
                </Group>
              </UnstyledButton>
            );
          })}

          {overflow > 0 && (
            <Text fz="xs" className={classes.overflowNote} mt={4}>
              +{overflow} more &mdash; view all in Leads or Clients
            </Text>
          )}
        </Stack>
      )}
    </Card>
  );
}