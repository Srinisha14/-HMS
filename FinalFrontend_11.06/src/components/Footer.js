import React from 'react';
import './css/Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-contact">
        <h4>Contact Us</h4>
          <p>📍 123 Health Street, Sholinganallur, Chennai</p>
          <p>📞 +91 98765 43210 | hms@hospital.com</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/doctors">Doctors</a></li>
            <li><a href="/patients">Patients</a></li>
            <li><a href="/appointments">Appointments</a></li>
          </ul>
        </div>

        <div className="footer-about">
          <h4>About HMS</h4>
          <p>HMS (Hospital Management System) is dedicated to providing efficient and secure healthcare services through digital innovation.</p>
        </div>

        <div className="social-icons">
          <h4>Follow Us</h4>
          <a href="https://www.facebook.com/login" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://www.instagram.com/accounts/login/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://twitter.com/login" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://www.linkedin.com/login" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HMS Healthcare. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
