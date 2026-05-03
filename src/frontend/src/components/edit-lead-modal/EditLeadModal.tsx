import { useEffect } from 'react';
import { TextInput, Select, NumberInput, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { notify } from '../../utils/notify';
import { NoteSection } from '../note-section/NoteSection';

interface EditLeadFormProps {
    id: number;
    onLeadUpdated: () => void;
}

function toLocalNoon(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
}

export function EditLeadForm({ id, onLeadUpdated }: EditLeadFormProps) {
    const form = useForm({
        initialValues: {
            name: '', email: '', phone: '', company: '',
            source: 'OTHER', status: 'NEW',
            estimated_value: null as number | null,
            next_follow_up: null as Date | null,
        },
        validate: {
            name: (value) => value.trim() === '' ? 'Name is required' : null,
            email: (value) => value && !/^\S+@\S+\.\S+$/.test(value) ? 'Invalid email' : null,
            phone: (value) => value && !/^\+?[0-9\s\-()]+$/.test(value) ? 'Invalid phone number' : null,
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

    useEffect(() => {
        fetch(`http://localhost:8000/leads/${id}/`)
            .then(r => r.json())
            .then(data => form.setValues({
                ...data,
                next_follow_up: data.next_follow_up ? toLocalNoon(data.next_follow_up.split('T')[0]) : null,
                last_contacted: data.last_contacted ? toLocalNoon(data.last_contacted.split('T')[0]) : null,
            }));
    }, [id]);

    const handleSubmit = async (values: typeof form.values) => {
        const res = await fetch(`http://localhost:8000/leads/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') ?? '',
            },
            body: JSON.stringify({
                ...values,
                next_follow_up: values.next_follow_up
                    ? new Date(values.next_follow_up).toISOString().split('T')[0]
                    : null,
            }),
        });

        if (!res.ok) {
            notify({
                title: 'Error',
                message: 'Failed to update lead. Please try again.',
                color: 'red',
            });
            return;
        }

        onLeadUpdated();
        modals.closeAll();
        notify({
            title: 'Lead updated',
            message: 'The lead was successfully updated.',
            color: 'green',
        });
    };

    const handleDelete = () => {
        modals.openConfirmModal({
            title: 'Delete Lead',
            children: 'Are you sure you want to delete this lead? This action cannot be undone.',
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                const res = await fetch(`http://localhost:8000/leads/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') ?? '' },
                });
                if (!res.ok) {
                    notify({
                        title: 'Error',
                        message: 'Failed to delete lead. Please try again.',
                        color: 'red',
                    });
                    return;
                }
                onLeadUpdated();
                modals.closeAll();
                notify({
                    title: 'Lead deleted',
                    message: 'The lead was successfully deleted.',
                    color: 'green',
                });

            },
        });
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput label="Name" {...form.getInputProps('name')} />
                <TextInput label="Email" {...form.getInputProps('email')} />
                <TextInput label="Phone" {...form.getInputProps('phone')} />
                <TextInput label="Company" {...form.getInputProps('company')} />
                <Select label="Status" data={['NEW', 'CONTACTED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST']} {...form.getInputProps('status')} />
                <Select label="Source" data={['REFERRAL', 'WEBSITE', 'INSTAGRAM', 'COLD_OUTREACH', 'NETWORKING', 'OTHER']} {...form.getInputProps('source')} />
                <NumberInput label="Estimated Value" {...form.getInputProps('estimated_value')} />
                <DatePickerInput label="Last Contacted" {...form.getInputProps('last_contacted')} />
                <DatePickerInput label="Next Follow-Up" {...form.getInputProps('next_follow_up')} />
                <Group justify="space-between">
                    <Button color="red" variant="filled" onClick={handleDelete}>Delete</Button>
                    <Button type="submit">Save</Button>
                </Group>
                <NoteSection entityType="lead" entityId={id} />
            </Stack>
        </form>
    );
}

function getCookie(name: string): string | undefined {
    return document.cookie.split(';').map(c => c.trim())
        .find(c => c.startsWith(name + '='))?.split('=')[1];
}