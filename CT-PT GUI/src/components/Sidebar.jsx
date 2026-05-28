import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import logo from "../../public/assets/images/dhule-logo.png"

export default function Sidebar() {
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();

  const navLinks = [
    // { path: '/', icon: 'bi-speedometer2', label: 'Dashboard' },
    // { path: '/users', icon: 'bi-people', label: 'Users' },
    // { path: '/add-user', icon: 'bi-person-plus', label: 'Add User' },
    // { path: '/profile', icon: 'bi-person-badge', label: 'Profile' },
    // { path: '/charts', icon: 'bi-bar-chart-line', label: 'Charts' },
    // { path: '/tables', icon: 'bi-table', label: 'Tables' },
    // { path: '/forms', icon: 'bi-ui-checks-grid', label: 'Forms' },
    // { path: '/components', icon: 'bi-grid-3x3-gap', label: 'Components' },
    // { path: '/alerts', icon: 'bi-exclamation-triangle', label: 'Alerts' },
    // { path: '/modals', icon: 'bi-window-stack', label: 'Modals' },
    // { path: '/settings', icon: 'bi-gear', label: 'Settings' },
    // { path: '/blank', icon: 'bi-file-earmark', label: 'Blank Page' },
    { path: "/complaint-list", icon: 'bi-envelope-paper', label: 'Complaints' },
    { path: "/application-list", icon: "bi-file-earmark-text", label: 'Applications'}
  ];

  return (
    <aside 
      className="admin-sidebar" 
      id="adminSidebar" 
      aria-label="Main navigation"
      style={{
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.2s ease'
      }}
    >
      <div className="sidebar-header">
        {/* <Link to="/" className="brand-mark" aria-label="adminHMD dashboard">
          <span className="brand-icon"><i className="bi bi-grid-1x2-fill" aria-hidden="true"></i></span>
          <span className="brand-copy">
            <span className="brand-title">adminHMD</span>
            <span className="brand-subtitle">Admin Template</span>
          </span>
        </Link> */}
        <img src={logo} alt="Dhule Municipal Corporation Logo" className='m-auto' />

      </div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            aria-current={location.pathname === link.path ? 'page' : undefined}
          >
            <span className="nav-icon"><i className={`bi ${link.icon}`} aria-hidden="true"></i></span>
            <span className="nav-text">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* <div className="sidebar-user">
        <img className="avatar-img avatar-md sidebar-user-avatar" src="/assets/images/avatar/avatar.jpg" alt="Admin Hasan" />
        <strong>Admin Hasan</strong>
        <small>Active Workspace</small>
      </div> */}

      {/* <div className="sidebar-footer">
        <span className="status-dot"></span>
        <span className="sidebar-footer-text">System running smoothly</span>
      </div> */}
    </aside>
  );
}
