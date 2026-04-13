import React, { useState } from 'react';
import { submitContact } from '../../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });
    try {
      await submitContact(formData);
      setStatus({ loading: false, error: null, success: true });
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, error: 'Failed to send message. Please try again.', success: false });
    }
  };

  return (
    <div className="col-lg-8 animate" data-animation="scaleAppear">
      {status.success && (
        <div className="alert alert-success mb-4" role="alert">
          Your message has been sent successfully. We will get back to you soon!
        </div>
      )}
      {status.error && (
        <div className="alert alert-danger mb-4" role="alert">
          {status.error}
        </div>
      )}

      <form className="custom-react-form c-mb-20 c-gutter-20" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-12">
            <h4 className="small-margin">Contact Form</h4>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group has-placeholder">
              <label htmlFor="fullName">Full Name<span className="required">*</span></label>
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
          <div className="col-sm-6">
            <div className="form-group has-placeholder">
              <label htmlFor="email">Email address<span className="required">*</span></label>
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
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="form-group has-placeholder">
              <label htmlFor="phone">Phone <span style={{color:'#999', fontWeight:400}}>(Optional)</span></label>
              <input
                type="text"
                name="phone"
                id="phone"
                className="form-control"
                placeholder="Phone Number (Optional)"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group has-placeholder">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                className="form-control"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="form-group has-placeholder">
              <label htmlFor="message">Message<span className="required">*</span></label>
              <textarea
                rows="6"
                cols="45"
                name="message"
                id="message"
                className="form-control"
                placeholder="Your Message..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="divider-10 d-none d-xl-block"></div>
          <div className="col-sm-12">
            <div className="form-group has-placeholder">
              <button type="submit" className="btn btn-maincolor" disabled={status.loading}>
                {status.loading ? 'Sending...' : 'Send Now'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
