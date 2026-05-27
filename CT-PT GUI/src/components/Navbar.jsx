import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="navbar admin-navbar navbar-expand bg-white">
      <div className="container-fluid px-3 px-lg-4">
        <button 
          className="sidebar-toggle" 
          type="button" 
          onClick={toggleSidebar}
          aria-controls="adminSidebar" 
          aria-expanded="true" 
          aria-label="Toggle sidebar"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <form className="d-none d-md-flex ms-3 flex-grow-1" role="search">
          <input 
            className="form-control search-input" 
            type="search" 
            placeholder="Search users, orders, reports" 
            aria-label="Search"
          />
        </form>

        <div className="navbar-actions ms-auto">
          <button 
            className="icon-button theme-toggle" 
            type="button" 
            onClick={toggleTheme}
            aria-label="Switch color theme" 
            title="Switch color theme"
          >
            <i className={`bi ${isDarkMode ? 'bi-brightness-high' : 'bi-moon-stars'}`} aria-hidden="true"></i>
          </button>

          <div className="dropdown">
            <button 
              className="icon-button" 
              type="button" 
              onClick={() => setShowNotifications(!showNotifications)}
              aria-expanded={showNotifications} 
              aria-label="Notifications"
            >
              <span className="notification-dot"></span>
              <i className="bi bi-bell" aria-hidden="true"></i>
            </button>
            {showNotifications && (
              <div className="dropdown-menu dropdown-menu-end notification-menu show">
                <div className="dropdown-header fw-bold text-body">Notifications</div>
                <Link className="dropdown-item" to="/users" onClick={() => setShowNotifications(false)}>
                  <span className="notification-title">New user registered</span>
                  <span className="notification-time">4 minutes ago</span>
                </Link>
                <Link className="dropdown-item" to="/charts" onClick={() => setShowNotifications(false)}>
                  <span className="notification-title">Revenue target reached</span>
                  <span className="notification-time">32 minutes ago</span>
                </Link>
                <Link className="dropdown-item" to="/settings" onClick={() => setShowNotifications(false)}>
                  <span className="notification-title">Security review completed</span>
                  <span className="notification-time">1 hour ago</span>
                </Link>
              </div>
            )}
          </div>

          <div className="dropdown">
            <button 
              className="profile-button dropdown-toggle" 
              type="button" 
              onClick={() => setShowProfile(!showProfile)}
              aria-expanded={showProfile}
            >
              <img className="avatar-img avatar-sm" src="/assets/images/avatar/avatar.jpg" alt="Admin Hasan" />
              <span className="profile-name d-none d-sm-inline">Admin Hasan</span>
            </button>
            {showProfile && (
              <ul className="dropdown-menu dropdown-menu-end show">
                <li><Link className="dropdown-item" to="/profile" onClick={() => setShowProfile(false)}>Profile</Link></li>
                <li><Link className="dropdown-item" to="/settings" onClick={() => setShowProfile(false)}>Account settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/login" onClick={() => setShowProfile(false)}>Sign out</Link></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
