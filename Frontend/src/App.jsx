import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageTeamLeaders from './pages/admin/ManageTeamLeaders';
import ManageTeamMembers from './pages/admin/ManageTeamMembers';
import AdminApproval from './pages/admin/AdminApproval';

import TLDashboard from './pages/teamleader/TLDashboard';
import TLProjects from './pages/teamleader/TLProjects';
import TLModules from './pages/teamleader/TLModules';
import TLReview from './pages/teamleader/TLReview';

import DevDashboard from './pages/developer/DevDashboard';
import DevModules from './pages/developer/DevModules';
import QueryPage from './pages/developer/QueryPage';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function ProtectedLayout({ allowedRoles, children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  const userRole = currentUser.role?.toLowerCase();
  if (!allowedRoles.map(r => r.toLowerCase()).includes(userRole)) return <Navigate to="/" replace />;
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { currentUser } = useApp();

  const defaultPath = currentUser
    ? currentUser.role?.toLowerCase() === 'admin' ? '/admin'
    : currentUser.role?.toLowerCase() === 'teamleader' ? '/tl'
    : '/dev'
    : '/';

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={currentUser ? <Navigate to={defaultPath} /> : <LoginPage />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedLayout allowedRoles={['admin']}><AdminDashboard /></ProtectedLayout>} />
        <Route path="/admin/projects" element={<ProtectedLayout allowedRoles={['admin']}><ManageProjects /></ProtectedLayout>} />
        <Route path="/admin/team-leaders" element={<ProtectedLayout allowedRoles={['admin']}><ManageTeamLeaders /></ProtectedLayout>} />
        <Route path="/admin/team-members" element={<ProtectedLayout allowedRoles={['admin']}><ManageTeamMembers /></ProtectedLayout>} />
        <Route path="/admin/approval" element={<ProtectedLayout allowedRoles={['admin']}><AdminApproval /></ProtectedLayout>} />

        {/* Team Leader */}
        <Route path="/tl" element={<ProtectedLayout allowedRoles={['teamleader']}><TLDashboard /></ProtectedLayout>} />
        <Route path="/tl/projects" element={<ProtectedLayout allowedRoles={['teamleader']}><TLProjects /></ProtectedLayout>} />
        <Route path="/tl/modules" element={<ProtectedLayout allowedRoles={['teamleader']}><TLModules /></ProtectedLayout>} />
        <Route path="/tl/review" element={<ProtectedLayout allowedRoles={['teamleader']}><TLReview /></ProtectedLayout>} />
        <Route path="/tl/queries" element={<ProtectedLayout allowedRoles={['teamleader']}><QueryPage /></ProtectedLayout>} />

        {/* Developer */}
        <Route path="/dev" element={<ProtectedLayout allowedRoles={['developer']}><DevDashboard /></ProtectedLayout>} />
        <Route path="/dev/modules" element={<ProtectedLayout allowedRoles={['developer']}><DevModules /></ProtectedLayout>} />
        <Route path="/dev/queries" element={<ProtectedLayout allowedRoles={['developer']}><QueryPage /></ProtectedLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
