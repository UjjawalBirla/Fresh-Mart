import { useEffect, useMemo, useState } from "react";

import { FiSearch, FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import ImageLoader from "../../components/ImageLoader/ImageLoader";

import { db } from "../../Firebase/Firebase";

import { useCart } from "../../contexts/CartContext";

import "./Vegetables.css";

// ======================================================
// CATEGORIES
// ======================================================

const categories = [
  "All",
  "Tomato",
  "Root Vegetables",
  "Capsicum",
  "Leafy Vegetables",
  "Salad",
  "Beans",
  "Vegetables",
];

// ======================================================
// COMPONENT
// ======================================================

function Vegetables() {
  // ====================================================
  // PRODUCTS
  // ====================================================

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ====================================================
  // SEARCH
  // ====================================================

  const [search, setSearch] = useState("");

  // ====================================================
  // CATEGORY
  // ====================================================

  const [activeCategory, setActiveCategory] = useState("All");

  // ====================================================
  // WISHLIST
  // ====================================================

  const [wishlist, setWishlist] = useState([]);

  // ====================================================
  // PRODUCT-SPECIFIC ERROR
  // ====================================================

  const [productErrors, setProductErrors] = useState({});

  // ====================================================
  // CART
  // ====================================================

  const { addToCart, cartItems, cartLoading } = useCart();

  // ====================================================
  // FIREBASE REALTIME
  // ====================================================

  useEffect(() => {
    setLoading(true);

    const vegetablesQuery = query(
      collection(db, "products"),
      where("category", "==", "Vegetables"),
    );

    const unsubscribe = onSnapshot(
      vegetablesQuery,

      (snapshot) => {
        const firebaseProducts = snapshot.docs.map((productDoc) => {
          const data = productDoc.data();

          return {
            id: productDoc.id,

            ...data,

            // IMAGE
            image:
              data.image ||
              data.imageUrl ||
              data.imageLarge ||
              data.originalImage ||
              "",

            imageLarge:
              data.imageLarge ||
              data.image ||
              data.imageUrl ||
              data.originalImage ||
              "",

            // UNIT
            unit: data.unit || "piece",

            // STOCK
            stock: Number(data.stock || 0),

            // PRICE
            price: Number(data.price || 0),
          };
        });

        setProducts(firebaseProducts);

        setLoading(false);
        setError("");
      },

      (firebaseError) => {
        console.error("Vegetables Firebase Error:", firebaseError);

        setError("Unable to load vegetables.");

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ====================================================
  // FILTER
  // ====================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = String(product.name || "").toLowerCase();

      const searchText = search.toLowerCase().trim();

      const matchesSearch = productName.includes(searchText);

      const matchesCategory =
        activeCategory === "All" ||
        product.subcategory === activeCategory ||
        product.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  // ====================================================
  // WISHLIST
  // ====================================================

  const toggleWishlist = (productId) => {
    setWishlist((currentWishlist) => {
      if (currentWishlist.includes(productId)) {
        return currentWishlist.filter((id) => id !== productId);
      }

      return [...currentWishlist, productId];
    });
  };

  // ====================================================
  // ADD TO CART
  // ====================================================

  const handleAddToCart = async (product) => {
    const stock = Number(product.stock || 0);

    const unit = product.unit || "piece";

    // CLEAR OLD ERROR

    setProductErrors((current) => ({
      ...current,
      [product.id]: "",
    }));

    // OUT OF STOCK

    if (stock <= 0) {
      setProductErrors((current) => ({
        ...current,
        [product.id]: "Out of stock",
      }));

      return;
    }

    // CURRENT CART QUANTITY

    const existingItem = cartItems.find((item) => item.id === product.id);

    const currentQuantity = Number(existingItem?.quantity || 0);

    // STOCK LIMIT

    if (currentQuantity + 1 > stock) {
      setProductErrors((current) => ({
        ...current,
        [product.id]: `Only ${stock} ${unit} of ${product.name} are available`,
      }));

      return;
    }

    // ADD TO CART

    const success = await addToCart(
      {
        ...product,
        unit,
      },
      1,
    );

    // FAILED

    if (!success) {
      setProductErrors((current) => ({
        ...current,
        [product.id]: `Only ${stock} ${unit} of ${product.name} are available`,
      }));

      return;
    }

    // SUCCESS

    setProductErrors((current) => ({
      ...current,
      [product.id]: "",
    }));
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="vegetables-page">
        <div className="vegetable-loading">
          <div className="vegetable-spinner"></div>

          <p>Loading vegetables...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="vegetables-page">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="vegetable-hero">
        <div className="vegetable-hero-content">
          <span className="vegetable-page-label">FRESH & HEALTHY</span>

          <h1>Fresh Vegetables 🥦</h1>

          <p>
            Farm-fresh vegetables picked with care and delivered straight to
            your doorstep.
          </p>
        </div>

        <div className="vegetable-hero-emoji">🥦</div>
      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="vegetable-error">{error}</div>}

      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="vegetable-toolbar">
        <div className="vegetable-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search vegetables..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="vegetable-result-count">
          {filteredProducts.length} products
        </div>
      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <div className="vegetable-categories">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              activeCategory === category
                ? "vegetable-category-btn active"
                : "vegetable-category-btn"
            }
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      {filteredProducts.length > 0 ? (
        <div className="vegetable-products">
          {filteredProducts.map((product) => {
            const stock = Number(product.stock || 0);

            const unit = product.unit || "piece";

            const isOutOfStock = stock <= 0;

            return (
              <article className="vegetable-card" key={product.id}>
                {/* IMAGE */}

                <div className="vegetable-image">
                  <ImageLoader
                    src={product.imageLarge || product.image}
                    alt={product.imageAlt || product.name || "Vegetable"}
                  />

                  {/* WISHLIST */}

                  <button
                    type="button"
                    className={
                      wishlist.includes(product.id)
                        ? "vegetable-wishlist liked"
                        : "vegetable-wishlist"
                    }
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Add to wishlist"
                  >
                    <FiHeart />
                  </button>
                </div>

                {/* INFO */}

                <div className="vegetable-info">
                  {/* CATEGORY */}

                  <span className="vegetable-category">
                    {product.subcategory || product.category}
                  </span>

                  {/* NAME */}

                  <h3>{product.name}</h3>

                  {/* RATING */}

                  <div className="vegetable-rating">
                    <span>
                      <FiStar />

                      {product.rating || "New"}
                    </span>
                  </div>

                  {/* =================================================
                        STOCK INSIDE CARD
                    ================================================= */}

                  {isOutOfStock ? (
                    <div className="vegetable-stock-out">🔴 OUT OF STOCK</div>
                  ) : productErrors[product.id] ? (
                    <div className="vegetable-stock-error">
                      ⚠️ {productErrors[product.id]}
                    </div>
                  ) : (
                    <div className="vegetable-stock-available">
                      {stock} {unit} left
                    </div>
                  )}

                  {/* PRICE */}

                  <div className="vegetable-price">
                    <div>
                      <strong>₹{product.price}</strong>

                      {product.oldPrice && <del>₹{product.oldPrice}</del>}
                    </div>

                    {/* CART */}

                    <button
                      type="button"
                      className="add-cart-btn"
                      disabled={isOutOfStock || cartLoading}
                      onClick={() => handleAddToCart(product)}
                    >
                      <FiShoppingCart />

                      {isOutOfStock ? "Out" : "Add"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="vegetable-empty">
          <span>🥦</span>

          <h3>No vegetables found</h3>

          <p>Admin has not added any vegetables yet.</p>
        </div>
      )}
    </div>
  );
}

export default Vegetables;
