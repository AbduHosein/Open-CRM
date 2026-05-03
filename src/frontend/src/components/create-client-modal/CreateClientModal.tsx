import { Select, NumberInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState, useEffect } from 'react';
import { notify } from '../../utils/notify';

interface CreateClientFormProps {
    onClientCreated: () => void;
}

export function CreateClientForm({ onClientCreated }: CreateClientFormProps) {
    const form = useForm({
        initialValues: {
            lead: '',
            billing_cycle: '',
            payment_method: '',
            initial_quote: '',
            status: '',
            preferred_contact_method: '',
            next_follow_up: null as Date | null,
        },
        validate: {
            lead: (value) => (value ? null : 'Lead ID is required'),
            billing_cycle: (value) => value.trim() ? null : 'Billing cycle is required',
            payment_method: (value) => value.trim() ? null : 'Payment method is required',
            initial_quote: (value) => value ? null : 'Initial quote is required',
            status: (value) => value.trim() ? null : 'Status is required',
            preferred_contact_method: (value) => value.trim() ? null : 'Preferred contact method is required',
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
    const [leadOptionsData, setLeadOptionsData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/leads/')
            .then((response) => response.json())
            .then((json) => {
                // 1. Map data to { value: string, label: string }
                const formattedData = json.map((item: { id: { toString: () => any; }; name: any; }) => ({
                    value: item.id.toString(), // Select requires string values
                    label: item.name,          // User-friendly label
                }));
                setLeadOptionsData(formattedData);
            });
    }, []);


    const handleSubmit = async (values: typeof form.values) => {
        const res = await fetch('http://localhost:8000/clients/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
                message: 'Failed to create client. Please try again.',
                color: 'red',
            });
            return;
        }

        onClientCreated();
        modals.closeAll();
        notify({
            title: 'Client created',
            message: 'The client was successfully added.',
            color: 'green',
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
                <Button type="submit">Create</Button>
            </Stack>
        </form>
    );
}

function getCookie(name: string): string | undefined {
    return document.cookie.split(';').map(c => c.trim())
        .find(c => c.startsWith(name + '='))?.split('=')[1];
}