import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage';
import ProjectsPage from './pages/ProjectsPage';
import HomePage from './pages/HomePage.tsx';
import LeadsPage from './pages/LeadsPage.tsx';
import { PendingPage } from './pages/PendingPage.tsx';
import { ApprovalsPage } from './pages/ApprovalsPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

function RootRedirect() {
  const status = localStorage.getItem('auth_status')
  const user = localStorage.getItem('user')
  if (status === 'pending') return <Navigate to="/pending" replace />
  if (user) return <Navigate to="/home" replace />
  return <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/admin/approvals" element={<ApprovalsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;