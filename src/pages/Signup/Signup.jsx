import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiTruck,
  FiShield,
  FiAward,
} from "react-icons/fi";

import { useAuth } from "../../contexts/AuthContext";

function Signup() {
  const navigate = useNavigate();

  const { signup, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

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

      const result = await signup(cleanName, cleanEmail, password);

      if (!result?.success) {
        setError(result?.error || "Unable to create account.");
        return;
      }

      navigate("/", { replace: true });
    } catch (signupError) {
      console.error("Signup Page Error:", signupError);
      setError("Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitting = loading || isSubmitting;

  return (
    <div className="flex min-h-screen bg-market-cream dark:bg-slate-950">
      {/* Left panel — branding */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-market-leaf via-market-leaf-dark to-emerald-900" />

        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-market-lime/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-market-sun/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
              🍃
            </span>
            <div>
              <h1 className="font-display text-2xl font-black tracking-tight">FreshMart</h1>
              <p className="text-sm text-white/75">Fresh groceries. Fresh life.</p>
            </div>
          </div>

          <div className="space-y-6 animate-rise">
            <div>
              <p className="section-label text-market-lime">Join us today</p>
              <h2 className="mt-2 font-display text-4xl font-black leading-tight">
                Start your<br />fresh journey.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
                Create a free account to browse our catalog, track orders, and enjoy exclusive member deals on premium produce.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                { icon: <FiTruck />, text: "Free delivery on your first order" },
                { icon: <FiShield />, text: "Secure account powered by Firebase" },
                { icon: <FiAward />, text: "Member-only discounts & offers" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 text-market-lime">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/50">© {new Date().getFullYear()} FreshMart. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-10 sm:px-8 lg:w-1/2">
        <div className="card w-full max-w-md animate-rise p-8 sm:p-10">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-market-lime text-2xl shadow-sm">
              🍃
            </span>
            <div>
              <h1 className="font-display text-xl font-black text-slate-800 dark:text-white">FreshMart</h1>
              <span className="text-xs text-slate-500 dark:text-slate-400">Fresh groceries. Fresh life.</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
              Create Account 🛒
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign up to start shopping fresh products.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="space-y-2">
              <label htmlFor="signup-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="input-field">
                <FiUser className="shrink-0 text-market-leaf" />
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

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="input-field">
                <FiMail className="shrink-0 text-market-leaf" />
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

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="input-field">
                <FiLock className="shrink-0 text-market-leaf" />
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
                  className="btn-ghost h-8 w-8 shrink-0"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={submitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-confirm-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="input-field">
                <FiLock className="shrink-0 text-market-leaf" />
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
                  className="btn-ghost h-8 w-8 shrink-0"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  disabled={submitting}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="font-bold text-market-leaf transition hover:text-market-leaf-dark dark:text-market-lime dark:hover:text-white"
            >
              Login
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Secure account powered by Firebase
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
