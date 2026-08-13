import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiMessageCircle,
} from "react-icons/fi";

import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // =========================================
  // FORM CHANGE
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="contact-page">
      {/* =========================================
          HERO
      ========================================== */}

      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-label">GET IN TOUCH</span>

          <h1>
            We'd love to
            <br />
            <span>hear from you.</span>
          </h1>

          <p>
            Have a question, suggestion or need help with your order? Our team
            is here to help.
          </p>
        </div>

        <div className="contact-hero-icon">💬</div>
      </section>

      {/* =========================================
          CONTACT CONTENT
      ========================================== */}

      <section className="contact-content">
        {/* =======================================
            INFORMATION
        ======================================== */}

        <div className="contact-info">
          <div className="contact-heading">
            <span>CONTACT US</span>

            <h2>Let's talk.</h2>

            <p>
              Reach out to us through any of the options below. We'll be happy
              to help.
            </p>
          </div>

          {/* EMAIL */}

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <FiMail />
            </div>

            <div>
              <span>Email</span>

              <h3>support@freshmart.com</h3>

              <p>Send us an email anytime.</p>
            </div>
          </div>

          {/* PHONE */}

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <FiPhone />
            </div>

            <div>
              <span>Phone</span>

              <h3>+91 98765 43210</h3>

              <p>Mon - Sat, 9 AM - 7 PM</p>
            </div>
          </div>

          {/* LOCATION */}

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <FiMapPin />
            </div>

            <div>
              <span>Location</span>

              <h3>FreshMart Store</h3>

              <p>Your local fresh grocery destination.</p>
            </div>
          </div>

          {/* HOURS */}

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <FiClock />
            </div>

            <div>
              <span>Working Hours</span>

              <h3>9:00 AM - 7:00 PM</h3>

              <p>Monday to Saturday</p>
            </div>
          </div>
        </div>

        {/* =======================================
            FORM
        ======================================== */}

        <div className="contact-form-wrapper">
          <div className="contact-form-header">
            <div className="contact-form-header-icon">
              <FiMessageCircle />
            </div>

            <div>
              <h2>Send us a message</h2>

              <p>Fill out the form and we'll get back to you soon.</p>
            </div>
          </div>

          {/* SUCCESS */}

          {submitted && (
            <div className="contact-success">
              <span>✓</span>

              <div>
                <strong>Message sent successfully!</strong>

                <p>Thanks for reaching out to FreshMart.</p>
              </div>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            {/* NAME */}

            <div className="contact-form-group">
              <label htmlFor="contact-name">Full Name</label>

              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}

            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="contact-email">Email Address</label>

                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PHONE */}

              <div className="contact-form-group">
                <label htmlFor="contact-phone">Phone Number</label>

                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* MESSAGE */}

            <div className="contact-form-group">
              <label htmlFor="contact-message">Message</label>

              <textarea
                id="contact-message"
                name="message"
                rows="6"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* SUBMIT */}

            <button type="submit" className="contact-submit-btn">
              Send Message
              <FiSend />
            </button>
          </form>
        </div>
      </section>

      {/* =========================================
          QUICK HELP
      ========================================== */}

      <section className="contact-help">
        <div className="contact-help-icon">🛒</div>

        <div className="contact-help-content">
          <span>NEED QUICK HELP?</span>

          <h2>Looking for something specific?</h2>

          <p>Explore our products or check out our latest offers.</p>
        </div>

        <a href="mailto:support@freshmart.com" className="contact-help-btn">
          Contact Support
          <FiMail />
        </a>
      </section>
    </div>
  );
}

export default Contact;
