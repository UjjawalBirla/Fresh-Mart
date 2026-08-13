import { useEffect, useState } from "react";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import {
  FiArrowLeft,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { db } from "../../Firebase/Firebase";

import { useAuth } from "../../contexts/AuthContext";

import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  // =====================================================
  // AUTH
  // =====================================================

  const { user } = useAuth();

  // =====================================================
  // STATES
  // =====================================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [expandedOrder, setExpandedOrder] = useState(null);

  // =====================================================
  // FETCH USER ORDERS
  // =====================================================

  useEffect(() => {
    // ---------------------------------------------------
    // USER NOT LOGGED IN
    // ---------------------------------------------------

    if (!user?.uid) {
      setOrders([]);

      setLoading(false);

      return;
    }

    setLoading(true);

    setError("");

    // ---------------------------------------------------
    // ONLY CURRENT USER ORDERS
    // ---------------------------------------------------

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      ordersQuery,

      (snapshot) => {
        const orderList = snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,

          ...orderDoc.data(),
        }));

        // ------------------------------------------------
        // SORT NEWEST FIRST
        // ------------------------------------------------

        orderList.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;

          const dateB = b.createdAt?.toMillis?.() || 0;

          return dateB - dateA;
        });

        setOrders(orderList);

        setLoading(false);
      },

      (firebaseError) => {
        console.error("Orders Firebase Error:", firebaseError);

        setError("Unable to load your orders.");

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Date unavailable";
    }

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

      return date.toLocaleString("en-IN", {
        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",
      });
    } catch {
      return "Date unavailable";
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value = String(status || "Pending").toLowerCase();

    if (value === "delivered" || value === "completed") {
      return "order-status-delivered";
    }

    if (value === "cancelled" || value === "canceled") {
      return "order-status-cancelled";
    }

    if (value === "shipped") {
      return "order-status-shipped";
    }

    if (value === "preparing") {
      return "order-status-preparing";
    }

    if (value === "confirmed") {
      return "order-status-confirmed";
    }

    return "order-status-pending";
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    const value = String(status || "Pending").toLowerCase();

    if (value === "delivered" || value === "completed") {
      return <FiCheckCircle />;
    }

    if (value === "cancelled" || value === "canceled") {
      return <FiXCircle />;
    }

    if (value === "shipped") {
      return <FiTruck />;
    }

    if (value === "preparing") {
      return <FiPackage />;
    }

    if (value === "confirmed") {
      return <FiCheckCircle />;
    }

    return <FiClock />;
  };

  // =====================================================
  // STATUS TEXT
  // =====================================================

  const getStatusText = (status) => {
    if (!status) {
      return "Pending";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // =====================================================
  // TOGGLE ORDER
  // =====================================================

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));
  };

  // =====================================================
  // GET ORDER TOTAL
  // =====================================================

  const getOrderTotal = (order) => {
    return Number(order.total || 0);
  };

  // =====================================================
  // LOGIN REQUIRED
  // =====================================================

  if (!user?.uid) {
    return (
      <main className="orders-page">
        <section className="orders-empty">
          <div className="orders-empty-icon">
            <FiPackage />
          </div>

          <h1>Login Required</h1>

          <p>Please login to view your orders.</p>

          <button
            type="button"
            className="orders-shop-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </section>
      </main>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="orders-page">
        <section className="orders-loading">
          <div className="orders-spinner"></div>

          <h2>Loading your orders...</h2>

          <p>Please wait.</p>
        </section>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="orders-page">
        <section className="orders-error">
          <div className="orders-error-icon">
            <FiXCircle />
          </div>

          <h1>Something went wrong</h1>

          <p>{error}</p>

          <button
            type="button"
            className="orders-shop-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </section>
      </main>
    );
  }

  // =====================================================
  // EMPTY ORDERS
  // =====================================================

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <section className="orders-empty">
          <div className="orders-empty-icon">
            <FiBox />
          </div>

          <span className="orders-label">MY ORDERS</span>

          <h1>No Orders Yet</h1>

          <p>
            You haven't placed any orders yet. Start shopping for fresh
            products.
          </p>

          <button
            type="button"
            className="orders-shop-btn"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </section>
      </main>
    );
  }

  // =====================================================
  // ORDERS PAGE
  // =====================================================

  return (
    <main className="orders-page">
      {/* =================================================
          HEADER
      ================================================== */}

      <section className="orders-header">
        <button
          type="button"
          className="orders-back-btn"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Continue Shopping
        </button>

        <div>
          <span className="orders-label">FRESHMART</span>

          <h1>My Orders</h1>

          <p>Track and manage your fresh product orders.</p>
        </div>
      </section>

      {/* =================================================
          SUMMARY
      ================================================== */}

      <section className="orders-summary">
        <div className="orders-summary-card">
          <FiBox />

          <div>
            <span>Total Orders</span>

            <strong>{orders.length}</strong>
          </div>
        </div>

        <div className="orders-summary-card">
          <FiClock />

          <div>
            <span>Pending</span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    String(order.status || "Pending").toLowerCase() ===
                    "pending",
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="orders-summary-card">
          <FiTruck />

          <div>
            <span>Shipped</span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    String(order.status || "").toLowerCase() === "shipped",
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="orders-summary-card">
          <FiCheckCircle />

          <div>
            <span>Delivered</span>

            <strong>
              {
                orders.filter(
                  (order) =>
                    String(order.status || "").toLowerCase() === "delivered",
                ).length
              }
            </strong>
          </div>
        </div>
      </section>

      {/* =================================================
          ORDER LIST
      ================================================== */}

      <section className="orders-list">
        {orders.map((order) => {
          const status = order.status || "Pending";

          const items = Array.isArray(order.items) ? order.items : [];

          const isExpanded = expandedOrder === order.id;

          return (
            <article className="order-card" key={order.id}>
              {/* ========================================
                    ORDER HEADER
                ========================================= */}

              <div className="order-card-header">
                <div className="order-main-info">
                  <div className="order-icon">
                    <FiPackage />
                  </div>

                  <div>
                    <span>ORDER ID</span>

                    <strong>{order.id}</strong>

                    <small>{formatDate(order.createdAt)}</small>
                  </div>
                </div>

                {/* STATUS */}

                <div className={`order-status ${getStatusClass(status)}`}>
                  {getStatusIcon(status)}

                  <span>{getStatusText(status)}</span>
                </div>
              </div>

              {/* ========================================
                    ORDER BASIC INFO
                ========================================= */}

              <div className="order-card-info">
                <div>
                  <span>Items</span>

                  <strong>
                    {order.itemCount ||
                      items.reduce(
                        (total, item) => total + Number(item.quantity || 0),
                        0,
                      )}
                  </strong>
                </div>

                <div>
                  <span>Payment</span>

                  <strong>{order.paymentMethod || "COD"}</strong>
                </div>

                <div>
                  <span>Total</span>

                  <strong>₹{getOrderTotal(order).toFixed(2)}</strong>
                </div>
              </div>

              {/* ========================================
                    DELIVERY ADDRESS
                ========================================= */}

              {order.deliveryAddress && (
                <div className="order-address">
                  <FiMapPin />

                  <div>
                    <strong>Delivery Address</strong>

                    <p>
                      {order.deliveryAddress.address},{" "}
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state} -{" "}
                      {order.deliveryAddress.pincode}
                    </p>
                  </div>
                </div>
              )}

              {/* ========================================
                    PRODUCTS
                ========================================= */}

              <div className="order-products">
                {items
                  .slice(0, isExpanded ? items.length : 3)
                  .map((item, index) => {
                    const quantity = Number(item.quantity || 1);

                    const price = Number(item.price || 0);

                    const image =
                      item.image || item.imageLarge || item.originalImage || "";

                    return (
                      <div
                        className="order-product"
                        key={item.productId || `${order.id}-${index}`}
                      >
                        <div className="order-product-image">
                          <img src={image} alt={item.name || "Product"} />
                        </div>

                        <div className="order-product-info">
                          <strong>{item.name}</strong>

                          <span>
                            {quantity} {item.unit || "item"} × ₹{price}
                          </span>
                        </div>

                        <strong className="order-product-total">
                          ₹{(quantity * price).toFixed(2)}
                        </strong>
                      </div>
                    );
                  })}
              </div>

              {/* MORE PRODUCTS */}

              {items.length > 3 && (
                <button
                  type="button"
                  className="order-view-btn"
                  onClick={() => toggleOrder(order.id)}
                >
                  {isExpanded
                    ? "Show Less"
                    : `View ${items.length - 3} More Items`}
                </button>
              )}

              {/* ========================================
                    ORDER FOOTER
                ========================================= */}

              <div className="order-card-footer">
                <div className="order-payment-status">
                  <span>Payment Status</span>

                  <strong>{order.paymentStatus || "Pending"}</strong>
                </div>

                <div className="order-footer-actions">
                  <button
                    type="button"
                    className="order-details-btn"
                    onClick={() => toggleOrder(order.id)}
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                  </button>
                </div>
              </div>

              {/* ========================================
                    STATUS TRACKING
                ========================================= */}

              {isExpanded && (
                <div className="order-tracking">
                  <h3>Order Tracking</h3>

                  <div className="order-tracking-steps">
                    {/* PENDING */}

                    <div
                      className={[
                        "order-tracking-step",
                        [
                          "pending",
                          "confirmed",
                          "preparing",
                          "shipped",
                          "delivered",
                        ].includes(String(status).toLowerCase())
                          ? "completed"
                          : "",
                      ].join(" ")}
                    >
                      <div className="tracking-icon">
                        <FiClock />
                      </div>

                      <div>
                        <strong>Order Placed</strong>

                        <span>Your order has been received.</span>
                      </div>
                    </div>

                    {/* CONFIRMED */}

                    <div
                      className={[
                        "order-tracking-step",
                        [
                          "confirmed",
                          "preparing",
                          "shipped",
                          "delivered",
                        ].includes(String(status).toLowerCase())
                          ? "completed"
                          : "",
                      ].join(" ")}
                    >
                      <div className="tracking-icon">
                        <FiCheckCircle />
                      </div>

                      <div>
                        <strong>Confirmed</strong>

                        <span>Your order has been confirmed.</span>
                      </div>
                    </div>

                    {/* PREPARING */}

                    <div
                      className={[
                        "order-tracking-step",
                        ["preparing", "shipped", "delivered"].includes(
                          String(status).toLowerCase(),
                        )
                          ? "completed"
                          : "",
                      ].join(" ")}
                    >
                      <div className="tracking-icon">
                        <FiPackage />
                      </div>

                      <div>
                        <strong>Preparing</strong>

                        <span>Your fresh products are being prepared.</span>
                      </div>
                    </div>

                    {/* SHIPPED */}

                    <div
                      className={[
                        "order-tracking-step",
                        ["shipped", "delivered"].includes(
                          String(status).toLowerCase(),
                        )
                          ? "completed"
                          : "",
                      ].join(" ")}
                    >
                      <div className="tracking-icon">
                        <FiTruck />
                      </div>

                      <div>
                        <strong>Shipped</strong>

                        <span>Your order is on the way.</span>
                      </div>
                    </div>

                    {/* DELIVERED */}

                    <div
                      className={[
                        "order-tracking-step",
                        String(status).toLowerCase() === "delivered"
                          ? "completed"
                          : "",
                      ].join(" ")}
                    >
                      <div className="tracking-icon">
                        <FiCheckCircle />
                      </div>

                      <div>
                        <strong>Delivered</strong>

                        <span>Order delivered successfully.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Orders;
