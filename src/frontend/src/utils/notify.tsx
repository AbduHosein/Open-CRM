import { notifications } from '@mantine/notifications';

type NotifyOptions = {
    title: string;
    message: string;
    color?: 'green' | 'red' | 'yellow';
};

const baseStyles = {
    root: {
        backgroundColor: 'var( --bg-primary)',
        border: '1px solid var(--border-color)',
    },
    title: { color: 'var(--text-primary)', fontWeight: 600 },
    description: { color: 'var(--text-secondary)' },
    closeButton: { color: 'var(--text-secondary)' },
};

export function notify({ title, message, color = 'green' }: NotifyOptions) {
    notifications.show({ title, message, color, styles: baseStyles });
}