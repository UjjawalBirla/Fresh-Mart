import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
} from "react-icons/fi";

import { useAuth } from "../../contexts/AuthContext";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const { signup, loading } = useAuth();

  // =========================================
  // STATES
  // =========================================

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================
  // SIGN UP
  // =========================================

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");

    // =======================================
    // CLEAN DATA
    // =======================================

    const cleanName = name.trim();

    const cleanEmail = email.trim();

    // =======================================
    // VALIDATION
    // =======================================

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (cleanName.length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      // =====================================
      // CREATE USER
      // =====================================

      const result = await signup(cleanName, cleanEmail, password);

      // =====================================
      // SIGNUP FAILED
      // =====================================

      if (!result?.success) {
        setError(result?.error || "Unable to create account.");

        return;
      }

      // =====================================
      // SIGNUP SUCCESS
      // =====================================

      navigate("/", {
        replace: true,
      });
    } catch (signupError) {
      console.error("Signup Page Error:", signupError);

      setError("Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  const submitting = loading || isSubmitting;

  // =========================================
  // UI
  // =========================================

  return (
    <div className="signup-page">
      {/* =====================================
          SIGNUP CARD
      ====================================== */}

      <div className="signup-card">
        {/* ===================================
            LOGO
        ==================================== */}

        <div className="signup-logo">
          <div className="signup-logo-icon">🍃</div>

          <div>
            <h1>FreshMart</h1>

            <span>Fresh groceries. Fresh life.</span>
          </div>
        </div>

        {/* ===================================
            HEADING
        ==================================== */}

        <div className="signup-heading">
          <h2>Create Account 🛒</h2>

          <p>Sign up to start shopping fresh products.</p>
        </div>

        {/* ===================================
            ERROR
        ==================================== */}

        {error && <div className="signup-error">{error}</div>}

        {/* ===================================
            FORM
        ==================================== */}

        <form className="signup-form" onSubmit={handleSignup}>
          {/* =================================
              NAME
          ================================== */}

          <div className="signup-field">
            <label htmlFor="signup-name">Full Name</label>

            <div className="signup-input">
              <FiUser />

              <input
                id="signup-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                disabled={submitting}
              />
            </div>
          </div>

          {/* =================================
              EMAIL
          ================================== */}

          <div className="signup-field">
            <label htmlFor="signup-email">Email Address</label>

            <div className="signup-input">
              <FiMail />

              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={submitting}
              />
            </div>
          </div>

          {/* =================================
              PASSWORD
          ================================== */}

          <div className="signup-field">
            <label htmlFor="signup-password">Password</label>

            <div className="signup-input">
              <FiLock />

              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                disabled={submitting}
              />

              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                disabled={submitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* =================================
              CONFIRM PASSWORD
          ================================== */}

          <div className="signup-field">
            <label htmlFor="signup-confirm-password">Confirm Password</label>

            <div className="signup-input">
              <FiLock />

              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                disabled={submitting}
              />

              <button
                type="button"
                className="signup-password-toggle"
                onClick={() => setShowConfirmPassword((current) => !current)}
                disabled={submitting}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* =================================
              SIGNUP BUTTON
          ================================== */}

          <button type="submit" className="signup-button" disabled={submitting}>
            {submitting ? (
              <>
                <span className="signup-spinner"></span>
                Creating account...
              </>
            ) : (
              <>
                <FiUserPlus />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* ===================================
            LOGIN LINK
        ==================================== */}

        <div className="signup-login-link">
          <span>Already have an account?</span>

          <Link to="/login">Login</Link>
        </div>

        {/* ===================================
            FOOTER
        ==================================== */}

        <div className="signup-footer">
          <span>Secure account powered by Firebase</span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
