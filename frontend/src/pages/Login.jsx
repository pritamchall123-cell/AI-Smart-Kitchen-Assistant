// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";

function Login() {
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await loginUser(formData);

    dispatch(
      setCredentials({
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          isEmailVerified: data.isEmailVerified,
        },
        token: data.token,
      })
    );

    navigate("/");
  } catch (err) {
    const message = err.response?.data?.message || "Login failed. Please try again.";
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome Back
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your password"
            />
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition disabled:bg-green-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;