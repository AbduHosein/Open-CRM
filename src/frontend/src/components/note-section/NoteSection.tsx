import { useEffect, useState } from 'react';
import { Stack, Textarea, Button, Group, Text, Divider } from '@mantine/core';
import { notify } from '../../utils/notify';
import { modals } from '@mantine/modals';

interface Note {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
}

type EntityType = 'lead' | 'client' | 'project';

interface NoteSectionProps {
    entityType: EntityType;
    entityId: number;
}

function getCookie(name: string): string | undefined {
    return document.cookie.split(';').map(c => c.trim())
        .find(c => c.startsWith(name + '='))?.split('=')[1];
}

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export function NoteSection({ entityType, entityId }: NoteSectionProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [editValues, setEditValues] = useState<Record<number, string>>({});
    const [newContent, setNewContent] = useState('');
    const [adding, setAdding] = useState(false);

    const fetchNotes = () => {
        fetch(`http://localhost:8000/notes/?${entityType}=${entityId}`)
            .then(r => r.json())
            .then((data: Note[]) => {
                setNotes(data);
                const vals: Record<number, string> = {};
                data.forEach(n => { vals[n.id] = n.content; });
                setEditValues(vals);
            });
    };

    useEffect(() => { fetchNotes(); }, [entityType, entityId]);

    const handleSave = async (id: number) => {
        const res = await fetch(`http://localhost:8000/notes/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') ?? '' },
            body: JSON.stringify({ content: editValues[id] }),
        });
        if (!res.ok) {
            notify({ title: 'Error', message: 'Failed to save note.', color: 'red' });
            return;
        }
        notify({ title: 'Saved', message: 'Note updated.', color: 'green' });
        fetchNotes();
    };

    const handleBlurSave = async (id: number) => {
        const original = notes.find(n => n.id === id)?.content;
        if (editValues[id] === original) return; // no change, skip

        const res = await fetch(`http://localhost:8000/notes/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') ?? '' },
            body: JSON.stringify({ content: editValues[id] }),
        });
        if (!res.ok) {
            notify({ title: 'Error', message: 'Failed to save note.', color: 'red' });
            return;
        }
        fetchNotes();
    };

    const handleDelete = (id: number) => {
        modals.openConfirmModal({
            title: 'Delete Note',
            children: 'Are you sure you want to delete this note?',
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                const res = await fetch(`http://localhost:8000/notes/${id}/`, {
                    method: 'DELETE',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') ?? '' },
                });
                if (!res.ok) {
                    notify({ title: 'Error', message: 'Failed to delete note.', color: 'red' });
                    return;
                }
                notify({ title: 'Deleted', message: 'Note removed.', color: 'green' });
                fetchNotes();
            },
        });
    };

    const handleAdd = async () => {
        if (!newContent.trim()) return;
        const res = await fetch('http://localhost:8000/notes/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken') ?? '' },
            body: JSON.stringify({ content: newContent.trim(), [entityType]: entityId }),
        });
        if (!res.ok) {
            notify({ title: 'Error', message: 'Failed to add note.', color: 'red' });
            return;
        }
        setNewContent('');
        setAdding(false);
        fetchNotes();
    };

    return (
        <Stack mt="md">
            <Divider label="Notes" labelPosition="left" />

            {notes.length === 0 && !adding && (
                <Text fz="sm" c="dimmed">No notes yet.</Text>
            )}

            {notes.map(note => (
                <Stack key={note.id} gap={4}>
                    <Text fz="xs" c="dimmed">{formatDate(note.created_at)}</Text>
                    <Textarea
                        value={editValues[note.id] ?? ''}
                        onChange={e => {
                            const val = e.target.value;
                            setEditValues(prev => ({ ...prev, [note.id]: val }));
                        }}
                        onBlur={() => handleBlurSave(note.id)}
                        autosize
                        minRows={2}
                    />
                    <Button size="xs" variant="subtle" color="red" onClick={() => handleDelete(note.id)}>
                        Delete
                    </Button>
                </Stack>
            ))}

            {adding ? (
                <Stack gap={4}>
                    <Textarea
                        placeholder="New note..."
                        value={newContent}
                        onChange={e => setNewContent(e.currentTarget.value)}
                        autosize
                        minRows={2}
                    />
                    <Group gap="xs">
                        <Button size="xs" onClick={handleAdd}>Add</Button>
                        <Button size="xs" variant="subtle" onClick={() => { setAdding(false); setNewContent(''); }}>Cancel</Button>
                    </Group>
                </Stack>
            ) : (
                <Button size="xs" variant="light" onClick={() => setAdding(true)}>+ Add Note</Button>
            )}
        </Stack>
    );
}