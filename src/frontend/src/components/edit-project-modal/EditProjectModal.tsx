import { useEffect } from 'react';
import { TextInput, Textarea, Select, NumberInput, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { notify } from '../../utils/notify';
import { NoteSection } from '../note-section/NoteSection';

interface EditProjectFormProps {
    id: number;
    onProjectUpdated: () => void;
}

export function EditProjectForm({ id, onProjectUpdated }: EditProjectFormProps) {
    const form = useForm({
        initialValues: {
            client: null as number | null,
            name: '',
            description: '',
            status: 'ACTIVE',
            priority: 'MEDIUM',
            start_date: null as Date | null,
            end_date: null as Date | null,
            deadline: null as Date | null,
            agreed_value: null as number | null,
            currency: 'USD',
        },
        validate: {
            name: (value) => (value.trim() ? null : 'Project name cannot be blank'),
            status: (value) => (value ? null : 'Status cannot be blank'),
            priority: (value) => (value ? null : 'Priority cannot be blank'),
            currency: (value) => (value ? null : 'Currency cannot be blank'),
            agreed_value: (value) => value === null || value >= 0 ? null : 'Value must be positive',
        },
    });

    useEffect(() => {
        fetch(`http://localhost:8000/projects/${id}/`)
            .then(r => r.json())
            .then(data => form.setValues({
                ...data,
                start_date: data.start_date ? new Date(data.start_date + 'T12:00:00') : null,
                end_date: data.end_date ? new Date(data.end_date + 'T12:00:00') : null,
                deadline: data.deadline ? new Date(data.deadline + 'T12:00:00') : null,
            }));
    }, [id]);

    const formatDate = (d: Date | null) =>
        d ? new Date(d).toISOString().split('T')[0] : null;

    const handleSubmit = async (values: typeof form.values) => {
        const res = await fetch(`http://localhost:8000/projects/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') ?? '',
            },
            body: JSON.stringify({
                ...values,
                start_date: formatDate(values.start_date),
                end_date: formatDate(values.end_date),
                deadline: formatDate(values.deadline),
            }),
        });

        if (!res.ok) {
            notify({
                title: 'Error',
                message: 'Failed to update project. Please try again.',
                color: 'red',
            });
            return;
        }
        onProjectUpdated();
        modals.closeAll();
        notify({
            title: 'Project updated',
            message: 'The project was successfully updated.',
            color: 'green',
        });
    };

    const handleDelete = () => {
        modals.openConfirmModal({
            title: 'Delete Project',
            children: 'Are you sure you want to delete this project? This action cannot be undone.',
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                const res = await fetch(`http://localhost:8000/projects/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') ?? '' },
                });
                if (!res.ok) {
                    notify({
                        title: 'Error',
                        message: 'Failed to delete project. Please try again.',
                        color: 'red',
                    });
                    return;
                } 
                onProjectUpdated();
                modals.closeAll();
                notify({
                    title: 'Project deleted',
                    message: 'The project was successfully deleted.',
                    color: 'green',
                });
            },
        });
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput label="Project Name" {...form.getInputProps('name')} />
                <Textarea label="Description" {...form.getInputProps('description')} />
                <Select
                    label="Status"
                    data={['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']}
                    {...form.getInputProps('status')}
                />
                <Select
                    label="Priority"
                    data={['LOW', 'MEDIUM', 'HIGH']}
                    {...form.getInputProps('priority')}
                />
                <DatePickerInput label="Start Date" {...form.getInputProps('start_date')} />
                <DatePickerInput label="Deadline" {...form.getInputProps('deadline')} />
                <DatePickerInput label="End Date" {...form.getInputProps('end_date')} />
                <NumberInput label="Agreed Value" {...form.getInputProps('agreed_value')} />
                <Select
                    label="Currency"
                    data={['USD', 'EUR', 'GBP', 'CAD']}
                    {...form.getInputProps('currency')}
                />
                <Group justify="space-between">
                    <Button color="red" variant="filled" onClick={handleDelete}>Delete</Button>
                    <Button type="submit">Save</Button>
                </Group>
                <NoteSection entityType="project" entityId={id} />
            </Stack>
        </form>
    );
}

function getCookie(name: string): string | undefined {
    return document.cookie.split(';').map(c => c.trim())
        .find(c => c.startsWith(name + '='))?.split('=')[1];
}