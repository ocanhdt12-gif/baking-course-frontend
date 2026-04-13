import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/Shared/PageTitle';
import { loginUser, registerUser, getMe } from '../services/api';
import { ROUTES } from '../constants/routes';

const Auth = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [regForm, setRegForm] = useState({ fullName: '', email: '', password: '' });
  const [regError, setRegError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setCheckingAuth(false); return; }
    getMe()
      .then(user => {
        if (user.role === 'ADMIN') navigate(ROUTES.ADMIN, { replace: true });
        else navigate(ROUTES.MY_ACCOUNT, { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('token');
        setCheckingAuth(false);
      });
  }, [navigate]);

  const onLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  const onRegChange = (e) => setRegForm({ ...regForm, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const data = await loginUser(loginForm);
      localStorage.setItem('token', data.token);
      if (data.user.role === 'ADMIN') navigate(ROUTES.ADMIN);
      else navigate(ROUTES.MY_ACCOUNT);
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    try {
      const data = await registerUser(regForm);
      localStorage.setItem('token', data.token);
      navigate(ROUTES.MY_ACCOUNT);
    } catch (err) {
      setRegError(err.response?.data?.error || 'Registration failed. Please check your information.');
    }
  };

  if (checkingAuth) {
    return (
      <div className="text-center" style={{ padding: '150px 0' }}>
        <h2>Checking session...</h2>
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <PageTitle 
        title="Authentication"
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Auth' }]}
      />
      <section className="ls s-py-60 s-py-lg-130">
        <div className="container">
          <div className="row c-gutter-60">
            {/* Login Form */}
            <div className="col-lg-6 mb-5 mb-lg-0 animate" data-animation="fadeInUp">
              <h4 className="mb-4">Login to your account</h4>
              {loginError && <div className="alert alert-danger" role="alert">{loginError}</div>}
              <form className="custom-react-form" onSubmit={handleLogin}>
                <div className="form-group has-placeholder">
                  <label htmlFor="login-email">Email address <span className="required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    id="login-email"
                    className="form-control"
                    placeholder="Email Address"
                    value={loginForm.email}
                    onChange={onLoginChange}
                    required
                  />
                </div>
                <div className="form-group has-placeholder">
                  <label htmlFor="login-password">Password <span className="required">*</span></label>
                  <input
                    type="password"
                    name="password"
                    id="login-password"
                    className="form-control"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={onLoginChange}
                    required
                  />
                </div>
                <div className="form-group mb-0 mt-4">
                  <button type="submit" className="btn btn-maincolor">Login</button>
                </div>
              </form>
            </div>

            {/* Register Form */}
            <div className="col-lg-6 animate" data-animation="fadeInUp">
              <h4 className="mb-4">Create a new account</h4>
              {regError && <div className="alert alert-danger" role="alert">{regError}</div>}
              <form className="custom-react-form" onSubmit={handleRegister}>
                <div className="form-group has-placeholder">
                  <label htmlFor="reg-name">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    id="reg-name"
                    className="form-control"
                    placeholder="Full Name"
                    value={regForm.fullName}
                    onChange={onRegChange}
                    required
                  />
                </div>
                <div className="form-group has-placeholder">
                  <label htmlFor="reg-email">Email address <span className="required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    id="reg-email"
                    className="form-control"
                    placeholder="Email Address"
                    value={regForm.email}
                    onChange={onRegChange}
                    required
                  />
                </div>
                <div className="form-group has-placeholder">
                  <label htmlFor="reg-password">Password <span className="required">*</span></label>
                  <input
                    type="password"
                    name="password"
                    id="reg-password"
                    className="form-control"
                    placeholder="Password"
                    value={regForm.password}
                    onChange={onRegChange}
                    required
                    minLength="6"
                  />
                </div>
                <div className="form-group mb-0 mt-4">
                  <button type="submit" className="btn btn-maincolor2">Register Now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Auth;
