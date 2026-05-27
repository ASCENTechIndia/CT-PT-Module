import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Login() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div>
      <button 
        className="icon-button theme-toggle auth-theme-toggle" 
        type="button" 
        onClick={toggleTheme}
        aria-label="Switch color theme" 
        title="Switch color theme"
      >
        <i className={`bi ${isDarkMode ? 'bi-brightness-high' : 'bi-moon-stars'}`}></i>
      </button>
      <main className="auth-page">
        <section className="auth-card">
          <Link className="auth-brand" to="/"><span className="brand-icon"><i className="bi bi-grid-1x2-fill" aria-hidden="true"></i></span><span><strong>adminHMD</strong><small>Sign in to your admin workspace.</small></span></Link>
          <div className="auth-visual"><img src="/assets/images/png/dasher-ui-bootstrap-5.jpg" alt="adminHMD dashboard interface" /></div>
          <form className="needs-validation" noValidate>
            <div className="mb-4">
              <p className="eyebrow mb-1">Secure Access</p>
              <h1 className="h3 mb-1">Login</h1>
              <p className="text-muted mb-0">Sign in to your admin workspace.</p>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="loginEmail">Email address</label>
              <input className="form-control" id="loginEmail" type="email" required />
              <div className="invalid-feedback">Enter a valid email.</div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label" htmlFor="loginPassword">Password</label>
                <Link className="small fw-semibold" to="/forgot-password">Forgot?</Link>
              </div>
              <input className="form-control" id="loginPassword" type="password" minLength="6" required />
              <div className="invalid-feedback">Password must be at least 6 characters.</div>
            </div>
            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <button className="btn btn-primary w-100" type="submit"><i className="bi bi-box-arrow-in-right" aria-hidden="true"></i> Sign In</button>
          </form>
          
          <div className="auth-footer">New here? <Link to="/register">Create an account</Link></div>
        </section>
      </main>
    </div>
  );
}
