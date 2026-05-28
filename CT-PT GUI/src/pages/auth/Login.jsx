import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import apiClient from '../../services/apiClient';
import logo from "../../../public/assets/images/dhule-logo.png";
import GetIPAddress from '../../utils/IpHelper';
import config from '../../utils/config';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    // console.log(values);
    // e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!values.userId || !values.password) {
        setError('User ID and password are required.');
        setIsLoading(false);
        return;
      }

      // if (values.password.length < 8) {
      //   setError('Password must be at least 8 characters.');
      //   setIsLoading(false);
      //   return;
      // }
      const ipAddress = await GetIPAddress();
      const payload = {
        "userId": values.userId,
        "password": values.password,
        "macaddr": config.macAddress,
        "ipaddr": ipAddress,
        "hostname": config.hostName,
        "source": config.source
      };



      // Simulate API call (replace with actual API)
      const response = await apiClient.post(`/auth/login`, payload);

      if (response.success) {
        const userData = response?.data?.user;
        login(userData);
        reset();
        navigate("/");
      } else {
        setError('Login failed. Please try again.');
      }
      // return;
      // In a real app, you would call your backend API here
      // const userData = {
      //   id: Math.random().toString(36).substring(7),
      //   email,
      //   name: email.split('@')[0],
      //   rememberMe,
      //   loginTime: new Date().toISOString(),
      // };

      // // Call login to update auth context and store in localStorage
      // login(userData);

      // Redirect to dashboard
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
          <div className="auth-brand">
            <img src={logo} alt="Dhule Municipal Corporation Logo" className='m-auto' />
            {/* <span className="brand-icon"> */}
            {/* <i className="bi bi-grid-1x2-fill" aria-hidden="true"></i> */}
            {/* </span> */}
            {/* <span><strong>adminHMD</strong><small>Sign in to your admin workspace.</small></span> */}
          </div>
          <form
            className="needs-validation"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-4">
              <h1 className="h3 mb-1">Login</h1>
              <p className="text-muted mb-0">
                Sign in to your admin workspace.
              </p>
            </div>

            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            {/* User ID */}
            <div className="mb-3">
              <label className="form-label" htmlFor="UserID">
                User ID
              </label>

              <input
                className={`form-control ${errors.userId ? "is-invalid" : ""
                  }`}
                id="UserID"
                type="text"
                // inputMode="numeric"
                maxLength={10}
                // onInput={(e) => {
                //   e.target.value = e.target.value.replace(/[^0-9]/g, "");
                // }}
                {...register("userId", {
                  required: "User ID is required",
                  // pattern: {
                  //   value: /^[0-9]+$/,
                  //   message: "User ID must be numeric only",
                  // },
                })}
              />

              {errors.userId && (
                <div className="invalid-feedback">
                  {errors.userId.message}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label" htmlFor="loginPassword">
                  Password
                </label>
              </div>

              <input
                className={`form-control ${errors.password ? "is-invalid" : ""
                  }`}
                id="loginPassword"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  // minLength: {
                  //   value: 8,
                  //   message: "Password must be at least 8 characters",
                  // },
                })}
              />

              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={isLoading}
            >
              <i
                className="bi bi-box-arrow-in-right"
                aria-hidden="true"
              ></i>{" "}
              {isLoading ? "Logging In..." : "Log In"}
            </button>
          </form>

          {/* <div className="auth-footer">New here? <Link to="/register">Create an account</Link></div> */}
        </section>
      </main>
    </div>
  );
}
