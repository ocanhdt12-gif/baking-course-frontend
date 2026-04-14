import React, { useState, useEffect } from 'react';
import { getTimetables, submitEnrollment } from '../../services/api';
import { useLocation } from 'react-router-dom';

const HomeContacts = () => {
  const [sessions, setSessions] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const explicitSession = searchParams.get('session');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    classSessionId: explicitSession || '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  useEffect(() => {
    getTimetables()
      .then(data => {
        setSessions(data);
        if (data.length > 0 && !formData.classSessionId) {
          setFormData(prev => ({ ...prev, classSessionId: data[0].id }));
        }
      })
      .catch(err => console.error("Failed to load timetables for enrollment dropdown", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });
    try {
      await submitEnrollment(formData);
      setStatus({ loading: false, error: null, success: true });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        classSessionId: sessions.length > 0 ? sessions[0].id : '',
        message: ''
      });
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, error: 'Registration failed. Please try again.', success: false });
    }
  };

  return (
    <section className="ls s-py-40 s-py-lg-130 contact-form main-from s-overlay" id="contacts">
      <div className="container">
        <div className="divider-25"></div>
        <div className="row">
          <div className="col-12 text-center">
            <div className="section-heading">
              <h6 className="small-text color-main2">please register now!</h6>
              <h3>Our Form for Enrollment</h3>
              <img className="image-wrap" src={`${import.meta.env.BASE_URL}images/icon-main.png`} alt=""/>
            </div>
            <div className="d-none d-lg-block divider-60"></div>
          </div>
        </div>
        
        {status.success && (
          <div className="alert alert-success text-center mb-4" role="alert">
            Thank you! Your enrollment request has been submitted. We will contact you soon.
          </div>
        )}
        
        {status.error && (
          <div className="alert alert-danger text-center mb-4" role="alert">
            {status.error}
          </div>
        )}

        <form className="custom-react-form c-mb-10 c-mb-md-20 c-gutter-20" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-3">
              <div className="form-group has-placeholder">
                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="form-control"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group has-placeholder">
                <label htmlFor="email">Email address <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group has-placeholder">
                <label htmlFor="phone">Phone <span className="required">*</span></label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="form-control"
                  placeholder="Phone Number (e.g. 0912345678)"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-3">
              <div className="form-group has-placeholder">
                <label htmlFor="classSessionId">Cooking Class <span className="required">*</span></label>
                <select
                  className="form-control"
                  name="classSessionId"
                  id="classSessionId"
                  value={formData.classSessionId}
                  onChange={handleChange}
                  required
                >
                  {sessions.length === 0 && <option value="">Loading classes...</option>}
                  {sessions.map(sess => (
                    <option key={sess.id} value={sess.id}>
                      {sess.program?.title} ({sess.dayOfWeek} • {sess.startDate ? new Date(sess.startDate).toLocaleDateString() : 'TBA'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row c-mt-10">
            <div className="col-sm-12">
              <div className="form-group text-center mt-3">
                <button type="submit" className="btn btn-maincolor2" disabled={status.loading}>
                  {status.loading ? 'Submitting...' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="divider-30"></div>
      </div>
    </section>
  );
};

export default HomeContacts;
