import { NavbarWithTooltips } from './navbar/NavbarWithTooltips.tsx';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <NavbarWithTooltips />
      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;