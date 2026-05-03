import { useEffect, useState } from 'react'
import {
    Avatar,
    Badge,
    Button,
    Card,
    Group,
    Loader,
    Stack,
    Text,
    Title,
    Divider,
} from '@mantine/core'
import {
    IconCheck,
    IconX,
    IconShieldCheck,
    IconUsers,
    IconTrash,
    IconShieldUp,
    IconShieldOff,
    IconUserOff,
} from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import api from '../api/axiosInstance'
import styles from '../styles/ApprovalsPage.module.css'
import { useAuth } from '../context/AuthContext'

interface PendingUser {
    id: number
    email: string
    name: string
    picture: string
    requested_at: string
}

interface AllUser {
    id: number
    email: string
    name: string
    picture: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED'
    is_staff: boolean
    requested_at: string
}

export function ApprovalsPage() {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
    const [allUsers, setAllUsers] = useState<AllUser[]>([])
    const [loadingPending, setLoadingPending] = useState(true)
    const [loadingAll, setLoadingAll] = useState(true)
    const [actionLoading, setActionLoading] = useState<number | null>(null)
    const { user: currentUser } = useAuth()

    const fetchPending = async (silent = false) => {
        if (!silent) setLoadingPending(true)
        try {
            const res = await api.get('/api/auth/users/pending/')
            setPendingUsers(res.data)
        } finally {
            if (!silent) setLoadingPending(false)
        }
    }

    const fetchAll = async () => {
        setLoadingAll(true)
        try {
            const res = await api.get('/api/auth/users/all/')
            setAllUsers(res.data)
        } finally {
            setLoadingAll(false)
        }
    }

    useEffect(() => {
        fetchPending()
        fetchAll()

        const interval = setInterval(() => fetchPending(true), 15000)
        const onFocus = () => fetchPending(true)
        window.addEventListener('focus', onFocus)

        return () => {
            clearInterval(interval)
            window.removeEventListener('focus', onFocus)
        }
    }, [])

    const handleApprove = async (email: string, id: number) => {
        await handleAction(email, id, 'approve')
    }

    const handleReject = async (email: string, id: number) => {
        await handleAction(email, id, 'reject')
    }

    const handleAction = async (email: string, id: number, action: string) => {
        if (action === 'delete') {
            modals.openConfirmModal({
                title: 'Delete User',
                children: `Are you sure you want to delete ${email}? This cannot be undone.`,
                labels: { confirm: 'Delete', cancel: 'Cancel' },
                confirmProps: { color: 'red' },
                onConfirm: async () => {
                    setActionLoading(id)
                    try {
                        await api.post('/api/auth/users/update/', { email, action })
                        setAllUsers(prev => prev.filter(u => u.id !== id))
                    } finally {
                        setActionLoading(null)
                    }
                },
            })
            return
        }

        setActionLoading(id)
        try {
            await api.post('/api/auth/users/update/', { email, action })
            fetchAll()
            fetchPending()
        } finally {
            setActionLoading(null)
        }
    }

    const getInitials = (name: string) =>
        name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })

    const statusStyle = (status: string) => {
        if (status === 'APPROVED') return { background: 'rgba(176, 215, 255, 0.15)', color: 'var(--color-blue-light)' }
        if (status === 'REJECTED') return { background: 'rgba(255, 100, 100, 0.15)', color: '#ff8080' }
        if (status === 'REVOKED') return { background: 'rgba(255, 100, 100, 0.15)', color: '#ff8080' }
        return { background: 'rgba(255, 200, 100, 0.15)', color: '#ffc864' }
    }

    return (
        <Stack gap="xl" p="md">

            {/* ── Pending Approvals ─────────────────────── */}
            <Group justify="space-between" align="flex-end">
                <Group gap="sm" align="center">
                    <IconShieldCheck size={28} style={{ color: 'var(--color-blue-light)' }} />
                    <div>
                        <Text className={styles.sectionHeader}>Admin</Text>
                        <Title order={2} style={{ color: 'var(--bg-primary)', lineHeight: 1.1 }}>
                            Pending Approvals
                        </Title>
                    </div>
                </Group>
                <Badge size="lg" style={{ background: 'var(--bg-active)', color: 'var(--text-on-active)', fontWeight: 600 }}>
                    {pendingUsers.length} pending
                </Badge>
            </Group>

            <Divider style={{ borderColor: 'var(--border-color)', opacity: 0.3 }} />

            {loadingPending ? (
                <Group justify="center" mt="md">
                    <Loader color="icyBlue" type="bars" />
                </Group>
            ) : pendingUsers.length === 0 ? (
                <Card className={styles.card} radius="md" p="xl">
                    <Stack align="center" gap="xs">
                        <IconShieldCheck size={32} style={{ color: 'var(--color-blue-light)', opacity: 0.4 }} />
                        <Text className={styles.emptyText} fw={600} size="lg">No pending requests</Text>
                        <Text className={styles.emptySubtext} size="xs">New access requests will appear here</Text>
                    </Stack>
                </Card>
            ) : (
                <Stack gap="sm">
                    {pendingUsers.map(user => (
                        <Card key={user.id} className={styles.card} radius="md" p="lg">
                            <Group justify="space-between" align="center">
                                <Group gap="md">
                                    <Avatar className={styles.avatar} src={user.picture || undefined} radius="xl" size={48}>
                                        {!user.picture && getInitials(user.name || user.email)}
                                    </Avatar>
                                    <div>
                                        <Text fw={600} className={styles.name}>{user.name || 'No name provided'}</Text>
                                        <Text className={styles.email}>{user.email}</Text>
                                        <Text className={styles.date} mt={2}>Requested {formatDate(user.requested_at)}</Text>
                                    </div>
                                </Group>
                                <Group gap="sm">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        leftSection={<IconX size={14} />}
                                        loading={actionLoading === user.id}
                                        onClick={() => handleReject(user.email, user.id)}
                                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        leftSection={<IconCheck size={14} />}
                                        loading={actionLoading === user.id}
                                        onClick={() => handleApprove(user.email, user.id)}
                                        style={{ background: 'var(--bg-active)', color: 'var(--text-on-active)', border: 'none' }}
                                    >
                                        Approve
                                    </Button>
                                </Group>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}

            {/* ── User Management ───────────────────────── */}
            <Group gap="sm" align="center" mt="md">
                <IconUsers size={28} style={{ color: 'var(--color-blue-light)' }} />
                <div>
                    <Text className={styles.sectionHeader}>Admin</Text>
                    <Title order={2} style={{ color: 'var(--bg-primary)', lineHeight: 1.1 }}>
                        User Management
                    </Title>
                </div>
            </Group>

            <Divider style={{ borderColor: 'var(--border-color)', opacity: 0.3 }} />

            {loadingAll ? (
                <Group justify="center" mt="md">
                    <Loader color="icyBlue" type="bars" />
                </Group>
            ) : (
                <Stack gap="sm">
                    {allUsers.filter(u => u.status !== 'PENDING').map(user => (
                        <Card key={user.id} className={styles.card} radius="md" p="lg">
                            <Group justify="space-between" align="center">
                                <Group gap="md">
                                    <Avatar className={styles.avatar} src={user.picture || undefined} radius="xl" size={48}>
                                        {!user.picture && getInitials(user.name || user.email)}
                                    </Avatar>
                                    <div>
                                        <Group gap="xs" align="center">
                                            <Text fw={600} className={styles.name}>
                                                {user.name || 'No name provided'}
                                            </Text>
                                            {user.is_staff && (
                                                <Badge size="xs" style={{ background: 'rgba(176, 215, 255, 0.2)', color: 'var(--color-blue-light)' }}>
                                                    Admin
                                                </Badge>
                                            )}
                                        </Group>
                                        <Text className={styles.email}>{user.email}</Text>
                                        <Group gap="xs" mt={2}>
                                            <Badge size="xs" style={statusStyle(user.status)}>
                                                {user.status}
                                            </Badge>
                                            <Text className={styles.date}>
                                                Since {formatDate(user.requested_at)}
                                            </Text>
                                        </Group>
                                    </div>
                                </Group>
                                <Group gap="xs">
                                    {user.status !== 'APPROVED' && (
                                        <Button
                                            size="xs"
                                            leftSection={<IconCheck size={12} />}
                                            loading={actionLoading === user.id}
                                            onClick={() => handleAction(user.email, user.id, 'approve')}
                                            style={{ background: 'var(--bg-active)', color: 'var(--text-on-active)', border: 'none' }}
                                        >
                                            Approve
                                        </Button>
                                    )}
                                    {user.status === 'APPROVED' && user.email !== currentUser?.email && (
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            leftSection={<IconUserOff size={12} />}
                                            loading={actionLoading === user.id}
                                            onClick={() => handleAction(user.email, user.id, 'revoke')}
                                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                        >
                                            Revoke
                                        </Button>
                                    )}
                                    {user.is_staff && user.email !== currentUser?.email ? (
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            leftSection={<IconShieldOff size={12} />}
                                            loading={actionLoading === user.id}
                                            onClick={() => handleAction(user.email, user.id, 'demote')}
                                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                        >
                                            Demote
                                        </Button>
                                    ) : !user.is_staff ? (
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            leftSection={<IconShieldUp size={12} />}
                                            loading={actionLoading === user.id}
                                            onClick={() => handleAction(user.email, user.id, 'promote')}
                                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                        >
                                            Promote
                                        </Button>
                                    ) : null}
                                    {user.email !== currentUser?.email && (
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            leftSection={<IconTrash size={12} />}
                                            loading={actionLoading === user.id}
                                            onClick={() => handleAction(user.email, user.id, 'delete')}
                                            style={{ borderColor: '#ff8080', color: '#ff8080' }}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </Group>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}
        </Stack>
    )
}