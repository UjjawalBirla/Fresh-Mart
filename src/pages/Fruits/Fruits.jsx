import { useEffect, useMemo, useState } from "react";

import { FiSearch, FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import ImageLoader from "../../components/ImageLoader/ImageLoader";

import { db } from "../../Firebase/Firebase";

import "./Fruits.css";

import { useCart } from "../../contexts/CartContext";

// ======================================================
// CATEGORIES
// ======================================================

const categories = [
  "All",
  "Apples",
  "Banana",
  "Mango",
  "Citrus",
  "Grapes",
  "Melons",
  "Tropical",
];

// ======================================================
// COMPONENT
// ======================================================

function Fruits() {
  // ====================================================
  // FIREBASE PRODUCTS
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
  // PRODUCT-SPECIFIC STOCK ERROR
  // ====================================================

  const [productErrors, setProductErrors] = useState({});

  // ====================================================
  // CART
  // ====================================================

  const { addToCart, cartItems, cartLoading } = useCart();

  // ====================================================
  // FIREBASE REALTIME PRODUCTS
  // ====================================================

  useEffect(() => {
    setLoading(true);

    const fruitsQuery = query(
      collection(db, "products"),

      where("category", "==", "Fruits"),
    );

    const unsubscribe = onSnapshot(
      fruitsQuery,

      (snapshot) => {
        const firebaseProducts = snapshot.docs.map((productDoc) => {
          const data = productDoc.data();

          return {
            id: productDoc.id,

            ...data,

            // -----------------------------------
            // NORMALIZE IMAGE
            // -----------------------------------

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

            // -----------------------------------
            // NORMALIZE UNIT
            // -----------------------------------

            unit: data.unit || "piece",

            // -----------------------------------
            // NORMALIZE STOCK
            // -----------------------------------

            stock: Number(data.stock || 0),

            // -----------------------------------
            // NORMALIZE PRICE
            // -----------------------------------

            price: Number(data.price || 0),
          };
        });

        setProducts(firebaseProducts);

        setLoading(false);

        setError("");
      },

      (firebaseError) => {
        console.error("Fruits Firebase Error:", firebaseError);

        setError("Unable to load fruits.");

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ====================================================
  // FILTER PRODUCTS
  // ====================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // --------------------------------------------
      // SEARCH
      // --------------------------------------------

      const productName = String(product.name || "").toLowerCase();

      const searchText = search.toLowerCase().trim();

      const matchesSearch = productName.includes(searchText);

      // --------------------------------------------
      // CATEGORY
      // --------------------------------------------

      const productCategory = String(product.subcategory || "");

      const matchesCategory =
        activeCategory === "All" || productCategory === activeCategory;

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

    // ----------------------------------------------
    // CLEAR OLD ERROR
    // ----------------------------------------------

    setProductErrors((current) => ({
      ...current,

      [product.id]: "",
    }));

    // ----------------------------------------------
    // OUT OF STOCK
    // ----------------------------------------------

    if (stock <= 0) {
      setProductErrors((current) => ({
        ...current,

        [product.id]: "Out of stock",
      }));

      return;
    }

    // ----------------------------------------------
    // CURRENT CART QUANTITY
    // ----------------------------------------------

    const existingItem = cartItems.find((item) => item.id === product.id);

    const currentQuantity = Number(existingItem?.quantity || 0);

    // ----------------------------------------------
    // STOCK LIMIT
    // ----------------------------------------------

    if (currentQuantity + 1 > stock) {
      setProductErrors((current) => ({
        ...current,

        [product.id]: `Only ${stock} ${unit} of ${product.name} are available`,
      }));

      return;
    }

    // ----------------------------------------------
    // ADD TO CART
    // ----------------------------------------------

    const success = await addToCart(
      {
        ...product,

        unit,
      },

      1,
    );

    // ----------------------------------------------
    // FAILED
    // ----------------------------------------------

    if (!success) {
      setProductErrors((current) => ({
        ...current,

        [product.id]: `Only ${stock} ${unit} of ${product.name} are available`,
      }));

      return;
    }

    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

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
      <div className="fruits-page">
        <div className="products-loading">
          <div className="product-spinner"></div>

          <p>Loading fruits...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="fruits-page">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="fruits-hero">
        <div className="fruits-hero-content">
          <span className="page-label">FRESH & NATURAL</span>

          <h1>Fresh Fruits 🍎</h1>

          <p>Hand-picked fresh fruits, delivered fresh to your doorstep.</p>
        </div>

        <div className="hero-fruit">🍎</div>
      </section>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && <div className="products-error">{error}</div>}

      {/* ==================================================
          SEARCH
      ================================================== */}

      <section className="fruit-toolbar">
        <div className="fruit-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search fruits..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="fruit-result-count">
          {filteredProducts.length} products
        </div>
      </section>

      {/* ==================================================
          CATEGORIES
      ================================================== */}

      <div className="fruit-categories">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              activeCategory === category
                ? "category-btn active"
                : "category-btn"
            }
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* ==================================================
          PRODUCTS
      ================================================== */}

      {filteredProducts.length > 0 ? (
        <div className="fruit-products">
          {filteredProducts.map((product) => {
            const stock = Number(product.stock || 0);

            const unit = product.unit || "piece";

            const isOutOfStock = stock <= 0;

            return (
              <article className="product-card" key={product.id}>
                {/* =====================================
                      IMAGE
                  ====================================== */}

                <div className="product-image">
                  <ImageLoader
                    src={product.imageLarge || product.image}
                    alt={product.imageAlt || product.name || "Fruit"}
                  />

                  {/* WISHLIST */}

                  <button
                    type="button"
                    className={
                      wishlist.includes(product.id)
                        ? "wishlist-btn liked"
                        : "wishlist-btn"
                    }
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Add to wishlist"
                  >
                    <FiHeart />
                  </button>
                </div>

                {/* =====================================
                      PRODUCT INFO
                  ====================================== */}

                <div className="product-info">
                  {/* CATEGORY */}

                  <span className="product-category">
                    {product.subcategory || product.category}
                  </span>

                  {/* NAME */}

                  <h3>{product.name}</h3>

                  {/* RATING */}

                  <div className="product-rating">
                    <span>
                      <FiStar />

                      {product.rating || "New"}
                    </span>
                  </div>

                  {/* =================================
                        STOCK
                    ================================= */}

                  {isOutOfStock ? (
                    <div className="product-stock-out">🔴 OUT OF STOCK</div>
                  ) : productErrors[product.id] ? (
                    <div className="product-stock-error">
                      ⚠️ {productErrors[product.id]}
                    </div>
                  ) : (
                    <div className="product-stock-available">
                      {stock} {unit} left
                    </div>
                  )}

                  {/* =================================
                        PRICE
                    ================================= */}

                  <div className="product-price">
                    <div>
                      <strong>₹{product.price}</strong>

                      {product.oldPrice && <del>₹{product.oldPrice}</del>}
                    </div>

                    {/* =================================
                          ADD BUTTON
                      ================================= */}

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
        <div className="no-products">
          <span>🍎</span>

          <h3>No fruits found</h3>

          <p>Admin has not added any fruits yet.</p>
        </div>
      )}
    </div>
  );
}

export default Fruits;
