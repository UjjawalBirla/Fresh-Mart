import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiSearch,
  FiShoppingCart,
  FiStar,
  FiPhone,
  FiMail,
  FiMapPin,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiAward,
  FiTag,
  FiEye,
  FiCheck,
  FiHeart,
} from "react-icons/fi";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../../Firebase/Firebase";
import { useCart } from "../../contexts/CartContext";
import ImageLoader from "../../components/ImageLoader/ImageLoader";
import searchAliases from "../../Data/searchAliases";

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, cartCount, cartLoading } = useCart();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [heroImages, setHeroImages] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);
  const [heroImageLoading, setHeroImageLoading] = useState(true);

  // Fetch Products from Firebase Realtime
  useEffect(() => {
    const productsQuery = query(collection(db, "products"));
    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error("Home Firebase Error:", firebaseError);
        setError("Unable to load products.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Fetch Pixabay Images for Hero & Categories
  useEffect(() => {
    const fetchPixabayImages = async () => {
      const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
      if (!apiKey) {
        setHeroImageLoading(false);
        return;
      }

      try {
        setHeroImageLoading(true);
        const heroSearches = [
          "fresh fruits basket",
          "steaming hot food",
          "fresh healthy food",
        ];
        const categorySearches = [
          "fresh fruits",
          "fresh vegetables",
          "grocery supermarket",
          "fresh food offers",
        ];

        const fetchImage = async (searchTerm) => {
          const apiUrl =
            "https://pixabay.com/api/" +
            `?key=${apiKey}` +
            `&q=${encodeURIComponent(searchTerm)}` +
            "&image_type=photo" +
            "&orientation=horizontal" +
            "&safesearch=true" +
            "&order=popular" +
            "&per_page=20";

          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error("Pixabay error");
          const data = await response.json();
          return data.hits?.[0] || null;
        };

        const heroResults = await Promise.all(
          heroSearches.map((term) => fetchImage(term).catch(() => null)),
        );
        const categoryResults = await Promise.all(
          categorySearches.map((term) => fetchImage(term).catch(() => null)),
        );

        setHeroImages(heroResults.filter(Boolean));
        setCategoryImages(categoryResults.filter(Boolean));
      } catch (err) {
        console.error("Pixabay Error:", err);
      } finally {
        setHeroImageLoading(false);
      }
    };

    fetchPixabayImages();
  }, []);

  // Search Filter with Aliases
  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();
    if (!searchValue) return [];

    const aliases = searchAliases[searchValue] || [];
    const searchTerms = [searchValue, ...aliases];

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.productName,
        product.title,
        product.category,
        product.subcategory,
        product.description,
        Array.isArray(product.tags) ? product.tags.join(" ") : product.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchTerms.some((term) =>
        searchableText.includes(term.toLowerCase()),
      );
    });
  }, [products, search]);

  useEffect(() => {
    const urlSearch = searchParams.get("q") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  const fallbackHeroImages = [
    { webformatURL: "https://cdn.pixabay.com/photo/2017/09/26/13/40/apples-2788599_1280.jpg" },
    { webformatURL: "https://cdn.pixabay.com/photo/2017/05/07/08/56/pancakes-2291908_1280.jpg" },
    { webformatURL: "https://cdn.pixabay.com/photo/2017/01/20/15/06/oranges-1995056_1280.jpg" },
  ];

  const fallbackCategoryImages = [
    { webformatURL: "https://cdn.pixabay.com/photo/2017/09/26/13/40/apples-2788599_1280.jpg" },
    { webformatURL: "https://cdn.pixabay.com/photo/2017/03/20/18/14/vegetables-2157846_1280.jpg" },
    { webformatURL: "https://cdn.pixabay.com/photo/2017/06/02/18/24/grocery-2367139_1280.jpg" },
    { webformatURL: "https://cdn.pixabay.com/photo/2016/11/19/14/00/food-1836352_1280.jpg" },
  ];

  const displayHeroImages = heroImages.length >= 3 ? heroImages : fallbackHeroImages;
  const displayCategoryImages = categoryImages.length >= 4 ? categoryImages : fallbackCategoryImages;

  const categories = [
    {
      id: "fruits",
      name: "Fresh Fruits",
      description: "Sweet, juicy & hand-picked fruits",
      emoji: "🍎",
      image: displayCategoryImages[0]?.webformatURL || "",
      path: "/fruits",
      accent: "from-red-500/10 to-orange-500/5",
    },
    {
      id: "vegetables",
      name: "Fresh Vegetables",
      description: "Farm fresh organic daily vegetables",
      emoji: "🥦",
      image: displayCategoryImages[1]?.webformatURL || "",
      path: "/vegetables",
      accent: "from-emerald-500/10 to-market-leaf/5",
    },
    {
      id: "groceries",
      name: "Daily Groceries",
      description: "Everyday essentials & kitchen supplies",
      emoji: "🛒",
      image: displayCategoryImages[2]?.webformatURL || "",
      path: "/groceries",
      accent: "from-amber-500/10 to-yellow-500/5",
    },
    {
      id: "offers",
      name: "Special Deals",
      description: "Exciting discounts & bundled savings",
      emoji: "🏷️",
      image: displayCategoryImages[3]?.webformatURL || "",
      path: "/offers",
      accent: "from-market-coral/15 to-pink-500/5",
    },
  ];

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) return;
    addToCart(product);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (value.trim()) {
      navigate(`/?q=${encodeURIComponent(value.trim())}`, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const clearSearch = () => {
    setSearch("");
    navigate("/", { replace: true });
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* ====================================================
          HERO BANNER SECTION
      ==================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-market-leaf via-market-leaf-dark to-emerald-950 px-4 py-16 text-white md:px-8 md:py-24 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-market-lime/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-market-sun/20 blur-3xl" />

        <div className="mx-auto max-w-7xl relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Hero Left Content */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-market-lime/30 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-market-lime animate-ping" />
              <span className="text-xs font-bold tracking-[0.2em] text-market-lime">
                100% ORGANIC & FARM FRESH
              </span>
            </div>

            <h1 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Fresh Food For A{" "}
              <span className="bg-gradient-to-r from-market-lime via-market-sun to-white bg-clip-text text-transparent">
                Healthy Life
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/85 sm:text-lg lg:mx-0">
              Discover sweet fruits, crisp vegetables, and quality groceries hand-picked
              from local organic farms and delivered right to your doorstep.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <FiAward />, title: "100% Natural", subtitle: "Direct from farm" },
                { icon: <FiShield />, title: "Quality Checked", subtitle: "Grade A produce" },
                { icon: <FiTruck />, title: "Fast Delivery", subtitle: "To your door" },
              ].map((feat) => (
                <div
                  key={feat.title}
                  className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/10 p-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-lg sm:p-4"
                >
                  <span className="text-xl text-market-lime mb-1">{feat.icon}</span>
                  <strong className="text-xs font-bold sm:text-sm">{feat.title}</strong>
                  <span className="hidden text-[10px] text-white/70 sm:inline">
                    {feat.subtitle}
                  </span>
                </div>
              ))}
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 lg:justify-start">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3 font-display text-base font-black text-market-leaf shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-market-lime hover:text-market-leaf-dark hover:shadow-2xl active:scale-95"
                onClick={() => {
                  document.getElementById("featured-products")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <span>Shop Now</span>
                <FiArrowRight />
              </button>

              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-8 py-3 font-display text-base font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white/20 hover:shadow-xl active:scale-95"
                onClick={() => navigate("/offers")}
              >
                <FiTag className="text-market-sun" />
                <span>View Offers</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visuals: Interactive 3D Card Stack */}
          <div className="relative mx-auto flex w-full max-w-lg items-center justify-center lg:col-span-5">
            <div className="relative h-80 w-80 sm:h-96 sm:w-96">
              {/* Central Glowing Circle */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-market-lime/30 to-market-sun/30 blur-2xl animate-pulse-glow" />

              {/* Card 1: Top Right (Fruits) */}
              <div className="absolute -right-2 top-0 w-44 sm:w-52 rounded-2xl border border-white/20 bg-white/90 p-2 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:scale-105 hover:z-30 dark:bg-slate-900/90 animate-float">
                <div className="h-28 sm:h-32 overflow-hidden rounded-xl bg-market-cream">
                  <img
                    src={displayHeroImages[0]?.webformatURL}
                    alt="Fresh fruits"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-2 flex items-center justify-between">
                  <strong className="text-xs font-bold text-slate-800 dark:text-white">
                    🍎 Fresh Fruits
                  </strong>
                  <span className="badge-success text-[10px]">Fresh</span>
                </div>
              </div>

              {/* Card 2: Bottom Left (Hot Food/Veggies) */}
              <div className="absolute bottom-2 left-0 w-44 sm:w-52 rounded-2xl border border-white/20 bg-white/90 p-2 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:scale-105 hover:z-30 dark:bg-slate-900/90 animate-float-delayed">
                <div className="h-28 sm:h-32 overflow-hidden rounded-xl bg-market-cream">
                  <img
                    src={displayHeroImages[1]?.webformatURL}
                    alt="Fresh vegetables"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-2 flex items-center justify-between">
                  <strong className="text-xs font-bold text-slate-800 dark:text-white">
                    🥦 Organic Farm
                  </strong>
                  <span className="badge-warning text-[10px]">Natural</span>
                </div>
              </div>

              {/* Floating Center Badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-market-lime/40 bg-market-leaf/90 px-4 py-3 text-center shadow-2xl backdrop-blur-xl animate-bounce-subtle z-20">
                <span className="text-2xl">🍃</span>
                <p className="text-xs font-black uppercase tracking-wider text-market-lime">
                  100% Quality
                </p>
                <span className="text-[10px] text-white/90">Guaranteed Fresh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          INTERACTIVE SEARCH & TRUST STRIP
      ==================================================== */}
      <section className="page-container -mt-12 md:-mt-16 relative z-20">
        <div className="card space-y-6 p-6 sm:p-8 shadow-2xl">
          {/* Main Search Input */}
          <div className="relative flex items-center rounded-2xl border-2 border-market-leaf/30 bg-white px-4 py-2 shadow-lg shadow-market-leaf/10 transition-all duration-300 focus-within:border-market-leaf focus-within:ring-4 focus-within:ring-market-leaf/15 focus-within:shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <FiSearch className="text-2xl text-market-leaf shrink-0 mr-3" />
            <input
              id="home-search"
              type="text"
              className="w-full border-0 bg-transparent text-sm sm:text-base outline-none text-slate-800 placeholder:text-slate-400 dark:text-slate-100"
              placeholder="Search farm fresh fruits, vegetables, groceries, organic milk..."
              value={search}
              onChange={handleSearchChange}
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="ml-2 rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3.5 rounded-xl bg-market-lime/30 p-3.5 transition-transform hover:-translate-y-0.5 dark:bg-market-leaf/15">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-market-leaf text-white text-lg shadow-sm">
                <FiAward />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800 dark:text-white">
                  Premium Quality
                </strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Certified farm produce
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl bg-market-lime/30 p-3.5 transition-transform hover:-translate-y-0.5 dark:bg-market-leaf/15">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-market-leaf text-white text-lg shadow-sm">
                <FiShield />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800 dark:text-white">
                  100% Safe Payments
                </strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  COD & UPI supported
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-xl bg-market-lime/30 p-3.5 transition-transform hover:-translate-y-0.5 dark:bg-market-leaf/15">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-market-leaf text-white text-lg shadow-sm">
                <FiTruck />
              </div>
              <div>
                <strong className="block text-sm font-bold text-slate-800 dark:text-white">
                  Express Delivery
                </strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Free over ₹499
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SEARCH RESULTS (When search is active)
      ==================================================== */}
      {search.trim() && (
        <section className="page-container space-y-6">
          <div className="space-y-1">
            <span className="section-label">Search Query</span>
            <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
              Results for <span className="text-market-leaf dark:text-market-lime">"{search}"</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loading
                ? "Searching catalog..."
                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
              <p className="text-sm font-semibold text-slate-500">Searching fresh catalog...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const isOutOfStock = Number(product.stock) <= 0;
                return (
                  <article key={product.id} className="product-card flex flex-col justify-between">
                    <div className="relative aspect-square overflow-hidden bg-market-cream/70 dark:bg-slate-800/80">
                      <ImageLoader
                        src={product.imageLarge || product.image || product.originalImage}
                        alt={product.name || "Product"}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      {isOutOfStock && (
                        <span className="badge-danger absolute left-3 top-3">Out of stock</span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
                      <div>
                        <span className="section-label text-[10px]">
                          {product.category || "Fresh Product"}
                        </span>
                        <h3 className="font-display text-base font-bold text-slate-800 line-clamp-2 dark:text-white">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300">
                          <FiStar className="fill-current text-market-sun" />
                          {product.rating || "4.8"}
                        </span>
                        <span className={isOutOfStock ? "badge-danger" : "badge-success"}>
                          {!isOutOfStock ? `${product.stock} ${product.unit || "left"}` : "Sold out"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <strong className="font-display text-xl font-black text-market-leaf dark:text-market-lime">
                          ₹{product.price || 0}
                        </strong>

                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/product/${product.id}`}
                            className="btn-ghost h-9 w-9"
                            title="View details"
                          >
                            <FiEye />
                          </Link>
                          <button
                            type="button"
                            className="btn-primary min-h-9 px-3 py-1.5 text-xs"
                            disabled={isOutOfStock || cartLoading}
                            onClick={() => handleAddToCart(product)}
                          >
                            <FiShoppingCart />
                            <span>{isOutOfStock ? "Out" : "Add"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
              <span className="text-5xl animate-bounce">🔍</span>
              <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">
                No matching products found
              </h3>
              <p className="text-sm text-slate-500">
                Try another keyword like "Apple", "Mango", "Rice", or "Tomato".
              </p>
            </div>
          )}
        </section>
      )}

      {/* ====================================================
          CATEGORY EXPLORATION SECTION
      ==================================================== */}
      <section className="page-container space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-label">Explore Catalog</span>
            <h2 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl">
              Shop by Category
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            Hand-picked selections crafted for freshness, nutritional value and pure taste.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.id}
              onClick={() => navigate(category.path)}
              className={`group cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br ${category.accent} p-4 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-market-leaf/40 hover:shadow-2xl hover:shadow-market-leaf/20 dark:border-slate-800 dark:shadow-slate-950/50`}
            >
              <div className="relative h-48 overflow-hidden rounded-2xl bg-white/70 shadow-inner dark:bg-slate-800">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-6xl">
                    {category.emoji}
                  </div>
                )}
                <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-white/90 text-xl shadow-md backdrop-blur-md dark:bg-slate-900/90">
                  {category.emoji}
                </span>
              </div>

              <div className="space-y-2 p-3 pt-4">
                <h3 className="font-display text-lg font-black text-slate-800 transition-colors group-hover:text-market-leaf dark:text-white dark:group-hover:text-market-lime">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-400">
                  {category.description}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-market-leaf transition-all duration-300 group-hover:gap-2.5 dark:text-market-lime">
                    <span>Explore Products</span>
                    <FiArrowRight />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ====================================================
          FEATURED PRODUCTS GRID
      ==================================================== */}
      <section id="featured-products" className="page-container space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="section-label">Fresh Picks</span>
            <h2 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl">
              Featured Products
            </h2>
          </div>
          <Link
            to="/fruits"
            className="inline-flex items-center gap-2 font-display text-sm font-bold text-market-leaf hover:gap-3 transition-all dark:text-market-lime"
          >
            <span>View all products</span>
            <FiArrowRight />
          </Link>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
            <p className="text-sm font-semibold text-slate-500">Loading fresh products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.slice(0, 8).map((product) => {
              const isOutOfStock = Number(product.stock) <= 0;
              return (
                <article key={product.id} className="product-card flex flex-col justify-between">
                  <div className="relative aspect-square overflow-hidden bg-market-cream/70 dark:bg-slate-800/80">
                    <ImageLoader
                      src={product.imageLarge || product.image || product.originalImage}
                      alt={product.name || "Product"}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {isOutOfStock && (
                      <span className="badge-danger absolute left-3 top-3">Out of stock</span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5 space-y-3">
                    <div>
                      <span className="section-label text-[10px]">
                        {product.category || "Fresh Product"}
                      </span>
                      <h3 className="font-display text-base font-bold text-slate-800 line-clamp-2 dark:text-white">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300">
                        <FiStar className="fill-current text-market-sun" />
                        {product.rating || "4.8"}
                      </span>
                      <span className={isOutOfStock ? "badge-danger" : "badge-success"}>
                        {!isOutOfStock ? `${product.stock} ${product.unit || "left"}` : "Sold out"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <div className="flex items-baseline gap-1.5">
                        <strong className="font-display text-xl font-black text-market-leaf dark:text-market-lime">
                          ₹{product.price || 0}
                        </strong>
                        {product.oldPrice && (
                          <del className="text-xs text-slate-400">₹{product.oldPrice}</del>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/product/${product.id}`}
                          className="btn-ghost h-9 w-9"
                          title="View details"
                        >
                          <FiEye />
                        </Link>
                        <button
                          type="button"
                          className="btn-primary min-h-9 px-3.5 py-1.5 text-xs"
                          disabled={isOutOfStock || cartLoading}
                          onClick={() => handleAddToCart(product)}
                        >
                          <FiShoppingCart />
                          <span>{isOutOfStock ? "Out" : "Add"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
            <span className="text-5xl">🛒</span>
            <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">
              No products found
            </h3>
            <p className="text-sm text-slate-500">Products will appear once added by admin.</p>
          </div>
        )}
      </section>

      {/* ====================================================
          STORY / WHY CHOOSE US
      ==================================================== */}
      <section className="page-container">
        <div className="card overflow-hidden grid lg:grid-cols-12 shadow-2xl">
          <div className="relative overflow-hidden bg-gradient-to-br from-market-lime via-market-leaf/20 to-market-leaf/40 p-8 lg:col-span-5 flex flex-col justify-center items-center text-center">
            <span className="text-8xl animate-float">🥬</span>
            <div className="mt-4 rounded-2xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur-md dark:bg-slate-900/80">
              <strong className="text-sm font-black text-market-leaf dark:text-market-lime">
                10+ Years of Organic Trust
              </strong>
            </div>
          </div>

          <div className="p-8 lg:p-12 lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="section-label">Our Mission</span>
              <h2 className="font-display text-3xl font-black text-slate-800 dark:text-white">
                Fresh choices for <span className="text-market-leaf dark:text-market-lime">better living.</span>
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              At FreshMart, we believe wholesome eating begins with uncompromised freshness. We bridge the gap between conscientious local farmers and your family dinner table with daily-harvested fruits, vegetables, and staples.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {[
                { title: "Direct Farm Sourcing", desc: "No middle agents, straight from soil." },
                { title: "Rigorous Quality Check", desc: "Triple inspected for peak nutrition." },
                { title: "Eco-Friendly Packing", desc: "Sustainable & clean delivery containers." },
                { title: "Doorstep Convenience", desc: "Delivered fast at your preferred hour." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-2.5">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-market-lime text-market-leaf font-bold text-xs">
                    ✓
                  </span>
                  <div>
                    <strong className="block text-xs font-bold text-slate-800 dark:text-white">
                      {item.title}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          CTA CALLOUT BANNER
      ==================================================== */}
      <section className="page-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-market-leaf via-market-leaf-dark to-emerald-950 p-8 text-white shadow-2xl md:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-market-lime/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-market-lime">
                Limited Time Deals
              </span>
              <h2 className="font-display text-3xl font-black md:text-4xl">
                Fresh food at <span className="text-market-lime">unbeatable prices.</span>
              </h2>
              <p className="text-sm text-white/80">
                Check out today's special offers and unlock extra discounts on bulk produce.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-8 py-3.5 font-display text-base font-black text-market-leaf shadow-xl transition-all duration-300 hover:scale-105 hover:bg-market-lime hover:text-market-leaf-dark hover:shadow-2xl active:scale-95"
              onClick={() => navigate("/offers")}
            >
              <span>Explore Deals</span>
              <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================
          FLOATING CART BUTTON
      ==================================================== */}
      {cartCount > 0 && (
        <button
          type="button"
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-full bg-market-leaf px-6 py-3.5 font-display text-sm font-bold text-white shadow-2xl shadow-market-leaf/50 transition-all duration-300 hover:scale-105 hover:bg-market-leaf-dark hover:shadow-market-leaf/70 active:scale-95 animate-bounce-subtle"
          onClick={() => navigate("/cart")}
        >
          <FiShoppingCart className="text-lg" />
          <span>View Cart</span>
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-market-coral px-1.5 text-xs font-black text-white shadow-sm">
            {cartCount}
          </span>
        </button>
      )}
    </div>
  );
}

export default Home;
