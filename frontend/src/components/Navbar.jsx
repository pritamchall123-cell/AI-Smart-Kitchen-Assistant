// src/components/Navbar.jsx

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
  ChefHat,
  Home,
  Search,
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  ShoppingBasket,
  CalendarDays,
  ScanLine,
  BarChart3,
  Users,
  Trophy,
  ChevronDown,
  PlusCircle,
} from "lucide-react";

import { logout } from "../redux/authSlice";

function Navbar() {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    dispatch(logout());

    setProfileMenuOpen(false);
    setMobileMenuOpen(false);

    navigate("/login");
  };

  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setAiMenuOpen(false);
  };

  /* =========================================================
     NAV LINK STYLE
  ========================================================= */

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-orange-50 text-orange-600"
        : "text-[#57534E] hover:bg-[#FAF9F6] hover:text-orange-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E5E4] bg-white/95 backdrop-blur">

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* ===================================================
            LOGO
        ==================================================== */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EA580C] text-white shadow-sm">
            <ChefHat size={22} />
          </div>

          <div className="hidden sm:block">

            <div className="text-lg font-extrabold tracking-tight text-[#1C1917]">
              AI Smart Kitchen
            </div>

            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8A29E]">
              Cook smarter
            </div>

          </div>

        </Link>

        {/* ===================================================
            DESKTOP NAVIGATION
        ==================================================== */}

        <nav className="hidden items-center gap-1 lg:flex">

          <NavLink
            to="/"
            className={navLinkClass}
          >
            <Home size={16} />
            Home
          </NavLink>

          <NavLink
            to="/recipes"
            className={navLinkClass}
          >
            <BookOpen size={16} />
            Recipes
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/pantry"
                className={navLinkClass}
              >
                <ShoppingBasket size={16} />
                Pantry
              </NavLink>

              <NavLink
                to="/meal-planner"
                className={navLinkClass}
              >
                <CalendarDays size={16} />
                Planner
              </NavLink>

              <NavLink
                to="/recipes/create"
                className={navLinkClass}
              >
                <PlusCircle size={16}/>
                Create Recipe
              </NavLink>
            </>
          )}

          {/* =================================================
              AI MENU
          ================================================== */}

          {isAuthenticated && (
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setAiMenuOpen((prev) => !prev)
                }
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#57534E] transition hover:bg-[#FAF9F6] hover:text-orange-600"
              >

                <Sparkles
                  size={16}
                  className="text-orange-500"
                />

                AI Kitchen

                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    aiMenuOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>

              {aiMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white p-2 shadow-xl">

                  <Link
                    to="/ai/generate-recipe"
                    onClick={() =>
                      setAiMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-orange-50"
                  >

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <Sparkles size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#292524]">
                        AI Recipe Generator
                      </p>

                      <p className="text-xs text-[#A8A29E]">
                        Create recipes instantly
                      </p>
                    </div>

                  </Link>

                  <Link
                    to="/ai/scan"
                    onClick={() =>
                      setAiMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-orange-50"
                  >

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                      <ScanLine size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#292524]">
                        Scan Fridge
                      </p>

                      <p className="text-xs text-[#A8A29E]">
                        Discover recipes from ingredients
                      </p>
                    </div>

                  </Link>

                </div>
              )}

            </div>
          )}

          {isAuthenticated && (
            <NavLink
              to="/nutrition"
              className={navLinkClass}
            >
              <BarChart3 size={16} />
              Nutrition
            </NavLink>
          )}

        </nav>

        {/* ===================================================
            RIGHT SIDE
        ==================================================== */}

        <div className="hidden items-center gap-2 lg:flex">

          {/* SEARCH */}

          <Link
            to="/recipes"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#57534E] transition hover:bg-[#FAF9F6] hover:text-orange-600"
            aria-label="Search recipes"
          >
            <Search size={19} />
          </Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[#57534E] hover:bg-[#FAF9F6]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-[#EA580C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C2410C]"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">

              {/* PROFILE BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setProfileMenuOpen(
                    (prev) => !prev
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-2 py-1.5 hover:bg-[#FAF9F6]"
              >

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-sm font-bold text-orange-700">
                  {user?.name
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>

                <span className="max-w-[100px] truncate text-sm font-semibold text-[#292524]">
                  {user?.name || "User"}
                </span>

                <ChevronDown
                  size={14}
                  className="text-[#A8A29E]"
                />

              </button>

              {/* PROFILE MENU */}

              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white p-2 shadow-xl">

                  <div className="border-b border-[#F5F5F4] px-3 py-3">

                    <p className="text-sm font-bold text-[#292524]">
                      {user?.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#A8A29E]">
                      {user?.email}
                    </p>

                  </div>

                  <Link
                    to={`/profile/${user?._id}`}
                    onClick={() =>
                      setProfileMenuOpen(false)
                    }
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#57534E] hover:bg-[#FAF9F6]"
                  >
                    <User size={16} />
                    My Profile
                  </Link>

                  <Link
                    to="/feed"
                    onClick={() =>
                      setProfileMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#57534E] hover:bg-[#FAF9F6]"
                  >
                    <Users size={16} />
                    Community
                  </Link>

                  <Link
                    to="/leaderboard"
                    onClick={() =>
                      setProfileMenuOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#57534E] hover:bg-[#FAF9F6]"
                  >
                    <Trophy size={16} />
                    Leaderboard
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() =>
                        setProfileMenuOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                    >
                      <BarChart3 size={16} />
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="my-1 border-t border-[#F5F5F4]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* ===================================================
            MOBILE MENU BUTTON
        ==================================================== */}

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (prev) => !prev
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7E5E4] text-[#57534E] lg:hidden"
          aria-label="Toggle menu"
        >

          {mobileMenuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}

        </button>

      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileMenuOpen && (

        <div className="border-t border-[#E7E5E4] bg-white lg:hidden">

          <div className="mx-auto max-w-7xl px-5 py-5">

            <nav className="space-y-1">

              <MobileLink
                to="/"
                icon={<Home size={17} />}
                label="Home"
                onClick={closeMobileMenu}
              />

              <MobileLink
                to="/recipes"
                icon={<BookOpen size={17} />}
                label="Recipes"
                onClick={closeMobileMenu}
              />

              {isAuthenticated && (
                <>
                  <MobileLink
                    to="/pantry"
                    icon={
                      <ShoppingBasket
                        size={17}
                      />
                    }
                    label="Pantry"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to="/grocery"
                    icon={
                      <ShoppingBasket
                        size={17}
                      />
                    }
                    label="Grocery List"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to="/meal-planner"
                    icon={
                      <CalendarDays
                        size={17}
                      />
                    }
                    label="Meal Planner"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to="/nutrition"
                    icon={
                      <BarChart3 size={17} />
                    }
                    label="Nutrition"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to="/recipes/create"
                    icon={
                      <PlusCircle size={17} />
                    }
                    label="Create Recipe"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to="/ai/generate-recipe"
                    icon={
                      <Sparkles size={17} />
                    }
                    label="AI Recipe Generator"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to="/ai/scan"
                    icon={
                      <ScanLine size={17} />
                    }
                    label="Scan Fridge"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to="/feed"
                    icon={
                      <Users size={17} />
                    }
                    label="Community"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to="/leaderboard"
                    icon={
                      <Trophy size={17} />
                    }
                    label="Leaderboard"
                    onClick={closeMobileMenu}
                  />

                  <MobileLink
                    to={`/profile/${user?._id}`}
                    icon={
                      <User size={17} />
                    }
                    label="My Profile"
                    onClick={closeMobileMenu}
                  />

                  {user?.role === "admin" && (
                    <MobileLink
                      to="/admin"
                      icon={
                        <BarChart3 size={17} />
                      }
                      label="Admin Dashboard"
                      onClick={closeMobileMenu}
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#F5F5F4] pt-4">

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-[#D6D3D1] py-3 text-center text-sm font-semibold text-[#57534E]"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-[#EA580C] py-3 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>

                </div>
              )}

            </nav>

          </div>

        </div>

      )}

    </header>
  );
}

/* ============================================================
   MOBILE LINK
============================================================ */

function MobileLink({
  to,
  icon,
  label,
  onClick,
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-orange-50 text-orange-600"
            : "text-[#57534E] hover:bg-[#FAF9F6]"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

export default Navbar;