import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { COMPANY_INFO } from "../config/constants";

/**
 * Modern Footer Component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-4 pb-2 mt-auto">
      <Container>
        {/* Main Footer Content */}
        <Row className="g-3 pb-3">
          {/* Brand & Description */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center mb-2">
              <FaGraduationCap
                size={28}
                style={{ color: "#ffffff" }}
                className="me-2"
              />
              <h5
                className="mb-0 fw-bold text-white"
                style={{ fontSize: "1.2rem" }}
              >
                {COMPANY_INFO.name}
              </h5>
            </div>
            <p
              className="text-white-50 mb-2"
              style={{ fontSize: "13px", lineHeight: "1.6" }}
            >
              {COMPANY_INFO.tagline}
            </p>
            <div className="d-flex gap-2">
              {Object.entries(COMPANY_INFO.socialMedia).map(
                ([platform, url]) => {
                  const iconMap = {
                    facebook: FaFacebook,
                    twitter: FaTwitter,
                    linkedin: FaLinkedin,
                    instagram: FaInstagram,
                    youtube: FaYoutube,
                    github: FaGithub,
                  };
                  const Icon = iconMap[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                    >
                      <Icon size={16} />
                    </a>
                  );
                }
              )}
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h6
              className="fw-bold mb-2 text-white"
              style={{ fontSize: "14px" }}
            >
              Quick Links
            </h6>
            <ul
              className="list-unstyled footer-links"
              style={{ fontSize: "13px" }}
            >
              <li className="mb-1">
                <Link
                  to="/"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Home
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/about"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  About Us
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/courses"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Courses
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/dashboard"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Dashboard
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/login"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Login
                </Link>
              </li>
            </ul>
          </Col>

          {/* Categories */}
          <Col lg={2} md={6}>
            <h6
              className="fw-bold mb-2 text-white"
              style={{ fontSize: "14px" }}
            >
              Categories
            </h6>
            <ul
              className="list-unstyled footer-links"
              style={{ fontSize: "13px" }}
            >
              <li className="mb-1">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Web Development
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Data Science
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  AI & ML
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Mobile Dev
                </a>
              </li>
              <li className="mb-1">
                <a
                  href="#"
                  className="text-white-50 text-decoration-none hover-link"
                >
                  Business
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={4} md={6}>
            <h6
              className="fw-bold mb-2 text-white"
              style={{ fontSize: "14px" }}
            >
              Contact Us
            </h6>
            <ul className="list-unstyled" style={{ fontSize: "13px" }}>
              <li className="mb-1 d-flex align-items-start">
                <FaMapMarkerAlt
                  className="me-2 mt-1"
                  style={{ color: "#8b5cf6" }}
                />
                <span className="text-white-50">{COMPANY_INFO.address}</span>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <FaEnvelope className="me-2" style={{ color: "#8b5cf6" }} />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-white-50 text-decoration-none hover-link"
                >
                  {COMPANY_INFO.email}
                </a>
              </li>
              <li className="mb-1 d-flex align-items-center">
                <FaPhone className="me-2" style={{ color: "#8b5cf6" }} />
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="text-white-50 text-decoration-none hover-link"
                >
                  {COMPANY_INFO.phone}
                </a>
              </li>
            </ul>
          </Col>
        </Row>

        <hr
          className="my-2"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        />

        {/* Bottom Footer */}
        <Row>
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0 text-white-50" style={{ fontSize: "12px" }}>
              © {currentYear} Premium LMS. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0 text-white-50" style={{ fontSize: "12px" }}>
              Built with ❤️ using React, Node.js & MongoDB
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
