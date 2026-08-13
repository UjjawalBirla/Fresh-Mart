import { useEffect, useMemo, useState } from "react";

import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiTag,
} from "react-icons/fi";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import { db } from "../../Firebase/Firebase";

import ImageLoader from "../../components/ImageLoader/ImageLoader";

import { useCart } from "../../contexts/CartContext";

import "./Offers.css";

// ======================================================
// OFFERS
// Only Admin Dashboard products will appear here
// ======================================================

function Offers() {
  // ====================================================
  // STATE
  // ====================================================

  const [offers, setOffers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [wishlist, setWishlist] = useState([]);

  const [productErrors, setProductErrors] = useState({});

  const { addToCart, cartItems, cartLoading } = useCart();

  // ====================================================
  // FETCH OFFERS FROM FIREBASE
  // ====================================================

  useEffect(() => {
    const offersQuery = query(
      collection(db, "products"),
      where("category", "==", "Offers"),
    );

    const unsubscribe = onSnapshot(
      offersQuery,

      (snapshot) => {
        const offerList = snapshot.docs
          .map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,

              ...data,

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

              price: Number(data.price || 0),

              oldPrice: Number(data.oldPrice || 0),

              stock: Number(data.stock || 0),

              unit: data.unit || "piece",
            };
          })

          // Latest offers first
          .sort((a, b) => {
            const dateA = a.createdAt?.toMillis?.() || 0;

            const dateB = b.createdAt?.toMillis?.() || 0;

            return dateB - dateA;
          });

        setOffers(offerList);

        setLoading(false);

        setError("");
      },

      (firebaseError) => {
        console.error("Offers Firebase Error:", firebaseError);

        setError("Unable to load offers.");

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // ====================================================
  // SEARCH
  // ====================================================

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const productName = offer.name?.toLowerCase() || "";

      const category =
        offer.subcategory?.toLowerCase() || offer.category?.toLowerCase() || "";

      const searchText = search.toLowerCase().trim();

      return productName.includes(searchText) || category.includes(searchText);
    });
  }, [offers, search]);

  // ====================================================
  // WISHLIST
  // ====================================================

  const toggleWishlist = (id) => {
    setWishlist((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  };

  // ====================================================
  // ADD TO CART
  // ====================================================

  const handleAddToCart = async (offer) => {
    const stock = Number(offer.stock || 0);

    const unit = offer.unit || "piece";

    // Clear previous error
    setProductErrors((current) => ({
      ...current,
      [offer.id]: "",
    }));

    // -----------------------------------------------
    // OUT OF STOCK
    // -----------------------------------------------

    if (stock <= 0) {
      setProductErrors((current) => ({
        ...current,

        [offer.id]: "Out of stock",
      }));

      return;
    }

    // -----------------------------------------------
    // CURRENT CART QUANTITY
    // -----------------------------------------------

    const existingItem = cartItems.find((item) => item.id === offer.id);

    const currentQuantity = Number(existingItem?.quantity || 0);

    // -----------------------------------------------
    // STOCK LIMIT
    // -----------------------------------------------

    if (currentQuantity + 1 > stock) {
      setProductErrors((current) => ({
        ...current,

        [offer.id]: `Only ${stock} ${unit} of ${offer.name} are available`,
      }));

      return;
    }

    // -----------------------------------------------
    // ADD TO CART
    // -----------------------------------------------

    const success = await addToCart(
      {
        ...offer,

        id: offer.id,

        name: offer.name,

        price: Number(offer.price || 0),

        oldPrice: Number(offer.oldPrice || 0),

        stock,

        unit,

        image: offer.imageLarge || offer.image || offer.originalImage,

        imageLarge: offer.imageLarge || offer.image || offer.originalImage,
      },

      1,
    );

    // -----------------------------------------------
    // FAILED
    // -----------------------------------------------

    if (!success) {
      setProductErrors((current) => ({
        ...current,

        [offer.id]: `Only ${stock} ${unit} of ${offer.name} are available`,
      }));

      return;
    }

    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    setProductErrors((current) => ({
      ...current,

      [offer.id]: "",
    }));
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="offers-page">
        <div className="offers-loading">
          <div className="product-spinner"></div>

          <p>Loading offers...</p>
        </div>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="offers-page">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="offers-hero">
        <div className="offers-hero-content">
          <span className="offers-label">SPECIAL DEALS</span>

          <h1>Fresh Offers 🏷️</h1>

          <p>Grab the best deals and save more on your everyday essentials.</p>
        </div>

        <div className="offers-hero-icon">🏷️</div>
      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && <div className="offers-error">{error}</div>}

      {/* =================================================
          SEARCH + COUNT
      ================================================= */}

      <section className="offers-toolbar">
        <div className="offers-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search offers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="offers-count">
          <FiTag />

          <span>{filteredOffers.length} Offers</span>
        </div>
      </section>

      {/* =================================================
          OFFERS
      ================================================= */}

      {!error && filteredOffers.length > 0 ? (
        <div className="offers-grid">
          {filteredOffers.map((offer) => {
            const stock = Number(offer.stock || 0);

            const isOutOfStock = stock <= 0;

            return (
              <article className="offer-card" key={offer.id}>
                {/* =====================================
                      IMAGE
                  ====================================== */}

                <div className="offer-image">
                  <ImageLoader
                    src={offer.imageLarge || offer.image || offer.originalImage}
                    alt={offer.imageAlt || offer.name || "Offer product"}
                  />

                  {/* OFFER BADGE */}

                  <div className="offer-badge">
                    <FiTag />
                    SPECIAL OFFER
                  </div>

                  {/* WISHLIST */}

                  <button
                    type="button"
                    className={
                      wishlist.includes(offer.id)
                        ? "offer-wishlist liked"
                        : "offer-wishlist"
                    }
                    onClick={() => toggleWishlist(offer.id)}
                    aria-label="Add to wishlist"
                  >
                    <FiHeart />
                  </button>
                </div>

                {/* =====================================
                      CONTENT
                  ====================================== */}

                <div className="offer-content">
                  <span className="offer-category">
                    {offer.subcategory || offer.category}
                  </span>

                  <h3>{offer.name}</h3>

                  {/* =================================
                        RATING
                    ================================= */}

                  <div className="offer-rating">
                    <span>
                      <FiStar />

                      {offer.rating || "4.5"}
                    </span>
                  </div>

                  {/* =================================
                        STOCK
                    ================================= */}

                  {isOutOfStock ? (
                    <div className="offer-stock-out">🔴 OUT OF STOCK</div>
                  ) : productErrors[offer.id] ? (
                    <div className="offer-stock-error">
                      ⚠️ {productErrors[offer.id]}
                    </div>
                  ) : (
                    <div className="offer-stock-available">
                      {stock} {offer.unit || "piece"} available
                    </div>
                  )}

                  {/* =================================
                        PRICE
                    ================================= */}

                  <div className="offer-price-row">
                    <div className="offer-prices">
                      <strong>₹{offer.price}</strong>

                      {offer.oldPrice > 0 && <del>₹{offer.oldPrice}</del>}
                    </div>

                    {/* ADD TO CART */}

                    <button
                      type="button"
                      className="add-cart-btn"
                      disabled={isOutOfStock || cartLoading}
                      onClick={() => handleAddToCart(offer)}
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
        !error && (
          <div className="offers-empty">
            <div className="offers-empty-icon">🏷️</div>

            <h2>No Offers Available</h2>

            <p>New offers added by Admin will appear here.</p>
          </div>
        )
      )}
    </div>
  );
}

export default Offers;
