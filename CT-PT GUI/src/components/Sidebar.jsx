import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import logo from "../../public/assets/images/dhule-logo.png";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const getNavLinks = () => {
    const allLinks = {
      supervisor: [
        {
          path: "/supervisor-complaint-list",
          icon: "bi-envelope-paper",
          label: "Complaints",
        },
        {
          path: "/application-list",
          icon: "bi-file-earmark-text",
          label: "Applications",
        },
        {
          path: "/fine-list",
          icon: "bi-file-earmark-text",
          label: "Fine Report",
        },
      ],
      sanitary: [
        {
          path: "/all-complaint",
          icon: "bi-file-earmark-text",
          label: "Pending Complaint",
        },
        {
          path: "/resolved-complaint",
          icon: "bi-file-earmark-text",
          label: "Resolved Complaint",
        },
        {
          path: "/application-list-sanitary",
          icon: "bi-file-earmark-text",
          label: "Applications",
        },
        {
          path: "/fine-list",
          icon: "bi-file-earmark-text",
          label: "Fine Report",
        },
      ],
    };

    if (user?.designation === "Supervisor") return allLinks.supervisor;
    if (user?.designation === "Sanitary Inspector") return allLinks.sanitary;
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <aside
      className="admin-sidebar"
      id="adminSidebar"
      aria-label="Main navigation"
      style={{
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.2s ease",
      }}
    >
      <div className="sidebar-header">
        <img
          src={logo}
          alt="Dhule Municipal Corporation Logo"
          className="m-auto d-lg-block d-none"
        />
      </div>

      <nav className="sidebar-nav mt-lg-0 mt-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            aria-current={location.pathname === link.path ? "page" : undefined}
            onClick={() => {
              if (window.innerWidth < 992) toggleSidebar();
            }}
          >
            <span className="nav-icon">
              <i className={`bi ${link.icon}`} aria-hidden="true"></i>
            </span>
            <span className="nav-text">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
