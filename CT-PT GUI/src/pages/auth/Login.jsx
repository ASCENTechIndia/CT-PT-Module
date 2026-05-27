import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Email and password are required.');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }

      // Simulate API call (replace with actual API)
      // In a real app, you would call your backend API here
      const userData = {
        id: Math.random().toString(36).substring(7),
        email,
        name: email.split('@')[0],
        rememberMe,
        loginTime: new Date().toISOString(),
      };

      // Call login to update auth context and store in localStorage
      login(userData);

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <main className="auth-page">
        <section className="auth-card">
          <Link className="auth-brand" to="/"><span className="brand-icon"><i className="bi bi-grid-1x2-fill" aria-hidden="true"></i></span><span><strong>adminHMD</strong><small>Sign in to your admin workspace.</small></span></Link>
        <form className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="mb-4">
              <h1 className="h3 mb-1">Login</h1>
              <p className="text-muted mb-0">Sign in to your admin workspace.</p>
            </div>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="loginEmail">Email address</label>
              <input
                className="form-control"
                id="loginEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="invalid-feedback">Enter a valid email.</div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label" htmlFor="loginPassword">Password</label>
                <Link className="small fw-semibold" to="/forgot-password">Forgot?</Link>
              </div>
              <input
                className="form-control"
                id="loginPassword"
                type="password"
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="invalid-feedback">Password must be at least 6 characters.</div>
            </div>
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
              <i className="bi bi-box-arrow-in-right" aria-hidden="true"></i> {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="auth-footer">New here? <Link to="/register">Create an account</Link></div>
        </section>
      </main>
    </div>
  );
}
