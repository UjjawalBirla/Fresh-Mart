import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

import { useAuth } from "../../contexts/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const { login, loading } = useAuth();

  // =========================================
  // STATES
  // =========================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================
  // LOGIN
  // =========================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    // =======================================
    // VALIDATION
    // =======================================

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      // =====================================
      // FIREBASE LOGIN
      // =====================================

      const result = await login(cleanEmail, password);

      // =====================================
      // LOGIN FAILED
      // =====================================

      if (!result?.success) {
        setError(result?.error || "Unable to login. Please try again.");

        return;
      }

      // =====================================
      // GET ROLE
      // =====================================

      const loggedInUser = result.user;

      const role = loggedInUser?.role;

      // =====================================
      // ADMIN
      // =====================================

      if (role === "admin") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }

      // =====================================
      // USER
      // =====================================

      navigate("/", {
        replace: true,
      });
    } catch (loginError) {
      console.error("Login Page Error:", loginError);

      setError("Unable to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================
  // PASSWORD TOGGLE
  // =========================================

  const togglePassword = () => {
    setShowPassword((current) => !current);
  };

  // =========================================
  // LOADING
  // =========================================

  const submitting = loading || isSubmitting;

  // =========================================
  // UI
  // =========================================

  return (
    <div className="login-page">
      {/* =====================================
          LOGIN CARD
      ====================================== */}

      <div className="login-card">
        {/* ===================================
            LOGO
        ==================================== */}

        <div className="login-logo">
          <div className="login-logo-icon">🍃</div>

          <div>
            <h1>FreshMart</h1>

            <span>Fresh groceries. Fresh life.</span>
          </div>
        </div>

        {/* ===================================
            HEADING
        ==================================== */}

        <div className="login-heading">
          <h2>Welcome Back 👋</h2>

          <p>Login to continue shopping fresh products.</p>
        </div>

        {/* ===================================
            ERROR
        ==================================== */}

        {error && <div className="login-error">{error}</div>}

        {/* ===================================
            FORM
        ==================================== */}

        <form className="login-form" onSubmit={handleLogin}>
          {/* =================================
              EMAIL
          ================================== */}

          <div className="login-field">
            <label htmlFor="login-email">Email Address</label>

            <div className="login-input">
              <FiMail />

              <input
                id="login-email"
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

          <div className="login-field">
            <label htmlFor="login-password">Password</label>

            <div className="login-input">
              <FiLock />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={submitting}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
                disabled={submitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* =================================
              LOGIN BUTTON
          ================================== */}

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? (
              <>
                <span className="login-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn />
                Login
              </>
            )}
          </button>
        </form>

        {/* ===================================
            SIGNUP LINK
        ==================================== */}

        <div className="login-signup-link">
          <span>Don't have an account?</span>

          <Link to="/signup">Create Account</Link>
        </div>

        {/* ===================================
            FOOTER
        ==================================== */}

        <div className="login-footer">
          <span>Secure login powered by Firebase</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
