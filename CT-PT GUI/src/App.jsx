import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';

// Pages
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import AddUser from './pages/AddUser';
import UserDetails from './pages/UserDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Forms from './pages/Forms';
import Tables from './pages/Tables';
import Charts from './pages/Charts';
import Components from './pages/Components';
import Alerts from './pages/Alerts';
import Modals from './pages/Modals';
import Blank from './pages/Blank';
import CreateAgent from './pages/CreateAgent';
import FrmCitizen from "./pages/citizen/FrmCitizen";

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Error Pages
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';

function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Main Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/components" element={<Components />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/modals" element={<Modals />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/create-agent" element={<CreateAgent />} />
            <Route path="/citizen" element={<FrmCitizen />} />

            {/* Error Routes */}
            <Route path="/500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
