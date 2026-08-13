import { useEffect, useMemo, useState } from "react";

import { FiSearch, FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import ImageLoader from "../../components/ImageLoader/ImageLoader";

import { db } from "../../Firebase/Firebase";

import { useCart } from "../../contexts/CartContext";

import "./Groceries.css";

// ======================================================
// CATEGORIES
// ======================================================

const categories = [
  "All",
  "Rice & Grains",
  "Pulses",
  "Snacks",
  "Beverages",
  "Dairy",
  "Spices",
];

// ======================================================
// COMPONENT
// ======================================================

function Groceries() {
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
  // PRODUCT ERROR
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

    const groceriesQuery = query(
      collection(db, "products"),

      where("category", "==", "Groceries"),
    );

    const unsubscribe = onSnapshot(
      groceriesQuery,

      (snapshot) => {
        const firebaseProducts = snapshot.docs.map((productDoc) => {
          const data = productDoc.data();

          return {
            id: productDoc.id,

            ...data,

            // -----------------------------------
            // IMAGE
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
            // UNIT
            // -----------------------------------

            unit: data.unit || "piece",

            // -----------------------------------
            // STOCK
            // -----------------------------------

            stock: Number(data.stock || 0),

            // -----------------------------------
            // PRICE
            // -----------------------------------

            price: Number(data.price || 0),
          };
        });

        setProducts(firebaseProducts);

        setLoading(false);

        setError("");
      },

      (firebaseError) => {
        console.error("Groceries Firebase Error:", firebaseError);

        setError("Unable to load groceries.");

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

      const productCategory = product.subcategory || product.category;

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
      <div className="groceries-page">
        <div className="products-loading">
          <div className="product-spinner"></div>

          <p>Loading groceries...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="groceries-page">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="groceries-hero">
        <div className="groceries-hero-content">
          <span className="page-label">DAILY ESSENTIALS</span>

          <h1>Fresh Groceries 🛒</h1>

          <p>Everything you need for your kitchen, all in one place.</p>
        </div>

        <div className="hero-grocery">🛒</div>
      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="products-error">{error}</div>}

      {/* =================================================
          SEARCH
      ================================================= */}

      <section className="grocery-toolbar">
        <div className="grocery-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search groceries..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="grocery-result-count">
          {filteredProducts.length} products
        </div>
      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <div className="grocery-categories">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={
              activeCategory === category
                ? "grocery-category-btn active"
                : "grocery-category-btn"
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
        <div className="grocery-products">
          {filteredProducts.map((product) => {
            const stock = Number(product.stock || 0);

            const unit = product.unit || "piece";

            const isOutOfStock = stock <= 0;

            return (
              <article className="grocery-card" key={product.id}>
                {/* =====================================
                      IMAGE
                  ====================================== */}

                <div className="grocery-image">
                  <ImageLoader
                    src={product.imageLarge || product.image}
                    alt={product.imageAlt || product.name || "Grocery product"}
                  />

                  {/* WISHLIST */}

                  <button
                    type="button"
                    className={
                      wishlist.includes(product.id)
                        ? "grocery-wishlist liked"
                        : "grocery-wishlist"
                    }
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Add to wishlist"
                  >
                    <FiHeart />
                  </button>
                </div>

                {/* =====================================
                      INFO
                  ====================================== */}

                <div className="grocery-info">
                  {/* CATEGORY */}

                  <span className="grocery-category">
                    {product.subcategory || product.category}
                  </span>

                  {/* NAME */}

                  <h3>{product.name}</h3>

                  {/* RATING */}

                  <div className="grocery-rating">
                    <span>
                      <FiStar />

                      {product.rating || "New"}
                    </span>
                  </div>

                  {/* =================================
                        STOCK
                    ================================= */}

                  {isOutOfStock ? (
                    <div className="grocery-stock-out">🔴 OUT OF STOCK</div>
                  ) : productErrors[product.id] ? (
                    <div className="grocery-stock-error">
                      ⚠️ {productErrors[product.id]}
                    </div>
                  ) : (
                    <div className="grocery-stock-available">
                      {stock} {unit} left
                    </div>
                  )}

                  {/* =================================
                        PRICE
                    ================================= */}

                  <div className="grocery-price">
                    <div>
                      <strong>₹{product.price}</strong>

                      {product.oldPrice && <del>₹{product.oldPrice}</del>}
                    </div>

                    {/* ADD TO CART */}

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
        /* =============================================
           EMPTY
        ============================================== */

        <div className="grocery-empty">
          <span>🛒</span>

          <h3>No groceries found</h3>

          <p>Admin has not added any groceries yet.</p>
        </div>
      )}
    </div>
  );
}

export default Groceries;
