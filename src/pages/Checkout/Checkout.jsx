import { useMemo, useState } from "react";

import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import { useCart } from "../../contexts/CartContext";

import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  // =====================================================
  // AUTH
  // =====================================================

  const { user } = useAuth();

  // =====================================================
  // CART
  // =====================================================

  const {
    cartItems,
    cartCount,
    cartTotal,
    placeOrder,
    cartLoading,
    cartError,
  } = useCart();

  // =====================================================
  // FORM STATES
  // =====================================================

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [state, setState] = useState("");

  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // =====================================================
  // ORDER STATES
  // =====================================================

  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");

  const [orderSuccess, setOrderSuccess] = useState(false);

  const [orderId, setOrderId] = useState("");

  // =====================================================
  // DELIVERY
  // =====================================================

  const deliveryCharge = cartTotal >= 499 ? 0 : 40;

  // =====================================================
  // TAX
  // =====================================================

  const tax = cartTotal * 0.05;

  // =====================================================
  // FINAL TOTAL
  // =====================================================

  const finalTotal = useMemo(() => {
    return cartTotal + deliveryCharge + tax;
  }, [cartTotal, deliveryCharge, tax]);

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");

    // =================================================
    // LOGIN CHECK
    // =================================================

    if (!user?.uid) {
      setError("Please login before placing your order.");

      return;
    }

    // =================================================
    // CART CHECK
    // =================================================

    if (!cartItems.length) {
      setError("Your cart is empty.");

      return;
    }

    // =================================================
    // NAME
    // =================================================

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Please enter your name.");

      return;
    }

    // =================================================
    // PHONE
    // =================================================

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10 digit mobile number.");

      return;
    }

    // =================================================
    // ADDRESS
    // =================================================

    const cleanAddress = address.trim();

    if (!cleanAddress) {
      setError("Please enter your delivery address.");

      return;
    }

    // =================================================
    // CITY
    // =================================================

    const cleanCity = city.trim();

    if (!cleanCity) {
      setError("Please enter your city.");

      return;
    }

    // =================================================
    // STATE
    // =================================================

    const cleanState = state.trim();

    if (!cleanState) {
      setError("Please enter your state.");

      return;
    }

    // =================================================
    // PINCODE
    // =================================================

    const cleanPincode = pincode.replace(/\D/g, "");

    if (cleanPincode.length !== 6) {
      setError("Please enter a valid 6 digit pincode.");

      return;
    }

    // =================================================
    // PAYMENT
    // =================================================

    if (!paymentMethod) {
      setError("Please select a payment method.");

      return;
    }

    // =================================================
    // START
    // =================================================

    setPlacingOrder(true);

    try {
      // =================================================
      // CALL CART CONTEXT
      //
      // Stock is checked and deducted inside
      // CartContext.placeOrder()
      // =================================================

      const result = await placeOrder({
        userId: user.uid,

        userEmail: user.email || "",

        customer: {
          name: cleanName,

          phone: cleanPhone,

          email: user.email || "",
        },

        paymentMethod,

        deliveryAddress: {
          name: cleanName,

          phone: cleanPhone,

          address: cleanAddress,

          city: cleanCity,

          state: cleanState,

          pincode: cleanPincode,
        },
      });

      // =================================================
      // ORDER FAILED
      // =================================================

      if (!result?.success) {
        setError(
          result?.error ||
            cartError ||
            "Unable to place your order. Please try again.",
        );

        return;
      }

      // =================================================
      // SUCCESS
      // =================================================

      setOrderId(result.orderId || "");

      setOrderSuccess(true);
    } catch (orderError) {
      console.error("Place Order Error:", orderError);

      setError(
        orderError.message || "Unable to place your order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================================
  // SUCCESS SCREEN
  // =====================================================

  if (orderSuccess) {
    return (
      <main className="checkout-page">
        <section className="checkout-success">
          <div className="checkout-success-icon">
            <FiCheckCircle />
          </div>

          <span className="checkout-success-label">ORDER PLACED</span>

          <h1>Thank You! 🎉</h1>

          <p>Your order has been placed successfully.</p>

          <div className="checkout-order-id">
            <span>Order ID</span>

            <strong>{orderId}</strong>
          </div>

          <p className="checkout-success-note">
            We will prepare your fresh products and deliver them to your
            address.
          </p>

          <div className="checkout-success-actions">
            <button type="button" onClick={() => navigate("/")}>
              Continue Shopping
              <FiArrowRight />
            </button>

            <button type="button" onClick={() => navigate("/orders")}>
              View My Orders
            </button>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (!cartItems.length) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <FiShoppingBag />

          <h1>Your cart is empty</h1>

          <p>Add some fresh products before checking out.</p>

          <button type="button" onClick={() => navigate("/")}>
            Start Shopping
            <FiArrowRight />
          </button>
        </section>
      </main>
    );
  }

  // =====================================================
  // CHECKOUT UI
  // =====================================================

  return (
    <main className="checkout-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="checkout-header">
        <button
          type="button"
          className="checkout-back-btn"
          onClick={() => navigate("/cart")}
        >
          <FiArrowLeft />
          Back to Cart
        </button>

        <div>
          <span className="checkout-label">SECURE CHECKOUT</span>

          <h1>Complete Your Order</h1>

          <p>Enter your delivery details and place your order.</p>
        </div>
      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {(error || cartError) && (
        <div className="checkout-error">{error || cartError}</div>
      )}

      {/* =================================================
          CHECKOUT
      ================================================= */}

      <form className="checkout-container" onSubmit={handlePlaceOrder}>
        {/* =================================================
            LEFT FORM
        ================================================= */}

        <div className="checkout-form">
          {/* =================================================
              CUSTOMER
          ================================================= */}

          <section className="checkout-card">
            <div className="checkout-card-heading">
              <div className="checkout-card-icon">
                <FiUser />
              </div>

              <div>
                <h2>Customer Details</h2>

                <p>Tell us who is receiving the order.</p>
              </div>
            </div>

            {/* NAME */}

            <div className="checkout-field">
              <label>Full Name</label>

              <div className="checkout-input">
                <FiUser />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={placingOrder}
                />
              </div>
            </div>

            {/* PHONE */}

            <div className="checkout-field">
              <label>Mobile Number</label>

              <div className="checkout-input">
                <FiPhone />

                <input
                  type="tel"
                  placeholder="10 digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value.replace(/\D/g, ""))
                  }
                  disabled={placingOrder}
                />
              </div>
            </div>
          </section>

          {/* =================================================
              DELIVERY
          ================================================= */}

          <section className="checkout-card">
            <div className="checkout-card-heading">
              <div className="checkout-card-icon">
                <FiMapPin />
              </div>

              <div>
                <h2>Delivery Address</h2>

                <p>Where should we deliver your fresh products?</p>
              </div>
            </div>

            {/* ADDRESS */}

            <div className="checkout-field">
              <label>Address</label>

              <textarea
                placeholder="House / Flat / Street / Area"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                disabled={placingOrder}
                rows={4}
              />
            </div>

            {/* CITY + STATE */}

            <div className="checkout-two-column">
              <div className="checkout-field">
                <label>City</label>

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  disabled={placingOrder}
                />
              </div>

              <div className="checkout-field">
                <label>State</label>

                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  disabled={placingOrder}
                />
              </div>
            </div>

            {/* PINCODE */}

            <div className="checkout-field">
              <label>Pincode</label>

              <input
                type="text"
                placeholder="6 digit pincode"
                maxLength={6}
                value={pincode}
                onChange={(event) =>
                  setPincode(event.target.value.replace(/\D/g, ""))
                }
                disabled={placingOrder}
              />
            </div>
          </section>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <section className="checkout-card">
            <div className="checkout-card-heading">
              <div className="checkout-card-icon">
                <FiCreditCard />
              </div>

              <div>
                <h2>Payment Method</h2>

                <p>Choose how you want to pay.</p>
              </div>
            </div>

            <div className="checkout-payment-options">
              {/* COD */}

              <label
                className={
                  paymentMethod === "COD"
                    ? "checkout-payment-option active"
                    : "checkout-payment-option"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  disabled={placingOrder}
                />

                <div>
                  <strong>Cash on Delivery</strong>

                  <span>Pay when your order arrives.</span>
                </div>
              </label>

              {/* ONLINE */}

              <label
                className={
                  paymentMethod === "ONLINE"
                    ? "checkout-payment-option active"
                    : "checkout-payment-option"
                }
              >
                <input
                  type="radio"
                  name="payment"
                  value="ONLINE"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  disabled={placingOrder}
                />

                <div>
                  <strong>Online Payment</strong>

                  <span>Payment gateway integration.</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-summary-products">
            {cartItems.map((product) => {
              const quantity = Number(product.quantity || 1);

              const price = Number(product.price || 0);

              return (
                <div className="checkout-summary-product" key={product.id}>
                  <div className="checkout-summary-image">
                    <img
                      src={
                        product.imageLarge ||
                        product.image ||
                        product.originalImage ||
                        ""
                      }
                      alt={product.name}
                    />
                  </div>

                  <div>
                    <strong>{product.name}</strong>

                    <span>
                      {quantity} × ₹{price}
                    </span>
                  </div>

                  <strong>₹{(quantity * price).toFixed(2)}</strong>
                </div>
              );
            })}
          </div>

          <div className="checkout-summary-divider"></div>

          <div className="checkout-summary-row">
            <span>Subtotal</span>

            <strong>₹{cartTotal.toFixed(2)}</strong>
          </div>

          <div className="checkout-summary-row">
            <span>Delivery</span>

            <strong>
              {deliveryCharge === 0 ? (
                <span className="free-delivery">FREE</span>
              ) : (
                `₹${deliveryCharge}`
              )}
            </strong>
          </div>

          <div className="checkout-summary-row">
            <span>Tax</span>

            <strong>₹{tax.toFixed(2)}</strong>
          </div>

          <div className="checkout-summary-divider"></div>

          <div className="checkout-final-total">
            <span>Total</span>

            <strong>₹{finalTotal.toFixed(2)}</strong>
          </div>

          <div className="checkout-delivery-info">
            <FiTruck />

            <div>
              <strong>Fresh Delivery</strong>

              <span>Free delivery on orders above ₹499</span>
            </div>
          </div>

          <button
            type="submit"
            className="checkout-place-order-btn"
            disabled={placingOrder || cartLoading}
          >
            {placingOrder ? (
              <>Placing Order...</>
            ) : (
              <>
                Place Order
                <FiArrowRight />
              </>
            )}
          </button>

          <p className="checkout-secure-note">
            🔒 Your order information is securely stored.
          </p>
        </aside>
      </form>
    </main>
  );
}

export default Checkout;
