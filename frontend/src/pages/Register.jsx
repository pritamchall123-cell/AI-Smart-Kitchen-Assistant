// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";


function Register() {
  // useState gives us a piece of "state" — data that, when changed,
  // automatically causes React to re-render the component with the new value.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // useNavigate lets us programmatically redirect the user (e.g., after successful registration)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // This single handler works for ALL input fields, using each input's "name" attribute
  // to know which piece of formData to update — avoids writing 3 separate handlers.
  const handleChange = (e) => {
    setFormData({
      ...formData, // keep all existing fields
      [e.target.name]: e.target.value, // overwrite just the one that changed
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccessMessage("");
  setLoading(true);

  try {
    const data = await registerUser(formData);

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

    setSuccessMessage("Account created! Please check your email to verify your account.");

    // Short delay so the user actually sees the success message before we navigate away
    setTimeout(() => {
      navigate("/");
    }, 1500);
  } catch (err) {
    const message = err.response?.data?.message || "Something went wrong. Please try again.";
    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create an Account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your full name"
            />
          </div>

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
              minLength={8}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition disabled:bg-green-300"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;