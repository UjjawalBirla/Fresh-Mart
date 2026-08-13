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
} from "react-icons/fi";

import { collection, onSnapshot, query } from "firebase/firestore";

import { useNavigate, useSearchParams } from "react-router-dom";

import { db } from "../../Firebase/Firebase";

import { useCart } from "../../contexts/CartContext";

import ImageLoader from "../../components/ImageLoader/ImageLoader";

import "./Home.css";

import searchAliases from "../../data/searchAliases";

// ======================================================
// HOME
// ======================================================

function Home() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { addToCart, cartCount } = useCart();

  // ====================================================
  // PRODUCTS
  // ====================================================

  const [products, setProducts] = useState([]);

  // ====================================================
  // SEARCH
  // ====================================================

  const [search, setSearch] = useState(searchParams.get("q") || "");

  // ====================================================
  // LOADING / ERROR
  // ====================================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ====================================================
  // PIXABAY IMAGES
  // ====================================================

  const [heroImages, setHeroImages] = useState([]);

  const [categoryImages, setCategoryImages] = useState([]);

  const [heroImageLoading, setHeroImageLoading] = useState(true);

  // ====================================================
  // FETCH PRODUCTS FROM FIREBASE
  // ====================================================

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

  // ====================================================
  // PIXABAY IMAGE FETCH
  // ====================================================

  useEffect(() => {
    const fetchPixabayImages = async () => {
      const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;

      if (!apiKey) {
        console.warn("Pixabay API key is missing.");

        setHeroImageLoading(false);

        return;
      }

      try {
        setHeroImageLoading(true);

        // =================================================
        // HERO IMAGE SEARCHES
        // =================================================

        const heroSearches = [
          "fresh fruits basket",
          "steaming hot food",
          "fresh healthy food",
        ];

        // =================================================
        // CATEGORY IMAGE SEARCHES
        // =================================================

        const categorySearches = [
          "fresh fruits",
          "fresh vegetables",
          "grocery supermarket",
          "fresh food offers",
        ];

        // =================================================
        // FETCH PIXABAY IMAGE
        // =================================================

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

          if (!response.ok) {
            throw new Error(`Pixabay request failed: ${response.status}`);
          }

          const data = await response.json();

          if (!data.hits || data.hits.length === 0) {
            return null;
          }

          return data.hits[0];
        };

        // =================================================
        // HERO
        // =================================================

        const heroResults = await Promise.all(
          heroSearches.map(async (searchTerm) => {
            try {
              return await fetchImage(searchTerm);
            } catch (error) {
              console.error(`Pixabay hero error for ${searchTerm}:`, error);

              return null;
            }
          }),
        );

        // =================================================
        // CATEGORY
        // =================================================

        const categoryResults = await Promise.all(
          categorySearches.map(async (searchTerm) => {
            try {
              return await fetchImage(searchTerm);
            } catch (error) {
              console.error(`Pixabay category error for ${searchTerm}:`, error);

              return null;
            }
          }),
        );

        setHeroImages(heroResults.filter(Boolean));

        setCategoryImages(categoryResults.filter(Boolean));
      } catch (error) {
        console.error("Pixabay Image Error:", error);

        setHeroImages([]);

        setCategoryImages([]);
      } finally {
        setHeroImageLoading(false);
      }
    };

    fetchPixabayImages();
  }, []);

  // ====================================================
  // SEARCH FILTER
  // ====================================================

  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return [];
    }

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

  // ====================================================
  // SEARCH PARAM SYNC
  // ====================================================

  useEffect(() => {
    const urlSearch = searchParams.get("q") || "";

    setSearch(urlSearch);
  }, [searchParams]);

  // ====================================================
  // CATEGORIES
  // ====================================================

  const categories = [
    {
      id: "fruits",
      name: "Fresh Fruits",
      description: "Sweet & naturally fresh fruits",
      emoji: "🍎",
      image: categoryImages[0]?.webformatURL || "",
      path: "/fruits",
    },

    {
      id: "vegetables",
      name: "Fresh Vegetables",
      description: "Farm fresh healthy vegetables",
      emoji: "🥦",
      image: categoryImages[1]?.webformatURL || "",
      path: "/vegetables",
    },

    {
      id: "groceries",
      name: "Groceries",
      description: "Everyday essentials for your home",
      emoji: "🛒",
      image: categoryImages[2]?.webformatURL || "",
      path: "/groceries",
    },

    {
      id: "offers",
      name: "Special Offers",
      description: "Best deals at amazing prices",
      emoji: "🔥",
      image: categoryImages[3]?.webformatURL || "",
      path: "/offers",
    },
  ];

  // ====================================================
  // ADD TO CART
  // ====================================================

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) {
      return;
    }

    addToCart(product);
  };

  // ====================================================
  // SEARCH
  // ====================================================

  const handleSearch = (event) => {
    const value = event.target.value;

    setSearch(value);

    if (value.trim()) {
      navigate(`/?q=${encodeURIComponent(value.trim())}`, {
        replace: true,
      });
    } else {
      navigate("/", {
        replace: true,
      });
    }
  };

  // ====================================================
  // CLEAR SEARCH
  // ====================================================

  const clearSearch = () => {
    setSearch("");

    navigate("/", {
      replace: true,
    });
  };

  // ====================================================
  // HERO FALLBACKS
  // ====================================================

  const fallbackHeroImages = [
    {
      webformatURL:
        "https://cdn.pixabay.com/photo/2017/09/26/13/40/apples-2788599_1280.jpg",
    },

    {
      webformatURL:
        "https://cdn.pixabay.com/photo/2017/05/07/08/56/pancakes-2291908_1280.jpg",
    },

    {
      webformatURL:
        "https://cdn.pixabay.com/photo/2017/01/20/15/06/oranges-1995056_1280.jpg",
    },
  ];

  const fallbackCategoryImages = [
    {
      webformatURL:
        "https://cdn.pixabay.com/photo/2017/09/26/13/40/apples-2788599_1280.jpg",
    },

    {
      webformatURL:
        "https://cdn.pixabay.com/photo/2017/03/20/18/14/vegetables-2157846_1280.jpg",
    },

    {
      webformatURL:
        "https://cdn.pixabay.com/photo/2017/06/02/18/24/grocery-2367139_1280.jpg",
    },

    {
      webformatURL:
        "https://cdn.pixabay.com/photo/2016/11/19/14/00/food-1836352_1280.jpg",
    },
  ];

  const displayHeroImages =
    heroImages.length >= 3 ? heroImages : fallbackHeroImages;

  const displayCategoryImages =
    categoryImages.length >= 4 ? categoryImages : fallbackCategoryImages;

  // ====================================================
  // FINAL CATEGORY DATA
  // ====================================================

  const displayCategories = categories.map((category, index) => ({
    ...category,
    image: displayCategoryImages[index]?.webformatURL || "",
  }));

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="home-page">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="home-hero">
        {/* HERO CONTENT */}

        <div className="home-hero-content">
          <span className="home-hero-label">FRESH • NATURAL • HEALTHY</span>

          <h1>
            Fresh Food
            <br />
            <span>For Healthy Life</span>
          </h1>

          <p>
            Discover fresh fruits, vegetables and everyday groceries carefully
            selected for your family.
          </p>

          {/* HERO FEATURES */}

          <div className="home-hero-features">
            <div className="home-hero-feature">
              <span>
                <FiAward />
              </span>

              <div>
                <strong>100% Natural</strong>

                <small>Farm Fresh</small>
              </div>
            </div>

            <div className="home-hero-feature">
              <span>
                <FiShield />
              </span>

              <div>
                <strong>Safe & Healthy</strong>

                <small>Quality Assured</small>
              </div>
            </div>

            <div className="home-hero-feature">
              <span>
                <FiTruck />
              </span>

              <div>
                <strong>Fast Delivery</strong>

                <small>At Your Doorstep</small>
              </div>
            </div>
          </div>

          {/* HERO BUTTONS */}

          <div className="home-hero-actions">
            <button
              type="button"
              className="home-primary-btn"
              onClick={() => {
                document.getElementById("menu")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Shop Now
              <FiArrowRight />
            </button>

            <button
              type="button"
              className="home-secondary-btn"
              onClick={() => navigate("/offers")}
            >
              <FiTag />
              View Offers
            </button>
          </div>
        </div>

        {/* HERO IMAGE GALLERY */}

        <div className="home-hero-image-wrapper">
          <div className="home-hero-circle"></div>

          <div className="hero-sparkle sparkle-one">✦</div>

          <div className="hero-sparkle sparkle-two">✦</div>

          <div className="hero-leaf hero-leaf-one">🍃</div>

          <div className="hero-leaf hero-leaf-two">🍃</div>

          {/* FRUITS */}

          <div className="hero-image-card hero-fruits-card">
            {heroImageLoading && !heroImages[0] ? (
              <div className="hero-image-placeholder">🍎</div>
            ) : (
              <img
                src={displayHeroImages[0]?.webformatURL}
                alt="Fresh fruits"
              />
            )}

            <div className="hero-image-label">🍎 Fresh Fruits</div>
          </div>

          {/* HOT FOOD */}

          <div className="hero-image-card hero-food-card">
            {heroImageLoading && !heroImages[1] ? (
              <div className="hero-image-placeholder">🍲</div>
            ) : (
              <img
                src={displayHeroImages[1]?.webformatURL}
                alt="Hot steaming food"
              />
            )}

            <div className="hero-image-label">🍲 Hot & Delicious</div>
          </div>

          {/* HEALTHY FOOD */}

          <div className="hero-image-card hero-healthy-card">
            {heroImageLoading && !heroImages[2] ? (
              <div className="hero-image-placeholder">🥗</div>
            ) : (
              <img
                src={displayHeroImages[2]?.webformatURL}
                alt="Healthy fresh food"
              />
            )}

            <div className="hero-image-label">🥗 Healthy Choice</div>
          </div>

          {/* FRESH BADGE */}

          <div className="home-hero-floating-card">
            <span className="home-floating-icon">🍃</span>

            <div>
              <strong>100% Fresh</strong>

              <small>Quality guaranteed</small>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="home-search-section">
        <div className="home-search-box">
          <FiSearch />

          <input
            id="home-search"
            type="text"
            placeholder="Search fruits, vegetables, groceries..."
            value={search}
            onChange={handleSearch}
          />

          {search && (
            <button type="button" onClick={clearSearch}>
              Clear
            </button>
          )}
        </div>

        {/* QUICK BENEFITS */}

        <div className="home-search-benefits">
          <div>
            <FiAward />

            <span>
              <strong>Best Quality</strong>

              <small>Premium Products</small>
            </span>
          </div>

          <div>
            <FiShield />

            <span>
              <strong>Secure Payment</strong>

              <small>100% Safe</small>
            </span>
          </div>

          <div>
            <FiPhone />

            <span>
              <strong>24/7 Support</strong>

              <small>We are here</small>
            </span>
          </div>
        </div>
      </section>

      {/* =================================================
          SEARCH RESULTS
      ================================================= */}

      {search.trim() && (
        <section className="home-products">
          <div className="home-section-heading">
            <span className="home-section-label">SEARCH RESULTS</span>

            <h2>
              Results for <span>"{search}"</span>
            </h2>

            <p>
              {loading
                ? "Searching products..."
                : filteredProducts.length > 0
                  ? `${filteredProducts.length} product${
                      filteredProducts.length !== 1 ? "s" : ""
                    } found`
                  : "No matching products found"}
            </p>
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="home-loading">
              <div className="home-spinner"></div>

              <p>Loading fresh products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            /* SEARCH RESULTS */

            <div className="home-product-grid">
              {filteredProducts.map((product) => (
                <article className="home-product-card" key={product.id}>
                  {/* PRODUCT IMAGE */}

                  <div className="home-product-image">
                    <ImageLoader
                      src={
                        product.imageLarge ||
                        product.image ||
                        product.originalImage
                      }
                      alt={
                        product.imageAlt ||
                        product.name ||
                        product.productName ||
                        "Fresh product"
                      }
                    />
                  </div>

                  {/* PRODUCT CONTENT */}

                  <div className="home-product-content">
                    <span>{product.category || "Fresh Product"}</span>

                    <h3>
                      {product.name ||
                        product.productName ||
                        product.title ||
                        "Fresh Product"}
                    </h3>

                    <div className="home-product-rating">
                      <span>
                        <FiStar />

                        {product.rating || "4.5"}
                      </span>

                      <small>
                        {Number(product.stock) > 0
                          ? `${product.stock} left`
                          : "Out of stock"}
                      </small>
                    </div>

                    <div className="home-product-bottom">
                      <strong>₹{product.price || 0}</strong>

                      <button
                        type="button"
                        disabled={Number(product.stock) <= 0}
                        onClick={() => handleAddToCart(product)}
                      >
                        <FiShoppingCart />
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* NO RESULT */

            <div className="home-no-products">
              <span>🔍</span>

              <h3>No products found</h3>

              <p>We couldn't find any product matching "{search}".</p>
            </div>
          )}
        </section>
      )}

      {/* =================================================
          ABOUT
      ================================================= */}

      <section id="about" className="home-about">
        <div className="home-about-image">
          <img
            src={displayCategoryImages[0]?.webformatURL}
            alt="FreshMart fresh fruits"
          />

          <div className="home-about-badge">
            <strong>10+</strong>

            <span>Years of freshness</span>
          </div>
        </div>

        <div className="home-about-content">
          <span className="home-section-label">ABOUT FRESHMART</span>

          <h2>
            Fresh choices for
            <span> better living.</span>
          </h2>

          <p>
            At FreshMart, we believe that good food should be fresh, healthy and
            easily accessible.
          </p>

          <p>
            From farm-fresh vegetables to delicious fruits and everyday
            groceries, we bring quality products straight to your doorstep.
          </p>

          <div className="home-about-features">
            <div>
              <strong>🌱</strong>

              <span>Farm Fresh</span>
            </div>

            <div>
              <strong>🚚</strong>

              <span>Fast Delivery</span>
            </div>

            <div>
              <strong>✓</strong>

              <span>Quality Checked</span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MENU / CATEGORIES
      ================================================= */}

      <section id="menu" className="home-menu">
        <div className="home-section-heading">
          <span className="home-section-label">EXPLORE OUR MENU</span>

          <h2>
            Enjoy a variety of
            <span> fresh food</span>
          </h2>

          <p>
            Everything you need for a fresh and healthy lifestyle, all in one
            place.
          </p>
        </div>

        <div className="home-category-grid">
          {displayCategories.map((category) => (
            <article
              key={category.id}
              className="home-category-card"
              onClick={() => navigate(category.path)}
            >
              <div className="home-category-image">
                <img src={category.image} alt={category.name} />

                <span className="home-category-emoji">{category.emoji}</span>
              </div>

              <div className="home-category-content">
                <h3>{category.name}</h3>

                <p>{category.description}</p>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    navigate(category.path);
                  }}
                >
                  Shop Now
                  <FiArrowRight />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =================================================
          FEATURED PRODUCTS
      ================================================= */}

      <section className="home-products">
        <div className="home-section-heading">
          <span className="home-section-label">FRESH PICKS</span>

          <h2>
            Featured
            <span> Products</span>
          </h2>

          <p>Hand-picked products from our fresh collection.</p>
        </div>

        {error && <div className="home-error">{error}</div>}

        {loading ? (
          <div className="home-loading">
            <div className="home-spinner"></div>

            <p>Loading fresh products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="home-product-grid">
            {products.slice(0, 8).map((product) => (
              <article className="home-product-card" key={product.id}>
                <div className="home-product-image">
                  <ImageLoader
                    src={
                      product.imageLarge ||
                      product.image ||
                      product.originalImage
                    }
                    alt={product.imageAlt || product.name || "Fresh product"}
                  />
                </div>

                <div className="home-product-content">
                  <span>{product.category || "Fresh Product"}</span>

                  <h3>
                    {product.name ||
                      product.productName ||
                      product.title ||
                      "Fresh Product"}
                  </h3>

                  <div className="home-product-rating">
                    <span>
                      <FiStar />

                      {product.rating || "4.5"}
                    </span>

                    <small>
                      {Number(product.stock) > 0
                        ? `${product.stock} left`
                        : "Out of stock"}
                    </small>
                  </div>

                  <div className="home-product-bottom">
                    <strong>₹{product.price || 0}</strong>

                    <button
                      type="button"
                      disabled={Number(product.stock) <= 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      <FiShoppingCart />
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="home-no-products">
            <span>🍃</span>

            <h3>No products found</h3>

            <p>Products will appear here.</p>
          </div>
        )}
      </section>

      {/* =================================================
          SERVICE STRIP
      ================================================= */}

      <section className="home-service-strip">
        <div>
          <FiTruck />

          <span>
            <strong>Free Delivery</strong>

            <small>On orders above ₹499</small>
          </span>
        </div>

        <div>
          <FiRefreshCw />

          <span>
            <strong>Easy Returns</strong>

            <small>Hassle free returns</small>
          </span>
        </div>

        <div>
          <FiShield />

          <span>
            <strong>Best Quality</strong>

            <small>100% quality products</small>
          </span>
        </div>

        <div>
          <FiAward />

          <span>
            <strong>Secure Payment</strong>

            <small>Multiple payment options</small>
          </span>
        </div>
      </section>

      {/* =================================================
          CTA
      ================================================= */}

      <section className="home-cta">
        <div>
          <span>FRESH DEALS EVERY DAY</span>

          <h2>
            Fresh food,
            <br />
            better prices.
          </h2>

          <p>
            Check out our latest offers and save more on your everyday
            essentials.
          </p>

          <button type="button" onClick={() => navigate("/offers")}>
            Explore Offers
            <FiArrowRight />
          </button>
        </div>

        <div className="home-cta-icon">🛍️</div>
      </section>

      {/* =================================================
          CONTACT
      ================================================= */}

      <section id="contact" className="home-contact">
        <div className="home-section-heading">
          <span className="home-section-label">GET IN TOUCH</span>

          <h2>
            We'd love to
            <span> hear from you</span>
          </h2>

          <p>Have a question? Our team is always ready to help.</p>
        </div>

        <div className="home-contact-grid">
          <div className="home-contact-card">
            <div className="home-contact-icon">
              <FiPhone />
            </div>

            <div>
              <span>Call Us</span>

              <strong>+91 98765 43210</strong>
            </div>
          </div>

          <div className="home-contact-card">
            <div className="home-contact-icon">
              <FiMail />
            </div>

            <div>
              <span>Email</span>

              <strong>hello@freshmart.com</strong>
            </div>
          </div>

          <div className="home-contact-card">
            <div className="home-contact-icon">
              <FiMapPin />
            </div>

            <div>
              <span>Visit Us</span>

              <strong>FreshMart, India</strong>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          FLOATING CART
      ================================================= */}

      {cartCount > 0 && (
        <button
          type="button"
          className="home-floating-cart"
          onClick={() => navigate("/cart")}
        >
          <FiShoppingCart />
          <span>{cartCount}</span>
          Cart
        </button>
      )}
    </div>
  );
}

export default Home;
