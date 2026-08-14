// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";


function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-green-600">
        AI Smart Kitchen
      </Link>

      <div className="flex items-center gap-6 flex-wrap">
        <Link to="/" className="text-gray-700 hover:text-green-600">
          Home
        </Link>
        <Link to="/recipes" className="text-gray-700 hover:text-green-600">
          Recipes
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/pantry" className="text-gray-700 hover:text-green-600">
              Pantry
            </Link>
            <Link to="/grocery" className="text-gray-700 hover:text-green-600">
              Grocery List
            </Link>
            <Link to="/meal-planner" className="text-gray-700 hover:text-green-600">
              Meal Planner
            </Link>
            <Link to="/nutrition" className="text-gray-700 hover:text-green-600">
              Nutrition
            </Link>
            <span className="text-gray-700">Hi, {user.name}</span>
            <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-green-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-green-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
export default Navbar;