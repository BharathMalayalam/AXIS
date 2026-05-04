import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [queries, setQueries] = useState([]);
  const [issues, setIssues] = useState([]);

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const h = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
      const [uRes, pRes, mRes, qRes] = await Promise.all([
        fetch(`${API_URL}/users`, { headers: h }),
        fetch(`${API_URL}/projects`, { headers: h }),
        fetch(`${API_URL}/modules`, { headers: h }),
        fetch(`${API_URL}/queries`, { headers: h }),
      ]);
      const [uData, pData, mData, qData] = await Promise.all([
        uRes.json(), pRes.json(), mRes.json(), qRes.json()
      ]);
      if (uData.success) setUsers(uData.users || []);
      if (pData.success) setProjects(pData.projects || []);
      if (mData.success) setModules(mData.modules || []);
      if (qData.success) setQueries(qData.queries || []);

      // Fetch issues for developer
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user?.role === 'developer') {
        const iRes = await fetch(`${API_URL}/issues/my-issues`, { headers: h });
        const iData = await iRes.json();
        if (iData.success) setIssues(iData.issues || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
    else {
      setUsers([]); setProjects([]); setModules([]); setQueries([]); setIssues([]);
    }
  }, [token, fetchData]);

  // --- Auth ---
  const login = async (userId, password, role) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, role })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setToken(data.token);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Cannot connect to server. Is the backend running?' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setToken(null);
    setCurrentUser(null);
  };

  // --- Users ---
  const getUsersByRole = (role) => users.filter(u => u.role === role);
  const getUserById = (id) => users.find(u => u._id === id || u.id === id);

  const addUser = async (userData) => {
    try {
      const endpoint = userData.role === 'teamleader' ? 'create-tl' : 'create-dev';
      const res = await fetch(`${API_URL}/users/${endpoint}`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) { await fetchData(); return { success: true }; }
      return { success: false, error: data.error };
    } catch { return { success: false, error: 'Failed to add user.' }; }
  };

  const deleteUser = async (id) => {
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE', headers: getHeaders() });
    await fetchData();
  };

  // --- Projects ---
  const addProject = async (data) => {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
    });
    const result = await res.json();
    await fetchData();
    return result;
  };

  const updateProject = async (id, patch) => {
    await fetch(`${API_URL}/projects/${id}`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify(patch)
    });
    await fetchData();
  };

  const deleteProject = async (id) => {
    await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE', headers: getHeaders() });
    await fetchData();
  };

  const approveProject = async (id) => {
    await fetch(`${API_URL}/projects/${id}/approve`, { method: 'PATCH', headers: getHeaders() });
    await fetchData();
  };

  const rejectProject = async (id, reason) => {
    await fetch(`${API_URL}/projects/${id}/reject`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ reason })
    });
    await fetchData();
  };

  // --- Modules ---
  const addModule = async (data) => {
    await fetch(`${API_URL}/modules`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
    });
    await fetchData();
  };

  const submitModule = async (id, file) => {
    const options = { method: 'PATCH' };
    
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      options.body = formData;
      options.headers = { 'Authorization': `Bearer ${token}` };
    } else {
      options.headers = getHeaders();
    }
    
    await fetch(`${API_URL}/modules/${id}/submit`, options);
    await fetchData();
  };

  const approveModule = async (id) => {
    await fetch(`${API_URL}/modules/${id}/approve`, { method: 'PATCH', headers: getHeaders() });
    await fetchData();
  };

  const rejectModule = async (id, description) => {
    await fetch(`${API_URL}/modules/${id}/reject`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ description })
    });
    await fetchData();
  };

  // --- Queries ---
  const addQuery = async (data) => {
    await fetch(`${API_URL}/queries`, {
      method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
    });
    await fetchData();
  };

  const replyQuery = async (id, reply) => {
    await fetch(`${API_URL}/queries/${id}/reply`, {
      method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ reply })
    });
    await fetchData();
  };

  // --- Dashboard Stats (live from backend) ---
  const getAdminStats = async () => {
    const res = await fetch(`${API_URL}/projects/dashboard/admin`, { headers: getHeaders() });
    const data = await res.json();
    return data.stats || {};
  };

  const getTLStats = async () => {
    const res = await fetch(`${API_URL}/modules/dashboard/tl`, { headers: getHeaders() });
    const data = await res.json();
    return data.stats || {};
  };

  const getDevStats = async () => {
    const res = await fetch(`${API_URL}/modules/dashboard/dev`, { headers: getHeaders() });
    const data = await res.json();
    return data.stats || {};
  };

  const value = {
    currentUser, login, logout, fetchData,
    users, getUsersByRole, getUserById, addUser, deleteUser,
    projects, addProject, updateProject, deleteProject, approveProject, rejectProject,
    modules, addModule, submitModule, approveModule, rejectModule,
    queries, addQuery, replyQuery,
    issues,
    getAdminStats, getTLStats, getDevStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
