import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

import { useCart } from "../../contexts/CartContext";

import ImageLoader from "../ImageLoader/ImageLoader";

import "./ProductCards.css";

function ProductCards({ products = [], wishlist = [], onWishlist }) {
  const { addToCart } = useCart();

  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = (product) => {
    if (Number(product.stock) <= 0) {
      return;
    }

    console.log("ADDING TO CART:", product);

    addToCart(product);
  };

  // =========================================
  // EMPTY
  // =========================================

  if (products.length === 0) {
    return (
      <div className="products-empty">
        <span>🛒</span>

        <h3>No products found</h3>

        <p>Try another search or category.</p>
      </div>
    );
  }

  // =========================================
  // PRODUCTS
  // =========================================

  return (
    <div className="product-cards-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          {/* =====================================
              IMAGE
          ====================================== */}

          <div className="product-card-image">
            <ImageLoader
              src={product.imageLarge || product.image}
              alt={product.name || "Product"}
            />

            {/* ===================================
                WISHLIST
            ==================================== */}

            <button
              type="button"
              className={
                wishlist.includes(product.id)
                  ? "product-wishlist liked"
                  : "product-wishlist"
              }
              onClick={() => onWishlist?.(product.id)}
              aria-label="Add to wishlist"
            >
              <FiHeart />
            </button>
          </div>

          {/* =====================================
              INFO
          ====================================== */}

          <div className="product-card-info">
            <span className="product-card-category">
              {product.category || "Fresh Product"}
            </span>

            <h3>{product.name}</h3>

            {/* ===================================
                RATING + STOCK
            ==================================== */}

            <div className="product-card-rating">
              <span>
                <FiStar />

                {product.rating || "4.8"}
              </span>

              <small>
                {Number(product.stock) > 0
                  ? `${product.stock} left`
                  : "Out of stock"}
              </small>
            </div>

            {/* ===================================
                PRICE + CART
            ==================================== */}

            <div className="product-card-bottom">
              <div className="product-card-price">
                <strong>₹{product.price}</strong>

                {product.oldPrice && <del>₹{product.oldPrice}</del>}
              </div>

              <button
                type="button"
                className="vegetable-cart-btn"
                disabled={Number(product.stock) <= 0}
                onClick={() => handleAddToCart(product)}
              >
                <FiShoppingCart />

                {Number(product.stock) > 0 ? "Add" : "Out"}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ProductCards;
