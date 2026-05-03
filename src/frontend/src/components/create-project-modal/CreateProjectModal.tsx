import { TextInput, Textarea, Select, NumberInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState, useEffect } from 'react';
import { notify } from '../../utils/notify';

interface CreateProjectFormProps {
    onProjectCreated: () => void;
}

export function CreateProjectForm({ onProjectCreated }: CreateProjectFormProps) {
    const form = useForm({
        initialValues: {
            client: '',
            name: '',
            description: '',
            status: 'ACTIVE',
            priority: 'MEDIUM',
            start_date: null as Date | null,
            end_date: null as Date | null,
            deadline: null as Date | null,
            agreed_value: '',
            currency: 'USD',
        },
        validate: {
            client: (value) => (value ? null : 'Client is required'),
            name: (value) => (value.trim() ? null : 'Project name is required'),
        },
    });

    const [clientOptions, setClientOptions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/clients/')
            .then((res) => res.json())
            .then((json) => {
                const formatted = json.map((item: { id: number; lead_name: string }) => ({
                    value: item.id.toString(),
                    label: item.lead_name,
                }));
                setClientOptions(formatted);
            })
            .catch((err) => console.error('Failed to fetch clients:', err));
    }, []);

    const handleSubmit = async (values: typeof form.values) => {
        const formatDate = (d: Date | null) =>
            d ? new Date(d).toISOString().split('T')[0] : null;

        if (values.start_date && values.deadline && values.deadline < values.start_date) {
            form.setFieldError('deadline', 'Deadline cannot be before start date');
            return;
        }
        if (values.start_date && values.end_date && values.end_date < values.start_date) {
            form.setFieldError('end_date', 'End date cannot be before start date');
            return;
        }

        const payload = {
            client: values.client ? parseInt(values.client) : null,
            name: values.name.trim(),
            description: values.description.trim(),
            status: values.status,
            priority: values.priority,
            agreed_value: values.agreed_value ? parseFloat(String(values.agreed_value)) : null,
            currency: values.currency,
            start_date: formatDate(values.start_date),
            end_date: formatDate(values.end_date),
            deadline: formatDate(values.deadline),
        };

        try {
            const res = await fetch('http://localhost:8000/projects/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                notify({
                    title: 'Error',
                    message: 'Failed to create project. Please try again.',
                    color: 'red',
                });
                return;
            }

            onProjectCreated();
            modals.closeAll();
            notify({
                title: 'Project created',
                message: 'The project was successfully added.',
                color: 'green',
            });
        } catch (err) {
            console.error('Network error:', err);
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <Select
                    label="Client"
                    placeholder="Select a client"
                    data={clientOptions}
                    {...form.getInputProps('client')}
                />
                <TextInput label="Project Name" placeholder="e.g. Acme Website Redesign" {...form.getInputProps('name')} />
                <Textarea label="Description" placeholder="Project scope and details" {...form.getInputProps('description')} />
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
                <DatePickerInput label="Start Date" placeholder="Select a date" {...form.getInputProps('start_date')} />
                <DatePickerInput label="Deadline" placeholder="Select a date" {...form.getInputProps('deadline')} />
                <DatePickerInput label="End Date" placeholder="Select a date" {...form.getInputProps('end_date')} />
                <NumberInput label="Agreed Value" placeholder="0.00" {...form.getInputProps('agreed_value')} />
                <Select
                    label="Currency"
                    data={['USD', 'EUR', 'GBP', 'CAD']}
                    {...form.getInputProps('currency')}
                />
                <Button type="submit">Create</Button>
            </Stack>
        </form>
    );
}