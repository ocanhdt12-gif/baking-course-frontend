import React from 'react';
import './Footer.scss';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page_footer ds">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <h4>About Muka</h4>
            <p>Learn the art of baking with our expert-led online courses. Master recipes from beginners to advanced.</p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#" className="social-link" aria-label="Facebook">
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <i className="fa fa-twitter"></i>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <i className="fa fa-instagram"></i>
              </a>
              <a href="#" className="social-link" aria-label="Pinterest">
                <i className="fa fa-pinterest"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h4>Newsletter</h4>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      <div className="page_copyright ls">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p>&copy; {currentYear} Muka. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-right">
              <p>
                <a href="/privacy">Privacy Policy</a> | 
                <a href="/terms">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
