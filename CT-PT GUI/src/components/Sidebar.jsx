import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import logo from "../../public/assets/images/dhule-logo.png"
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
   const { user } = useAuth();
  const location = useLocation();
  const { isSidebarOpen } = useSidebar();

  const getNavLinks = () => {
    const allLinks = {
      supervisor: [
        { path: "/supervisor-complaint-list", icon: 'bi-envelope-paper', label: 'Complaints' },
        { path: "/application-list", icon: "bi-file-earmark-text", label: 'Applications'}
      ],
      sanitary: [
        { path: "/all-complaint", icon: "bi-file-earmark-text", label: 'Pending Complaint'},
        { path: "/resolved-complaint", icon: "bi-file-earmark-text", label: 'Resolved Complaint'},
        { path: "/application-list-sanitary", icon: "bi-file-earmark-text", label: 'Applications'},
      ]
    };

    if (user?.designation === "Supervisor") {
      return allLinks.supervisor;
    } else if (user?.designation === "Sanitary Inspector") {
      return allLinks.sanitary;
    }
    return [];
  };

  const navLinks = getNavLinks();

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
