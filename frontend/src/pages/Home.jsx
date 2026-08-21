// src/pages/Home.jsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  ChefHat,
  Clock,
  Search,
  Sparkles,
  Refrigerator,
  CalendarDays,
  Flame,
  Utensils,
  Salad,
  Soup,
  CakeSlice,
  Coffee,
  Leaf,
  Star,
} from "lucide-react";

import { getRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

function Home() {
  const navigate = useNavigate();

  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  /* =========================================================
     FETCH TRENDING RECIPES
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchTrending = async () => {
      try {
        const data = await getRecipes({
          limit: 4,
          sort: "popular",
        });

        if (!cancelled) {
          setTrendingRecipes(data?.recipes || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load trending recipes:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTrending();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      navigate("/recipes");
      return;
    }

    navigate(`/recipes?search=${encodeURIComponent(query)}`);
  };

  /* =========================================================
     CATEGORIES
  ========================================================= */

  const categories = [
    {
      name: "Breakfast",
      icon: Coffee,
      color: "bg-orange-50 text-orange-600",
    },
    {
      name: "Lunch",
      icon: Utensils,
      color: "bg-green-50 text-green-600",
    },
    {
      name: "Dinner",
      icon: Soup,
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "Healthy",
      icon: Salad,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      name: "Desserts",
      icon: CakeSlice,
      color: "bg-pink-50 text-pink-600",
    },
    {
      name: "Vegetarian",
      icon: Leaf,
      color: "bg-lime-50 text-lime-600",
    },
  ];

  return (
    <main className="bg-[#FAF9F6]">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden">

        {/* Background decoration */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 lg:pb-28 lg:pt-20">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* =================================================
                LEFT
            ================================================== */}

            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">

                <Sparkles size={16} />

                Your intelligent kitchen companion

              </div>

              <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-[#1C1917] sm:text-6xl">

                Cook something

                <span className="block text-orange-600">
                  amazing today.
                </span>

              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#78716C]">

                Discover recipes, plan your meals, manage your
                pantry and let AI help you decide what to cook.

              </p>

              {/* SEARCH */}

              <form
                onSubmit={handleSearch}
                className="mt-8 flex max-w-xl items-center rounded-2xl border border-[#D6D3D1] bg-white p-2 shadow-lg shadow-black/5"
              >

                <Search
                  size={21}
                  className="ml-3 shrink-0 text-[#A8A29E]"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search recipes, ingredients..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[#292524] outline-none placeholder:text-[#A8A29E]"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-[#EA580C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C2410C]"
                >
                  Search
                </button>

              </form>

              {/* QUICK LINKS */}

              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">

                <span className="font-medium text-[#A8A29E]">
                  Popular:
                </span>

                {[
                  "Chicken",
                  "Pasta",
                  "Rice",
                  "Dessert",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/recipes?search=${encodeURIComponent(
                          item
                        )}`
                      )
                    }
                    className="font-medium text-[#78716C] transition hover:text-orange-600"
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>

            {/* =================================================
                RIGHT HERO VISUAL
            ================================================== */}

            <div className="relative hidden lg:block">

              <div className="relative mx-auto max-w-lg">

                {/* Main image */}

                <div className="overflow-hidden rounded-[2.5rem] shadow-2xl">

                  <img
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
                    alt="Healthy food bowl"
                    className="h-[520px] w-full object-cover"
                  />

                </div>

                {/* Floating recipe card */}

                <div className="absolute -bottom-7 -left-10 flex items-center gap-4 rounded-2xl border border-white/70 bg-white p-4 shadow-xl">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">

                    <ChefHat size={24} />

                  </div>

                  <div>

                    <p className="text-xs font-medium text-[#A8A29E]">
                      AI suggestion
                    </p>

                    <p className="text-sm font-bold text-[#292524]">
                      Creamy Garlic Pasta
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-[#78716C]">

                      <Clock size={12} />

                      25 min

                      <Star
                        size={12}
                        fill="currentColor"
                        className="ml-1 text-yellow-400"
                      />

                      4.9

                    </div>

                  </div>

                </div>

                {/* Floating ingredient card */}

                <div className="absolute -right-7 top-16 rounded-2xl border border-white/70 bg-white px-5 py-4 shadow-xl">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">

                      <Leaf size={19} />

                    </div>

                    <div>

                      <p className="text-xs text-[#A8A29E]">
                        Fresh ingredients
                      </p>

                      <p className="text-sm font-bold text-[#292524]">
                        Cook healthier
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="border-y border-[#E7E5E4] bg-white">

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">

          <div className="mb-7 flex items-end justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                Explore
              </p>

              <h2 className="mt-1 text-2xl font-black text-[#1C1917] sm:text-3xl">
                What are you craving?
              </h2>

            </div>

            <Link
              to="/recipes"
              className="hidden items-center gap-2 text-sm font-bold text-orange-600 sm:flex"
            >
              View all
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => {

              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  to={`/recipes?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group flex flex-col items-center rounded-2xl border border-[#E7E5E4] bg-[#FAF9F6] px-4 py-5 text-center transition-all hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-md"
                >

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${category.color} transition-transform group-hover:scale-110`}
                  >
                    <Icon size={22} />
                  </div>

                  <span className="mt-3 text-sm font-bold text-[#44403C]">
                    {category.name}
                  </span>

                </Link>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          TRENDING RECIPES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

        <div className="mb-8 flex items-end justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Flame
                size={19}
                className="text-orange-500"
              />

              <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
                Trending now
              </p>

            </div>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#1C1917]">
              Recipes people love
            </h2>

            <p className="mt-2 text-sm text-[#78716C]">
              Popular dishes our community is cooking right now.
            </p>

          </div>

          <Link
            to="/recipes"
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-orange-600 hover:bg-orange-50 sm:flex"
          >
            Explore recipes
            <ArrowRight size={16} />
          </Link>

        </div>

        {loading && (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl bg-white"
              >

                <div className="h-56 animate-pulse bg-[#E7E5E4]" />

                <div className="space-y-3 p-5">

                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#E7E5E4]" />

                  <div className="h-4 w-full animate-pulse rounded bg-[#F5F5F4]" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#F5F5F4]" />

                </div>

              </div>
            ))}

          </div>

        )}

        {!loading && trendingRecipes.length === 0 && (

          <div className="rounded-3xl border border-dashed border-[#D6D3D1] bg-white px-6 py-16 text-center">

            <ChefHat
              size={40}
              className="mx-auto text-[#A8A29E]"
            />

            <h3 className="mt-4 text-lg font-bold text-[#292524]">
              No recipes yet
            </h3>

            <p className="mt-2 text-sm text-[#78716C]">
              Recipes will appear here once they're added.
            </p>

            <Link
              to="/recipes"
              className="mt-5 inline-flex rounded-xl bg-[#EA580C] px-5 py-3 text-sm font-bold text-white"
            >
              Browse recipes
            </Link>

          </div>

        )}

        {!loading && trendingRecipes.length > 0 && (

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {trendingRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
              />
            ))}

          </div>

        )}

      </section>

      {/* =====================================================
          AI FEATURES
      ====================================================== */}

      <section className="bg-[#1C1917]">

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-400">

                <Sparkles size={16} />

                AI Kitchen

              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">

                Not sure what to cook?

              </h2>

              <p className="mt-4 max-w-lg leading-7 text-[#A8A29E]">

                Tell our AI what ingredients you have,
                what you're craving, or how much time you
                have. We'll help you find something delicious.

              </p>

              <Link
                to="/ai/generate-recipe"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#EA580C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#C2410C]"
              >
                Try AI Recipe Generator
                <ArrowRight size={17} />
              </Link>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <Link
                to="/ai/generate-recipe"
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">

                  <Sparkles size={23} />

                </div>

                <h3 className="mt-5 font-bold text-white">
                  Generate a Recipe
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#A8A29E]">
                  Create a personalized recipe using
                  ingredients and preferences.
                </p>

              </Link>

              <Link
                to="/ai/scan"
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">

                  <Refrigerator size={23} />

                </div>

                <h3 className="mt-5 font-bold text-white">
                  Scan Your Fridge
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#A8A29E]">
                  Use AI vision to identify ingredients
                  and discover possible recipes.
                </p>

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SMART KITCHEN FEATURES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

        <div className="mb-10 text-center">

          <p className="text-sm font-bold uppercase tracking-wider text-orange-600">
            Your kitchen, organized
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#1C1917]">
            Everything you need to cook smarter
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {/* PANTRY */}

          <Link
            to="/pantry"
            className="group relative overflow-hidden rounded-3xl bg-green-50 p-8 transition hover:shadow-lg"
          >

            <div className="relative z-10 max-w-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm">

                <Refrigerator size={23} />

              </div>

              <h3 className="mt-6 text-2xl font-black text-[#1C1917]">
                What's in your pantry?
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#57534E]">
                Keep track of your ingredients and discover
                recipes based on what you already have.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-700">
                Manage pantry
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>

            </div>

            <div className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-green-200/60" />

          </Link>

          {/* MEAL PLANNER */}

          <Link
            to="/meal-planner"
            className="group relative overflow-hidden rounded-3xl bg-orange-50 p-8 transition hover:shadow-lg"
          >

            <div className="relative z-10 max-w-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">

                <CalendarDays size={23} />

              </div>

              <h3 className="mt-6 text-2xl font-black text-[#1C1917]">
                Plan your week
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#57534E]">
                Organize breakfast, lunch and dinner with
                a personalized weekly meal plan.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-700">
                Open meal planner
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>

            </div>

            <div className="absolute -bottom-16 -right-12 h-48 w-48 rounded-full bg-orange-200/60" />

          </Link>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-5 pb-16 sm:px-8">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#EA580C] px-6 py-14 text-center sm:px-10">

          <ChefHat
            size={36}
            className="mx-auto text-orange-100"
          />

          <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
            Your next favorite recipe is waiting.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-orange-100 sm:text-base">
            Explore thousands of possibilities, discover
            something new and make your kitchen a little
            more exciting.
          </p>

          <Link
            to="/recipes"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
          >
            Explore Recipes
            <ArrowRight size={17} />
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;