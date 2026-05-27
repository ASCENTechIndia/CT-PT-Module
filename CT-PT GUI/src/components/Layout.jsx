import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { useSidebar } from '../context/SidebarContext';

export default function Layout({ children }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="admin-shell">
      <Sidebar />
      <div 
        className="admin-main"
        style={{
          marginLeft: isSidebarOpen ? 'var(--sidebar-width)' : '0',
          transition: 'margin-left 0.2s ease'
        }}
      >
        <Navbar />
        <main className="dashboard-content">
          <div className="container-fluid px-3 px-lg-4 py-4">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
