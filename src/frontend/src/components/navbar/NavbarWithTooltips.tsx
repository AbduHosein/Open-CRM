import {
    IconUsers,
    IconUserSearch,
    IconHome2,
    IconGauge,
    IconLogout,
    IconShield,
} from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from "./NavbarWithTooltips.module.css";

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton
                onClick={onClick}
                className={styles['nav-link']}
                data-active={active || undefined}
                aria-label={label}
            >
                <Icon size={25} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const navLinks = [
    { icon: IconHome2, label: 'Home', path: '/home' },
    { icon: IconUsers, label: 'Clients', path: '/clients' },
    { icon: IconGauge, label: 'Projects', path: '/projects' },
    { icon: IconUserSearch, label: 'Leads', path: '/leads' },
];

export function NavbarWithTooltips() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = navLinks.map((link) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={location.pathname === link.path}
            onClick={() => navigate(link.path)}
        />
    ));

    return (
        <nav className={styles.navbar}>
            <Center>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7h20L12 2z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                </svg>
            </Center>
            <div className={styles.navbarMain}>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>
            <Stack justify="center" gap={0}>
                {user?.is_staff && (
                    <NavbarLink icon={IconShield} label="User Management" onClick={() => navigate('/admin/approvals')} />
                )}
                <NavbarLink icon={IconLogout} label="Logout" onClick={handleLogout} />
            </Stack>
        </nav>
    );
}