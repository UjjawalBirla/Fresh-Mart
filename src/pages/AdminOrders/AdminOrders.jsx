import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {
  FiArrowLeft,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiSearch,
  FiTruck,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { db } from "../../Firebase/Firebase";

import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [updatingOrder, setUpdatingOrder] = useState(null);

  const [expandedOrder, setExpandedOrder] = useState(null);

  // =====================================================
  // FETCH ALL ORDERS
  // =====================================================

  useEffect(() => {
    const ordersQuery = query(collection(db, "orders"));

    const unsubscribe = onSnapshot(
      ordersQuery,

      (snapshot) => {
        const orderList = snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,

          ...orderDoc.data(),
        }));

        // Newest order first
        orderList.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;

          const dateB = b.createdAt?.toMillis?.() || 0;

          return dateB - dateA;
        });

        setOrders(orderList);

        setLoading(false);
      },

      (firebaseError) => {
        console.error("Admin Orders Error:", firebaseError);

        setError("Unable to load orders.");

        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

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
      return "admin-order-status-delivered";
    }

    if (value === "cancelled" || value === "canceled") {
      return "admin-order-status-cancelled";
    }

    if (value === "shipped") {
      return "admin-order-status-shipped";
    }

    if (value === "preparing") {
      return "admin-order-status-preparing";
    }

    if (value === "confirmed") {
      return "admin-order-status-confirmed";
    }

    return "admin-order-status-pending";
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
  // UPDATE ORDER STATUS
  // =====================================================

  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId) {
      return;
    }

    setUpdatingOrder(orderId);

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,

        updatedAt: serverTimestamp(),

        ...(newStatus === "Delivered" && {
          paymentStatus: "Paid",
        }),
      });
    } catch (firebaseError) {
      console.error("Status Update Error:", firebaseError);

      setError("Unable to update order status.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async (order) => {
    if (!order?.id) {
      return;
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return;
    }

    const confirmed = window.confirm(`Cancel order ${order.id}?`);

    if (!confirmed) {
      return;
    }

    await handleStatusChange(order.id, "Cancelled");
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer?.name || "";

    const phone = order.customer?.phone || "";

    const orderId = order.id || "";

    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      customerName.toLowerCase().includes(searchValue) ||
      phone.toLowerCase().includes(searchValue) ||
      orderId.toLowerCase().includes(searchValue);

    const currentStatus = order.status || "Pending";

    const matchesStatus =
      statusFilter === "All" || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =====================================================
  // ORDER COUNTS
  // =====================================================

  const pendingOrders = orders.filter(
    (order) => String(order.status || "Pending").toLowerCase() === "pending",
  ).length;

  const confirmedOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "confirmed",
  ).length;

  const preparingOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "preparing",
  ).length;

  const shippedOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "shipped",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "delivered",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "cancelled",
  ).length;

  // =====================================================
  // TOTAL REVENUE
  // =====================================================

  const totalRevenue = orders
    .filter((order) => String(order.status || "").toLowerCase() !== "cancelled")
    .reduce((total, order) => total + Number(order.total || 0), 0);

  // =====================================================
  // TOGGLE DETAILS
  // =====================================================

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-orders-loading">
          <div className="admin-orders-spinner"></div>

          <h2>Loading Orders...</h2>

          <p>Please wait while orders are loading.</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-orders-page">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="admin-orders-header">
        <div>
          <button
            type="button"
            className="admin-orders-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            <FiArrowLeft />
            Dashboard
          </button>

          <span className="admin-orders-label">ADMIN PANEL</span>

          <h1>Order Management</h1>

          <p>Manage customer orders, payments and delivery status.</p>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="admin-orders-error">
          <FiXCircle />
          {error}
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================== */}

      <div className="admin-orders-stats">
        {/* TOTAL */}

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            <FiBox />
          </div>

          <div>
            <span>Total Orders</span>

            <strong>{orders.length}</strong>
          </div>
        </div>

        {/* PENDING */}

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            <FiClock />
          </div>

          <div>
            <span>Pending</span>

            <strong>{pendingOrders}</strong>
          </div>
        </div>

        {/* PREPARING */}

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            <FiPackage />
          </div>

          <div>
            <span>Preparing</span>

            <strong>{preparingOrders}</strong>
          </div>
        </div>

        {/* SHIPPED */}

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            <FiTruck />
          </div>

          <div>
            <span>Shipped</span>

            <strong>{shippedOrders}</strong>
          </div>
        </div>

        {/* DELIVERED */}

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            <FiCheckCircle />
          </div>

          <div>
            <span>Delivered</span>

            <strong>{deliveredOrders}</strong>
          </div>
        </div>

        {/* REVENUE */}

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">₹</div>

          <div>
            <span>Revenue</span>

            <strong>₹{totalRevenue.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================== */}

      <div className="admin-orders-tools">
        <div className="admin-orders-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search order ID, customer name or phone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Orders</option>

          <option value="Pending">Pending</option>

          <option value="Confirmed">Confirmed</option>

          <option value="Preparing">Preparing</option>

          <option value="Shipped">Shipped</option>

          <option value="Delivered">Delivered</option>

          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* =================================================
          RESULT COUNT
      ================================================== */}

      <div className="admin-orders-result-count">
        Showing <strong>{filteredOrders.length}</strong> of{" "}
        <strong>{orders.length}</strong> orders
      </div>

      {/* =================================================
          NO ORDERS
      ================================================== */}

      {filteredOrders.length === 0 ? (
        <div className="admin-orders-empty">
          <FiBox />

          <h2>No Orders Found</h2>

          <p>No orders match your current search or filter.</p>
        </div>
      ) : (
        /* =================================================
           ORDER LIST
        ================================================= */

        <div className="admin-orders-list">
          {filteredOrders.map((order) => {
            const status = order.status || "Pending";

            const items = Array.isArray(order.items) ? order.items : [];

            const isExpanded = expandedOrder === order.id;

            return (
              <article className="admin-order-card" key={order.id}>
                {/* ======================================
                      ORDER HEADER
                  ======================================= */}

                <div className="admin-order-card-header">
                  <div className="admin-order-main">
                    <div className="admin-order-icon">
                      <FiPackage />
                    </div>

                    <div>
                      <span>ORDER ID</span>

                      <strong>{order.id}</strong>

                      <small>{formatDate(order.createdAt)}</small>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div
                    className={`admin-order-status ${getStatusClass(status)}`}
                  >
                    {getStatusIcon(status)}

                    <span>{status}</span>
                  </div>
                </div>

                {/* ======================================
                      CUSTOMER
                  ======================================= */}

                <div className="admin-order-customer">
                  <div className="admin-order-customer-info">
                    <FiUser />

                    <div>
                      <span>Customer</span>

                      <strong>
                        {order.customer?.name || "Unknown Customer"}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-order-customer-info">
                    <FiPhone />

                    <div>
                      <span>Phone</span>

                      <strong>{order.customer?.phone || "N/A"}</strong>
                    </div>
                  </div>

                  <div className="admin-order-customer-info">
                    <span>Payment</span>

                    <strong>{order.paymentMethod || "COD"}</strong>
                  </div>

                  <div className="admin-order-customer-info">
                    <span>Total</span>

                    <strong>₹{Number(order.total || 0).toFixed(2)}</strong>
                  </div>
                </div>

                {/* ======================================
                      ADDRESS
                  ======================================= */}

                {order.deliveryAddress && (
                  <div className="admin-order-address">
                    <FiMapPin />

                    <div>
                      <span>Delivery Address</span>

                      <p>
                        {order.deliveryAddress.address},{" "}
                        {order.deliveryAddress.city},{" "}
                        {order.deliveryAddress.state} -{" "}
                        {order.deliveryAddress.pincode}
                      </p>
                    </div>
                  </div>
                )}

                {/* ======================================
                      STATUS UPDATE
                  ======================================= */}

                <div className="admin-order-status-control">
                  <label>Update Order Status</label>

                  <select
                    value={status}
                    disabled={updatingOrder === order.id}
                    onChange={(event) =>
                      handleStatusChange(order.id, event.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>

                    <option value="Confirmed">Confirmed</option>

                    <option value="Preparing">Preparing</option>

                    <option value="Shipped">Shipped</option>

                    <option value="Delivered">Delivered</option>

                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {updatingOrder === order.id && <span>Updating...</span>}
                </div>

                {/* ======================================
                      PRODUCTS
                  ======================================= */}

                <div className="admin-order-products">
                  <div className="admin-order-products-heading">
                    <h3>Products</h3>

                    <span>
                      {order.itemCount ||
                        items.reduce(
                          (total, item) => total + Number(item.quantity || 0),
                          0,
                        )}{" "}
                      items
                    </span>
                  </div>

                  {(isExpanded ? items : items.slice(0, 3)).map(
                    (item, index) => {
                      const quantity = Number(item.quantity || 1);

                      const price = Number(item.price || 0);

                      const image =
                        item.image ||
                        item.imageLarge ||
                        item.originalImage ||
                        "";

                      return (
                        <div
                          className="admin-order-product"
                          key={item.productId || `${order.id}-${index}`}
                        >
                          <div className="admin-order-product-image">
                            <img src={image} alt={item.name || "Product"} />
                          </div>

                          <div className="admin-order-product-info">
                            <strong>{item.name}</strong>

                            <span>
                              {quantity} {item.unit || "item"} × ₹{price}
                            </span>
                          </div>

                          <strong>₹{(quantity * price).toFixed(2)}</strong>
                        </div>
                      );
                    },
                  )}
                </div>

                {/* MORE */}

                {items.length > 3 && (
                  <button
                    type="button"
                    className="admin-order-view-btn"
                    onClick={() => toggleOrder(order.id)}
                  >
                    {isExpanded
                      ? "Show Less"
                      : `View ${items.length - 3} More Products`}
                  </button>
                )}

                {/* ======================================
                      FOOTER
                  ======================================= */}

                <div className="admin-order-footer">
                  <div>
                    <span>Payment Status</span>

                    <strong>{order.paymentStatus || "Pending"}</strong>
                  </div>

                  <div>
                    <span>Order Total</span>

                    <strong>₹{Number(order.total || 0).toFixed(2)}</strong>
                  </div>

                  <div className="admin-order-footer-actions">
                    <button type="button" onClick={() => toggleOrder(order.id)}>
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>

                    {status !== "Delivered" && status !== "Cancelled" && (
                      <button
                        type="button"
                        className="admin-order-cancel-btn"
                        onClick={() => handleCancelOrder(order)}
                        disabled={updatingOrder === order.id}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* ======================================
                      EXPANDED TRACKING
                  ======================================= */}

                {isExpanded && (
                  <div className="admin-order-tracking">
                    <h3>Order Progress</h3>

                    <div className="admin-order-tracking-line">
                      <div
                        className={
                          String(status).toLowerCase() !== "cancelled"
                            ? "admin-tracking-step completed"
                            : "admin-tracking-step"
                        }
                      >
                        <div>
                          <FiClock />
                        </div>

                        <span>Pending</span>
                      </div>

                      <div
                        className={
                          [
                            "confirmed",
                            "preparing",
                            "shipped",
                            "delivered",
                          ].includes(String(status).toLowerCase())
                            ? "admin-tracking-step completed"
                            : "admin-tracking-step"
                        }
                      >
                        <div>
                          <FiCheckCircle />
                        </div>

                        <span>Confirmed</span>
                      </div>

                      <div
                        className={
                          ["preparing", "shipped", "delivered"].includes(
                            String(status).toLowerCase(),
                          )
                            ? "admin-tracking-step completed"
                            : "admin-tracking-step"
                        }
                      >
                        <div>
                          <FiPackage />
                        </div>

                        <span>Preparing</span>
                      </div>

                      <div
                        className={
                          ["shipped", "delivered"].includes(
                            String(status).toLowerCase(),
                          )
                            ? "admin-tracking-step completed"
                            : "admin-tracking-step"
                        }
                      >
                        <div>
                          <FiTruck />
                        </div>

                        <span>Shipped</span>
                      </div>

                      <div
                        className={
                          String(status).toLowerCase() === "delivered"
                            ? "admin-tracking-step completed"
                            : "admin-tracking-step"
                        }
                      >
                        <div>
                          <FiCheckCircle />
                        </div>

                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
