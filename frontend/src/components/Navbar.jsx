import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/auth";
import { FaUserCircle, FaGraduationCap } from "react-icons/fa";
import { COMPANY_INFO, NAV_LINKS } from "../config/constants";

/**
 * Modern Navigation Bar Component
 */
const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isInstructor, clearUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    clearUser();
    navigate("/");
  };

  return (
    <BSNavbar
      expand="lg"
      fixed="top"
      className={`modern-navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        {/* Brand Logo */}
        <BSNavbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center py-0"
        >
          <FaGraduationCap
            size={28}
            className="me-2"
            style={{ color: "var(--color-primary)" }}
          />
          <span
            className="fw-bold"
            style={{ fontSize: "1.3rem", color: "var(--color-primary)" }}
          >
            {COMPANY_INFO.name}
          </span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="navbar-nav" />

        <BSNavbar.Collapse id="navbar-nav">
          {/* Center Navigation */}
          <Nav className="mx-auto">
            {NAV_LINKS.public.map((link) => (
              <Nav.Link
                key={link.path}
                as={Link}
                to={link.path}
                className={location.pathname === link.path ? "active" : ""}
              >
                {link.label}
              </Nav.Link>
            ))}
            {isAuthenticated &&
              NAV_LINKS.authenticated.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  className={location.pathname === link.path ? "active" : ""}
                >
                  {link.label}
                </Nav.Link>
              ))}
            {isAdmin &&
              NAV_LINKS.admin.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  className={location.pathname === link.path ? "active" : ""}
                >
                  <span
                    className="badge bg-primary px-2 py-1"
                    style={{ fontSize: "12px" }}
                  >
                    {link.label}
                  </span>
                </Nav.Link>
              ))}
            {isInstructor &&
              !isAdmin &&
              NAV_LINKS.instructor.map((link) => (
                <Nav.Link
                  key={link.path}
                  as={Link}
                  to={link.path}
                  className={location.pathname === link.path ? "active" : ""}
                >
                  <span
                    className="badge bg-success px-2 py-1"
                    style={{ fontSize: "12px" }}
                  >
                    {link.label}
                  </span>
                </Nav.Link>
              ))}
          </Nav>

          {/* Right Side Auth Buttons */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <FaUserCircle size={18} className="me-2" />
                    <span style={{ fontSize: "13px" }}>{user?.name}</span>
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item
                  disabled
                  className="text-muted"
                  style={{ fontSize: "12px" }}
                >
                  {user?.email}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/dashboard">
                  My Dashboard
                </NavDropdown.Item>
                {isInstructor && (
                  <NavDropdown.Item as={Link} to="/instructor">
                    Instructor Dashboard
                  </NavDropdown.Item>
                )}
                {isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin">
                    Admin Panel
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item as={Link} to="/my-payments">
                  Payment History
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  className="px-3 py-1"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    borderWidth: "2px",
                  }}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="px-3 py-1"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
