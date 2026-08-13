import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingCart,
  FiArrowLeft,
} from "react-icons/fi";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../contexts/CartContext";

import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartLoading,
    cartError,
    cartMessage,
  } = useCart();

  // =========================================
  // EMPTY CART
  // =========================================

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <FiShoppingCart />
          </div>

          <h1>Your Cart is Empty</h1>

          <p>Looks like you haven't added anything to your cart yet.</p>

          <Link to="/fruits" className="continue-shopping-btn">
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // =========================================
  // DECREASE
  // =========================================

  const handleDecrease = async (id) => {
    if (cartLoading) {
      return;
    }

    await decreaseQuantity(id);
  };

  // =========================================
  // INCREASE
  // =========================================

  const handleIncrease = async (item) => {
    if (cartLoading) {
      return;
    }

    const quantity = Number(item.quantity) || 1;
    const stock = Number(item.stock) || 0;

    // -----------------------------------------
    // STOCK CHECK
    // -----------------------------------------

    if (quantity >= stock) {
      return;
    }

    await increaseQuantity(item.id);
  };

  // =========================================
  // REMOVE
  // =========================================

  const handleRemove = async (id) => {
    if (cartLoading) {
      return;
    }

    await removeFromCart(id);
  };

  // =========================================
  // CLEAR CART
  // =========================================

  const handleClearCart = async () => {
    if (cartLoading) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?",
    );

    if (!confirmed) {
      return;
    }

    await clearCart(true);
  };

  // =========================================
  // CHECKOUT
  // =========================================

  const handleCheckout = () => {
    if (cartLoading) {
      return;
    }

    if (cartItems.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  // =========================================
  // CART
  // =========================================

  return (
    <div className="cart-page">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="cart-header">
        <div>
          <span className="cart-label">FRESHMART</span>

          <h1>Shopping Cart 🛒</h1>

          <p>
            {cartCount} item
            {cartCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <button
          type="button"
          className="clear-cart-btn"
          onClick={handleClearCart}
          disabled={cartLoading}
        >
          <FiTrash2 />

          {cartLoading ? "Updating..." : "Clear Cart"}
        </button>
      </div>

      {/* =========================================
          IMPORTANT
          cartError ko yaha render NAHI karna.
          Isliye global red message nahi aayega.
      ========================================= */}

      {/* =========================================
          SUCCESS MESSAGE
      ========================================= */}

      {cartMessage && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#ecfdf3",
            color: "#15803d",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {cartMessage}
        </div>
      )}

      {/* =========================================
          CART CONTENT
      ========================================= */}

      <div className="cart-layout">
        {/* =======================================
            PRODUCTS
        ======================================= */}

        <section className="cart-products">
          {cartItems.map((item) => {
            const image = item.imageLarge || item.image || item.originalImage;

            const quantity = Number(item.quantity) || 1;

            const price = Number(item.price) || 0;

            const itemTotal = price * quantity;

            const stock = Number(item.stock) || 0;

            const unit = item.unit || "item";

            // -----------------------------------------
            // STOCK LIMIT MESSAGE
            // -----------------------------------------

            const stockLimitReached = stock > 0 && quantity >= stock;

            return (
              <article className="cart-item" key={item.id}>
                {/* =================================
                    IMAGE
                ================================= */}

                <div className="cart-item-image">
                  <img src={image} alt={item.name || "Product"} />
                </div>

                {/* =================================
                    INFO
                ================================= */}

                <div className="cart-item-info">
                  <span className="cart-item-category">
                    {item.category || "Fresh Product"}
                  </span>

                  <h3>{item.name}</h3>

                  <strong className="cart-item-price">₹{price}</strong>

                  {/* =================================
                      UNIT
                  ================================= */}

                  {item.unit && (
                    <small
                      style={{
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      Per {item.unit}
                    </small>
                  )}

                  {/* =================================
                      STOCK
                  ================================= */}

                  <small
                    style={{
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {stock > 0 ? `${stock} ${unit} available` : "Out of stock"}
                  </small>

                  {/* =================================
                      QUANTITY + REMOVE
                  ================================= */}

                  <div className="cart-item-actions">
                    {/* QUANTITY */}

                    <div className="quantity-control">
                      {/* DECREASE */}

                      <button
                        type="button"
                        onClick={() => handleDecrease(item.id)}
                        disabled={cartLoading}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>

                      {/* QUANTITY */}

                      <span>{quantity}</span>

                      {/* INCREASE */}

                      <button
                        type="button"
                        onClick={() => handleIncrease(item)}
                        disabled={
                          cartLoading || stock <= 0 || quantity >= stock
                        }
                        aria-label="Increase quantity"
                      >
                        <FiPlus />
                      </button>
                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      className="remove-cart-item"
                      onClick={() => handleRemove(item.id)}
                      disabled={cartLoading}
                    >
                      <FiTrash2 />
                      Remove
                    </button>
                  </div>

                  {/* =================================
                      STOCK WARNING
                      ONLY THIS PRODUCT
                  ================================= */}

                  {stockLimitReached && (
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        background: "#fff1f2",
                        color: "#dc2626",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      Only {stock} {unit} of {item.name} are available.
                    </div>
                  )}
                </div>

                {/* =================================
                    ITEM TOTAL
                ================================= */}

                <div className="cart-item-total">
                  <span>Total</span>

                  <strong>₹{itemTotal}</strong>
                </div>
              </article>
            );
          })}
        </section>

        {/* =======================================
            ORDER SUMMARY
        ======================================= */}

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          {/* ITEMS */}

          <div className="summary-row">
            <span>Items</span>

            <span>{cartCount}</span>
          </div>

          {/* SUBTOTAL */}

          <div className="summary-row">
            <span>Subtotal</span>

            <span>₹{cartTotal}</span>
          </div>

          {/* DELIVERY */}

          <div className="summary-row">
            <span>Delivery</span>

            <span className="free-delivery">FREE</span>
          </div>

          <div className="summary-divider"></div>

          {/* TOTAL */}

          <div className="summary-total">
            <span>Total</span>

            <strong>₹{cartTotal}</strong>
          </div>

          {/* CHECKOUT */}

          <button
            type="button"
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cartLoading}
          >
            {cartLoading ? "Updating..." : "Proceed to Checkout"}
          </button>

          {/* CONTINUE SHOPPING */}

          <Link to="/fruits" className="continue-shopping">
            <FiArrowLeft />
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
