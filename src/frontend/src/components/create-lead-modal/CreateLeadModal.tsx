import { TextInput, Select, NumberInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { notify } from '../../../utils/notify';

interface CreateLeadFormProps {
    onLeadCreated: () => void;
}

export function CreateLeadForm({ onLeadCreated }: CreateLeadFormProps) {
    const form = useForm({
        initialValues: {
            name: '', email: '', phone: '', company: '',
            source: 'OTHER', status: 'NEW',
            estimated_value: null as number | null,
            next_follow_up: null as Date | null,
        },
        validate: {
            name: (value) => value.trim() ? null : 'Name is required',
            email: (value) => /^\S+@\S+\.\S+$/.test(value) ? null : 'Valid email required',
            phone: (value) => /^[\+]?[\d\s\-\(\)]{7,15}$/.test(value.trim()) ? null : 'Valid phone number required',
            company: (value) => value.trim() ? null : 'Company is required',
            estimated_value: (value) => value === null || value >= 0 ? null : 'Value must be positive',
            next_follow_up: (value) => {
                if (!value) return null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selected = new Date(value);
                selected.setHours(0, 0, 0, 0);
                return selected >= today ? null : 'Next follow-up cannot be in the past';
            },
        },
    });

    
    const handleSubmit = async (values: typeof form.values) => {
        const res = await fetch('http://localhost:8000/leads/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone.trim(),
                company: values.company.trim(),
                next_follow_up: values.next_follow_up
                    ? new Date(values.next_follow_up).toISOString().split('T')[0]
                    : null,
            }),
        });

        if (!res.ok) {
            notify({
                title: 'Error',
                message: 'Failed to create lead. Please try again.',
                color: 'red',
            });
            return;
        }

        onLeadCreated();
        modals.closeAll();
        notify({
            title: 'Lead created',
            message: 'The lead was successfully added.',
            color: 'green',
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
                <DatePickerInput label="Next Follow-Up" {...form.getInputProps('next_follow_up')} />
                <Button type="submit">Create</Button>
            </Stack>
        </form>
    );
}