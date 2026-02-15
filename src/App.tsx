import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Login } from "./pages/Login";
import { Register } from "./pages/Register"; 
import { Dashboard } from './pages/Dashboard';
import { NavBar } from './layout/NavBar';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const location = useLocation();

  const hideNavBarPaths = ["/login", "/users"];
  const showNavBar = !hideNavBarPaths.includes(location.pathname);

  return (
    <>
      {showNavBar && <NavBar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;