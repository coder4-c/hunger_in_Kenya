import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Hunger in Kenya</h3>
            <p>Creating lasting change through sustainable solutions and community empowerment.</p>
            <div className="social-links">
              <button aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </button>
              <button aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </button>
              <button aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </button>
              <button aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </button>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about-crisis">About the Crisis</Link></li>
              <li><Link to="/our-solutions">Our Solutions</Link></li>
              <li><Link to="/how-to-help">How to Help</Link></li>
              <li><Link to="/impact-stories">Impact Stories</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Get Involved</h4>
            <ul>
              <li><Link to="/get-involved">Volunteer</Link></li>
              <li><Link to="/donation">Donate</Link></li>
              <li><Link to="/contact">Partner with Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p><i className="fas fa-envelope"></i> info@hungerinkenya.org</p>
              <p><i className="fas fa-phone"></i> +254 700 123 456</p>
              <p><i className="fas fa-map-marker-alt"></i> Nairobi, Kenya</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Hunger in Kenya Initiative. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;