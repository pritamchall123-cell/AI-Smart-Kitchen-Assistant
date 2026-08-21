// src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import {
  ChefHat,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { login, setCredentials } from "../redux/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
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
  // HANDLE LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await dispatch(login(formData)).unwrap();

      navigate("/");
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // HANDLE GOOGLE LOGIN
  // =========================================================

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      const data = response.data;

      dispatch(
        setCredentials({
          user: {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            isEmailVerified: data.isEmailVerified,
            avatar: data.avatar,
          },
          token: data.token,
        })
      );

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF9F6]">

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE — BRANDING
        ====================================================== */}

        <section className="relative hidden overflow-hidden bg-[#1C1917] lg:flex">

          {/* Decorative circles */}

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

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

            {/* Main message */}

            <div className="max-w-lg">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-orange-300">

                <Sparkles size={15} />

                Welcome back

              </div>

              <h1 className="text-5xl font-black leading-tight tracking-tight text-white xl:text-6xl">

                Your kitchen

                <span className="block text-orange-500">
                  remembers you.
                </span>

              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-[#A8A29E]">

                Pick up where you left off. Discover recipes,
                manage your pantry, plan your meals and let AI
                help you cook something amazing.

              </p>

              {/* Features */}

              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-orange-400">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      AI-powered recipes
                    </p>

                    <p className="text-xs text-[#78716C]">
                      Personalized ideas for you
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-green-400">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Your kitchen, organized
                    </p>

                    <p className="text-xs text-[#78716C]">
                      Pantry, meals and groceries in one place
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Bottom */}

            <p className="text-xs text-[#57534E]">
              © {new Date().getFullYear()} AI Smart Kitchen
            </p>

          </div>

        </section>

        {/* =====================================================
            RIGHT SIDE — LOGIN FORM
        ====================================================== */}

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">

          <div className="w-full max-w-md">

            {/* Mobile logo */}

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
                Welcome back
              </p>

              <h2 className="text-3xl font-black tracking-tight text-[#1C1917]">
                Sign in to your kitchen
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#78716C]">
                Access your recipes, pantry and personalized
                cooking experience.
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

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#44403C]"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Forgot password?
                  </Link>

                </div>

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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-[#D6D3D1] bg-white py-3.5 pl-11 pr-12 text-sm text-[#292524] outline-none transition placeholder:text-[#A8A29E] focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A29E] transition hover:text-[#44403C]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={17} />
                  </>
                )}

              </button>

            </form>

            {/* Divider */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-[#E7E5E4]" />

              <span className="text-xs text-[#A8A29E]">
                New to AI Smart Kitchen?
              </span>

              <div className="h-px flex-1 bg-[#E7E5E4]" />

            </div>

            {/* Google Sign-In */}

            <div className="mb-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed. Please try again.")}
              />
            </div>

            {/* Register */}

            <Link
              to="/register"
              className="flex w-full items-center justify-center rounded-xl border border-[#D6D3D1] bg-white px-5 py-3.5 text-sm font-bold text-[#44403C] transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
            >
              Create an account
            </Link>

            <p className="mt-6 text-center text-xs leading-5 text-[#A8A29E]">
              By continuing, you agree to our Terms of Service
              and Privacy Policy.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Login;