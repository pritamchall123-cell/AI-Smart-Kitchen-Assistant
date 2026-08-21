// src/pages/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  ArrowRight,
  ChefHat,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Sparkles,
  Check,
} from "lucide-react";

import { register } from "../redux/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // PASSWORD VALIDATION
  // =========================================================

  const passwordChecks = {
    length: formData.password.length >= 6,
    number: /\d/.test(formData.password),
    letter: /[a-zA-Z]/.test(formData.password),
  };

  // =========================================================
  // HANDLE REGISTER
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please create a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await dispatch(register(formData)).unwrap();

      navigate("/");
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF9F6]">
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#1C1917] lg:flex">

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}

            <Link
              to="/"
              className="inline-flex w-fit items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white">
                <ChefHat size={23} />
              </div>

              <div>
                <p className="font-black tracking-tight text-white">
                  AI Smart Kitchen
                </p>

                <p className="text-xs text-[#A8A29E]">
                  Cook smarter. Eat better.
                </p>
              </div>
            </Link>

            {/* Main Content */}

            <div className="max-w-lg">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-orange-300">
                <Sparkles size={15} />
                Start your kitchen journey
              </div>

              <h1 className="text-5xl font-black leading-tight tracking-tight text-white xl:text-6xl">
                Make every meal

                <span className="block text-orange-500">
                  worth remembering.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-[#A8A29E]">
                Create your free account and unlock a smarter
                way to discover, plan and cook your favorite
                meals.
              </p>

              {/* Benefits */}

              <div className="mt-10 space-y-5">

                {[
                  "Personalized recipe recommendations",
                  "Smart pantry and grocery management",
                  "AI-powered recipe generation",
                  "Weekly meal planning",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                      <Check size={15} />
                    </div>

                    <span className="text-sm text-[#D6D3D1]">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

            </div>

            <p className="text-xs text-[#57534E]">
              © {new Date().getFullYear()} AI Smart Kitchen
            </p>

          </div>

        </section>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}

            <Link
              to="/"
              className="mb-10 flex items-center justify-center gap-3 lg:hidden"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white">
                <ChefHat size={23} />
              </div>

              <div className="text-left">
                <p className="font-black text-[#1C1917]">
                  AI Smart Kitchen
                </p>

                <p className="text-xs text-[#A8A29E]">
                  Cook smarter. Eat better.
                </p>
              </div>
            </Link>

            {/* Heading */}

            <div className="mb-8">

              <p className="mb-2 text-sm font-bold uppercase tracking-wider text-orange-600">
                Get started
              </p>

              <h2 className="text-3xl font-black tracking-tight text-[#1C1917]">
                Create your kitchen
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#78716C]">
                Join AI Smart Kitchen and start cooking smarter.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#44403C]"
                >
                  Full name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#D6D3D1] bg-white py-3.5 pl-11 pr-4 text-sm text-[#292524] outline-none transition placeholder:text-[#A8A29E] focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#44403C]"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#D6D3D1] bg-white py-3.5 pl-11 pr-4 text-sm text-[#292524] outline-none transition placeholder:text-[#A8A29E] focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#44403C]"
                >
                  Create password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#D6D3D1] bg-white py-3.5 pl-11 pr-12 text-sm text-[#292524] outline-none transition placeholder:text-[#A8A29E] focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A29E] transition hover:text-[#44403C]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

                {/* Password requirements */}

                <div className="mt-3 grid grid-cols-3 gap-2">

                  <PasswordCheck
                    valid={passwordChecks.length}
                    text="6+ chars"
                  />

                  <PasswordCheck
                    valid={passwordChecks.letter}
                    text="Letter"
                  />

                  <PasswordCheck
                    valid={passwordChecks.number}
                    text="Number"
                  />

                </div>

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EA580C] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/10 transition hover:bg-[#C2410C] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </form>

            {/* Login */}

            <div className="mt-7 text-center">

              <p className="text-sm text-[#78716C]">
                Already have an account?

                <Link
                  to="/login"
                  className="ml-1 font-bold text-orange-600 hover:text-orange-700"
                >
                  Sign in
                </Link>
              </p>

            </div>

            <p className="mt-6 text-center text-xs leading-5 text-[#A8A29E]">
              By creating an account, you agree to our Terms of
              Service and Privacy Policy.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}

/* =========================================================
   PASSWORD CHECK COMPONENT
========================================================= */

function PasswordCheck({ valid, text }) {
  return (
    <div
      className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-medium transition ${
        valid
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-[#E7E5E4] bg-white text-[#A8A29E]"
      }`}
    >
      <Check size={12} />
      {text}
    </div>
  );
}

export default Register;