import { useEffect, useState } from 'react';
import { Select, NumberInput, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { notify } from '../../../utils/notify';
import { NoteSection } from '../../note-section/NoteSection';

interface EditClientFormProps {
    id: number;
    onClientUpdated: () => void;
}

function toLocalNoon(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
}

function toDateString(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function EditClientForm({ id, onClientUpdated }: EditClientFormProps) {
    const form = useForm({
        initialValues: {
            name: '', email: '', phone: '', company: '',
            source: 'OTHER', status: 'NEW',
            estimated_value: null as number | null,
            next_follow_up: null as Date | null,
        },
        validate: {
            next_follow_up: (value) => {
                if (!value) return null;
                const normalized = new Date(value);
                normalized.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return normalized < today ? 'Next follow-up must be in the future' : null;
            },
        },
    });

    const [leadOptionsData, setLeadOptionsData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/leads/')
            .then((response) => response.json())
            .then((json) => {
                const formattedData = json.map((item: { id: { toString: () => any; }; name: any; }) => ({
                    value: item.id.toString(),
                    label: item.name,
                }));
                setLeadOptionsData(formattedData);
            });
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8000/clients/${id}/`)
            .then(r => r.json())
            .then(data => form.setValues({
                ...data,
                lead: data.lead?.toString() ?? '',
                next_follow_up: data.next_follow_up ? toLocalNoon(data.next_follow_up.split('T')[0]) : null,
            }));
    }, [id]);

    const handleSubmit = async (values: typeof form.values) => {
        const res = await fetch(`http://localhost:8000/clients/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') ?? '',
            },
            body: JSON.stringify({
                ...values,
                next_follow_up: values.next_follow_up ? toDateString(values.next_follow_up) : null,
            }),
        });
        if (!res.ok) {
            notify({
                title: 'Error',
                message: 'Failed to update client. Please try again.',
                color: 'red',
            });
            return;
        }

        onClientUpdated();
        modals.closeAll();
        notify({
            title: 'Client updated',
            message: 'The client was successfully updated.',
            color: 'green',
        });
    };

    const handleDelete = () => {
        modals.openConfirmModal({
            title: 'Delete Client',
            children: 'Are you sure you want to delete this client? This action cannot be undone.',
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                const res = await fetch(`http://localhost:8000/clients/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') ?? '' },
                });
                if (!res.ok) {
                    notify({
                        title: 'Error',
                        message: 'Failed to delete client. Please try again.',
                        color: 'red',
                    });
                    return;
                }
                onClientUpdated();
                modals.closeAll();
                notify({
                    title: 'Client deleted',
                    message: 'The client was successfully deleted.',
                    color: 'green',
                });
            },
        });
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <Select label="Lead ID" placeholder="Select a lead" data={leadOptionsData} {...form.getInputProps('lead')} />
                <NumberInput label="Initial Quote" {...form.getInputProps('initial_quote')} />
                <Select label="Billing Cycle" placeholder="Select a billing cycle" data={['MONTHLY', 'QUARTERLY', 'ANNUALLY', 'ONE-TIME']} {...form.getInputProps('billing_cycle')} />
                <Select label="Payment Method" placeholder="Select a payment method" data={['CREDIT CARD', 'DEBIT CARD', 'BANK TRANSFER', 'CASH', 'PAYPAL']} {...form.getInputProps('payment_method')} />
                <Select label="Preferred Contact Method" placeholder="Select a preferred contact method" data={['EMAIL', 'PHONE', 'SMS', 'OTHER']} {...form.getInputProps('preferred_contact_method')} />
                <DatePickerInput label="Next Follow-Up" placeholder="Select a date" {...form.getInputProps('next_follow_up')} />
                <Select label="Status" placeholder="Select a status" data={['ACTIVE', 'INACTIVE']} {...form.getInputProps('status')} />
                <Group justify="space-between">
                    <Button color="red" variant="filled" onClick={handleDelete}>Delete</Button>
                    <Button type="submit">Save</Button>
                </Group>
                <NoteSection entityType="client" entityId={id} />
            </Stack>
        </form>
    );
}

function getCookie(name: string): string | undefined {
    return document.cookie.split(';').map(c => c.trim())
        .find(c => c.startsWith(name + '='))?.split('=')[1];
}