import { useEffect, useState } from 'react';
import { IconChevronDown, IconChevronUp, IconSearch, IconSelector } from '@tabler/icons-react';
import { EditProjectForm } from '../edit-project-modal/EditProjectModal';
import { modals } from '@mantine/modals';
import { Button } from '@mantine/core'; // already imported
import {
    Center,
    Group,
    ScrollArea,
    Table,
    Text,
    TextInput,
    UnstyledButton,
    Badge,
} from '@mantine/core';

interface ProjectRowData {
    id: number;
    name: string;
    description: string;
    status: string;
    priority: string;
    client: string;
    deadline: string;
    agreedValue: number | null;
    currency: string;
    latest_note: string;
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th>
            <UnstyledButton onClick={onSort}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center>
                        <Icon size={16} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: 'green',
    ON_HOLD: 'yellow',
    COMPLETED: 'blue',
    CANCELLED: 'red',
};

const PRIORITY_COLORS: Record<string, string> = {
    LOW: 'gray',
    MEDIUM: 'orange',
    HIGH: 'red',
};

function filterData(data: ProjectRowData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        ['name', 'status', 'priority', 'deadline', 'client'].some((key) => {
            const value = item[key as keyof ProjectRowData];
            if (typeof value !== 'string') return false;
            return value.toLowerCase().includes(query);
        })
    );
}

function sortData(
    data: ProjectRowData[],
    payload: { sortBy: keyof ProjectRowData | null; reversed: boolean; search: string }
) {
    const { sortBy } = payload;
    if (!sortBy) return filterData(data, payload.search);

    return filterData(
        [...data].sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            const aStr = typeof aVal === 'string' ? aVal : String(aVal ?? '');
            const bStr = typeof bVal === 'string' ? bVal : String(bVal ?? '');
            return payload.reversed ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
        }),
        payload.search
    );
}

interface ProjectTableSortProps {
    data: ProjectRowData[];
    onProjectUpdated: () => void;
}

export function ProjectTableSort({ data, onProjectUpdated }: ProjectTableSortProps) {
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof ProjectRowData | null>('status');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const setSorting = (field: keyof ProjectRowData) => {
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

    useEffect(() => {
        setSortedData(sortData(data, { sortBy: 'status', reversed: false, search: '' }));
    }, [data]);

    const rows = sortedData.map((row) => (
        <Table.Tr key={row.id}>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.description || <Text fz="sm" c="dimmed">No description</Text>}</Table.Td>
            <Table.Td>
                <Badge color={STATUS_COLORS[row.status] ?? 'gray'}>{row.status}</Badge>
            </Table.Td>
            <Table.Td>
                <Badge color={PRIORITY_COLORS[row.priority] ?? 'gray'} variant="outline">
                    {row.priority}
                </Badge>
            </Table.Td>
            <Table.Td>{row.client}</Table.Td>
            <Table.Td>
                {row.agreedValue
                    ? `${row.agreedValue.toLocaleString()} ${row.currency}`
                    : '-'}
            </Table.Td>
            <Table.Td>{row.deadline}</Table.Td>
            <Table.Td>
                <Button size="xs" variant="light" onClick={() =>
                    modals.open({
                        title: 'Edit Project',
                        children: <EditProjectForm id={row.id} onProjectUpdated={onProjectUpdated} />,
                    })
                }>
                    Edit
                </Button>
            </Table.Td>
            <Table.Td>
                {row.latest_note
                    ? <Text fz="sm" lineClamp={2}>{row.latest_note}</Text>
                    : <Text fz="sm" c="dimmed">-</Text>}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea>
            <TextInput
                placeholder="Search by name, status, priority, or deadline"
                mb="md"
                leftSection={<IconSearch size={16} stroke={1.5} />}
                value={search}
                onChange={handleSearchChange}
            />
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} w="100%" layout="fixed">
                <Table.Thead>
                    <Table.Tr>
                        <Th sorted={sortBy === 'name'} reversed={reverseSortDirection} onSort={() => setSorting('name')}>
                            Name
                        </Th>
                        <Th sorted={sortBy === 'description'} reversed={reverseSortDirection} onSort={() => setSorting('description')}>
                            Description
                        </Th>
                        <Th sorted={sortBy === 'status'} reversed={reverseSortDirection} onSort={() => setSorting('status')}>
                            Status
                        </Th>
                        <Th sorted={sortBy === 'priority'} reversed={reverseSortDirection} onSort={() => setSorting('priority')}>
                            Priority
                        </Th>
                        <Th sorted={sortBy === 'client'} reversed={reverseSortDirection} onSort={() => setSorting('client')}>
                            Client
                        </Th>
                        <Th sorted={sortBy === 'agreedValue'} reversed={reverseSortDirection} onSort={() => setSorting('agreedValue')}>
                            Value
                        </Th>
                        <Th sorted={sortBy === 'deadline'} reversed={reverseSortDirection} onSort={() => setSorting('deadline')}>
                            Deadline
                        </Th>
                        <Th sorted={sortBy === 'latest_note'} reversed={reverseSortDirection} onSort={() => setSorting('latest_note')}>
                            Latest Note
                        </Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={8}>
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