import React, { Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard as DashboardIcon, Folder, Timer as TimerIcon, Assignment as ToDoIcon, Event as CalendarIcon, Settings } from '@mui/icons-material';
import Dashboard from './Dashboard';
import Schedule from './Schedule';
import FolderApp from './FolderApp';
import NoteApp from './NoteApp';
import TimerSetup from './Timer/TimerSetup';
import TimerRunning from './Timer/TimerRunning';
import ToDoList from './ToDoList';
/* eslint-disable no-unused-vars */
import Login from './Login';
import Register from './Register';
import SettingsPage from './Setting';
import PrivateRoute from './PrivateRoute';

const LandingPage = React.lazy(() => import('./LandingPage'));

// Define theme colors
const themeColors = {
  primary: "#EF476F",
  secondary: "#F78C6B",
  accent: "#FFD166",
  green: "#06D6A0",
  blue: "#118AB2",
  dark: "#073B4C"
};

// Component to render the sidebar item with dynamic active state
function SidebarItem({ to, icon, text, color }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <ListItem
      button
      component={Link}
      to={to}
      sx={{
        backgroundColor: isActive ? color : 'transparent',
        borderRadius: '15px',
        color: isActive ? 'white' : color,
        margin: '5px 10px', // Add horizontal margins to prevent touching the sidebar edges
        padding: '10px 15px', // Add padding for inner spacing
        width: 'calc(100% - 20px)', // Shrink the width slightly to match the margins
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <ListItemIcon sx={{ color: isActive ? 'white' : color }}>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
}

function App() {
  const location = useLocation();
  const isFullScreenPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  React.useEffect(() => {
    document.querySelector('link[rel="icon"]').href = '/ASSETS/noteably_logo.png';
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {!isFullScreenPage && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            '& .MuiDrawer-paper': { width: 240, backgroundColor: '#fff', color: '#000' },
          }}
        >
          <Box>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <img
                src="/ASSETS/noteably_logo.png"
                alt="Logo"
                style={{
                  width: '100%',
                  cursor: 'pointer',
                }}
              />
            </Link>
          </Box>
          <List>
            <SidebarItem to="/dashboard" icon={<DashboardIcon />} text="Dashboard" color={themeColors.primary} />
            <SidebarItem to="/folders" icon={<Folder />} text="Folders" color={themeColors.secondary} />
            <SidebarItem to="/todo" icon={<ToDoIcon />} text="To-Do List" color={themeColors.accent} />
            <SidebarItem to="/schedule" icon={<CalendarIcon />} text="Schedule" color={themeColors.green} />
            <SidebarItem to="/timer" icon={<TimerIcon />} text="Timer" color={themeColors.blue} />
            <SidebarItem to="/settings" icon={<Settings />} text="Settings" color={themeColors.dark} />
          </List>
        </Drawer>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f0f0f0' }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/folders" element={
              <PrivateRoute>
                <FolderApp />
              </PrivateRoute>
            } />
            <Route path="/todo" element={
              <PrivateRoute>
                <ToDoList />
              </PrivateRoute>
            } />
            <Route path="/schedule" element={
              <PrivateRoute>
                <Schedule />
              </PrivateRoute>
            } />
            <Route path="/timer" element={
              <PrivateRoute>
                <TimerSetup />
              </PrivateRoute>
            } />
            <Route path="/running" element={<TimerRunning />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/noteApp/:folderId" element={<NoteApp />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
}

export default App;
