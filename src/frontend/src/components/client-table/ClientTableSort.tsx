import { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import {
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  Button,
  Badge,
} from '@mantine/core';
import classes from './ClientTableSort.module.css';
import { LeadCard } from '../lead-card/LeadCard';
import { modals } from '@mantine/modals';
import { EditClientForm } from '../edit-client-modal/EditClientModal';

interface CustomerInfo {
  leadId: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  created: string;
  lastContacted: string;
  nextFollowUp: string;
  source: string;
  // remove latest_note from here
}

interface ClientRowData {
  id: number;
  customerInfo: CustomerInfo;
  latest_note: string;  // was clientNotes: string
  billingCycle: string;
  initialQuote: string;
  paymentMethod: string;
  status: string;
  preferredContactMethod: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  width?: number;
}


const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  INACTIVE: 'red',
};

function Th({ children, reversed, sorted, onSort, width }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th} w={width}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group gap="xs">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: ClientRowData[], search: string) {
  const query = search.toLowerCase().trim();
  // TODO: Fix this to work with our future CustomerInfo + ClientNotes data components... they cannot be filtered for now.
  return data.filter((item) =>
    Object.keys(data[0]).some((key) => {
      const value = item[key as keyof typeof item];

      if (typeof value !== 'string') return false;

      return value.toLowerCase().includes(query.toLowerCase());
    })
  );
}

function sortData(
  data: ClientRowData[],
  payload: { sortBy: keyof ClientRowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];

      const aStr = typeof aVal === 'string' ? aVal : String(aVal ?? '');
      const bStr = typeof bVal === 'string' ? bVal : String(bVal ?? '');

      if (payload.reversed) {
        return bStr.localeCompare(aStr);
      }

      return aStr.localeCompare(bStr);
    }),
    payload.search
  );
}

interface ClientTableSortProps {
  // Define any props if needed in the future
  data: ClientRowData[];
  onClientUpdated: () => void;
}

export function ClientTableSort({ data, onClientUpdated }: ClientTableSortProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof ClientRowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof ClientRowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.customerInfo.name}>
      <Table.Td>
        <Button radius="xs" variant='light' style={{ flex: 1 }} onClick={() => modals.open({ title: 'Edit Client', children: <EditClientForm id={row.id} onClientUpdated={onClientUpdated} /> })}>
          Edit
        </Button>

      </Table.Td>
      <Table.Td>
        <Badge color={STATUS_COLORS[row.status] ?? 'gray'}>{row.status}</Badge>
      </Table.Td>
      {/* TODO: Below section should just be a new component */}
      <Table.Td>
        <LeadCard
          id={row.customerInfo.leadId}
          fullName={row.customerInfo.name}
          created={(row.customerInfo.created)}
          lastContacted={(row.customerInfo.lastContacted)}
          nextFollowUp={(row.customerInfo.nextFollowUp)}
          email={row.customerInfo.email}
          phone={row.customerInfo.phone}
          notes={row.latest_note}
          company={row.customerInfo.company}
          badges={[{ emoji: '🔵', label: 'System' }]}
          displayTags={false}
          onLeadUpdated={() => { }}
          source={row.customerInfo.source}
          estimated_value={null}
        />
      </Table.Td>
      <Table.Td>{row.latest_note}</Table.Td>
      <Table.Td>{row.billingCycle}</Table.Td>
      <Table.Td>${Number(row.initialQuote).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Table.Td>      <Table.Td>{row.paymentMethod}</Table.Td>
      <Table.Td>{row.preferredContactMethod}</Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  return (
    <ScrollArea>

      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={false}
              reversed={reverseSortDirection}
              onSort={() => { }}
              width={120}
            >
              Action
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
              width={120}
            >
              Status
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
              width={350}
            >
              Customer Information
            </Th>
            <Th
              sorted={sortBy === 'billingCycle'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('billingCycle')}
              width={300}
            >
              Client Notes
            </Th>
            <Th
              sorted={sortBy === 'billingCycle'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('billingCycle')}
              width={140}
            >
              Billing Cycle
            </Th>
            <Th
              sorted={sortBy === 'initialQuote'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('initialQuote')}
              width={150}
            >
              Initial Quote
            </Th>
            <Th
              sorted={sortBy === 'paymentMethod'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('paymentMethod')}
              width={180}
            >
              Payment Method
            </Th>
            <Th
              sorted={sortBy === 'preferredContactMethod'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('preferredContactMethod')}
              width={230}
            >
              Preferred Contact Method
            </Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}