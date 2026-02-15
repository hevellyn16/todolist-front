import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from './pages/Dashboard';
// import { NavBar } from './components/NavBar';

/*function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("@todo:token");
  return token ? children : <Navigate to="/login" />;
}  */

function App() {

  return (
    <>
    <BrowserRouter>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Register />} />

        <Route
          path="*"
          element={
            <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={
            <Navigate to="/login" />
          }
        />


          <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
