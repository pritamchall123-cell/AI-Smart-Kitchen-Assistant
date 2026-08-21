// src/pages/Recipes.jsx

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("popular");

  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snacks",
    "Vegetarian",
    "Healthy",
  ];

  const [category, setCategory] = useState("All");

  /* =========================================================
     FETCH RECIPES
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchRecipes = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page: currentPage,
          limit: 12,
          sort,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (difficulty) {
          params.difficulty = difficulty;
        }

        if (category !== "All") {
          params.category = category;
        }

        const data = await getRecipes(params);

        if (cancelled) return;

        setRecipes(data.recipes || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load recipes:", err);

        setError(
          "Unable to load recipes. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecipes();

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    search,
    difficulty,
    sort,
    category,
  ]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    setCurrentPage(1);
    setSearch(searchInput);
  };

  /* =========================================================
     CATEGORY
  ========================================================= */

  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  /* =========================================================
     DIFFICULTY
  ========================================================= */

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    setCurrentPage(1);
  };

  /* =========================================================
     SORT
  ========================================================= */

  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1);
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategory("All");
    setDifficulty("");
    setSort("popular");
    setCurrentPage(1);
  };

  const hasFilters =
    search ||
    category !== "All" ||
    difficulty ||
    sort !== "popular";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#FAF9F6]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-[#E7E5E4] bg-white">

        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">

          <div className="max-w-3xl">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Discover something delicious
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#1C1917] sm:text-5xl">
              Find your next
              <span className="text-[#EA580C]">
                {" "}favorite recipe
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-[#78716C]">
              Explore delicious recipes for every mood,
              occasion and skill level.
            </p>

          </div>

          {/* =================================================
              SEARCH
          ================================================== */}

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row"
          >

            <div className="relative flex-1">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E]"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
                placeholder="Search recipes, ingredients..."
                className="h-14 w-full rounded-2xl border border-[#D6D3D1] bg-[#FAF9F6] pl-12 pr-4 text-sm text-[#292524] outline-none transition focus:border-orange-400 focus:bg-white"
              />

            </div>

            <button
              type="submit"
              className="h-14 rounded-2xl bg-[#EA580C] px-7 text-sm font-bold text-white transition hover:bg-[#C2410C]"
            >
              Search
            </button>

          </form>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">

        {/* ===================================================
            CATEGORY CHIPS
        ==================================================== */}

        <div className="flex gap-2 overflow-x-auto pb-2">

          {categories.map((item) => (

            <button
              key={item}
              onClick={() =>
                handleCategoryChange(item)
              }
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                category === item
                  ? "bg-[#1C1917] text-white"
                  : "border border-[#E7E5E4] bg-white text-[#57534E] hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        {/* ===================================================
            TOOLBAR
        ==================================================== */}

        <div className="mt-8 flex flex-col gap-4 border-b border-[#E7E5E4] pb-6 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-bold text-[#1C1917]">
              {search
                ? `Results for "${search}"`
                : "All Recipes"}
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-[#A8A29E]">
                Showing {recipes.length} recipes
              </p>
            )}

          </div>

          <div className="flex items-center gap-3">

            {/* MOBILE FILTER */}

            <button
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="flex items-center gap-2 rounded-xl border border-[#D6D3D1] bg-white px-4 py-2.5 text-sm font-semibold text-[#57534E] lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            {/* SORT */}

            <select
              value={sort}
              onChange={(e) =>
                handleSortChange(e.target.value)
              }
              className="rounded-xl border border-[#D6D3D1] bg-white px-4 py-2.5 text-sm font-medium text-[#57534E] outline-none focus:border-orange-400"
            >
              <option value="popular">
                Most Popular
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="rating">
                Highest Rated
              </option>
            </select>

          </div>

        </div>

        {/* ===================================================
            FILTER PANEL
        ==================================================== */}

        <div
          className={`${
            showFilters
              ? "block"
              : "hidden"
          } lg:block`}
        >

          <div className="mt-6 rounded-2xl border border-[#E7E5E4] bg-white p-5">

            <div className="flex flex-col gap-5 md:flex-row md:items-end">

              {/* DIFFICULTY */}

              <div className="flex-1">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#78716C]">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(e) =>
                    handleDifficultyChange(
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-[#D6D3D1] bg-[#FAF9F6] px-3 text-sm outline-none focus:border-orange-400"
                >
                  <option value="">
                    Any difficulty
                  </option>

                  <option value="easy">
                    Easy
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="hard">
                    Hard
                  </option>
                </select>

              </div>

              {/* ACTIVE FILTER */}

              <div className="flex-1">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#78716C]">
                  Category
                </label>

                <div className="flex h-11 items-center rounded-xl bg-[#FAF9F6] px-3 text-sm text-[#57534E]">
                  {category}
                </div>

              </div>

              {/* CLEAR */}

              {hasFilters && (

                <button
                  onClick={clearFilters}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  <X size={16} />
                  Clear
                </button>

              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>

        )}

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4, 5, 6, 7, 8].map(
              (item) => (

                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white"
                >

                  <div className="h-52 animate-pulse bg-stone-200" />

                  <div className="space-y-3 p-4">

                    <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />

                    <div className="h-4 w-full animate-pulse rounded bg-stone-200" />

                    <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />

                  </div>

                </div>

              )
            )}

          </div>

        )}

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {!loading &&
          !error &&
          recipes.length === 0 && (

            <div className="mt-12 rounded-3xl border border-dashed border-[#D6D3D1] bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
                🍳
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#1C1917]">
                No recipes found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#78716C]">
                Try searching for something else or
                remove some filters to discover more
                recipes.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#EA580C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#C2410C]"
              >
                Clear Filters
              </button>

            </div>

          )}

        {/* ===================================================
            RECIPE GRID
        ==================================================== */}

        {!loading &&
          !error &&
          recipes.length > 0 && (

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {recipes.map((recipe) => (

                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                />

              ))}

            </div>

          )}

        {/* ===================================================
            PAGINATION
        ==================================================== */}

        {!loading &&
          recipes.length > 0 &&
          totalPages > 1 && (

            <div className="mt-12 flex items-center justify-center gap-4">

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.max(prev - 1, 1)
                  )
                }
                disabled={currentPage === 1}
                className="rounded-xl border border-[#D6D3D1] bg-white px-5 py-2.5 text-sm font-semibold text-[#57534E] transition hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <div className="rounded-xl bg-[#1C1917] px-4 py-2.5 text-sm font-semibold text-white">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className="rounded-xl border border-[#D6D3D1] bg-white px-5 py-2.5 text-sm font-semibold text-[#57534E] transition hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>

            </div>

          )}

      </section>

    </main>
  );
}

export default Recipes;