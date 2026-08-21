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
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { db } from "../../Firebase/Firebase";
import { useAuth } from "../../contexts/AuthContext";

function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

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

  const formatDate = (timestamp) => {
    if (!timestamp) return "Date unavailable";
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

  const getStatusBadge = (status) => {
    const value = String(status || "Pending").toLowerCase();

    if (value === "delivered" || value === "completed") {
      return (
        <span className="badge-success">
          <FiCheckCircle /> Delivered
        </span>
      );
    }
    if (value === "cancelled" || value === "canceled") {
      return (
        <span className="badge-danger">
          <FiXCircle /> Cancelled
        </span>
      );
    }
    if (value === "shipped") {
      return (
        <span className="badge-info">
          <FiTruck /> Shipped
        </span>
      );
    }
    if (value === "preparing") {
      return (
        <span className="badge-warning">
          <FiPackage /> Preparing
        </span>
      );
    }
    if (value === "confirmed") {
      return (
        <span className="badge-success">
          <FiCheckCircle /> Confirmed
        </span>
      );
    }
    return (
      <span className="badge-warning">
        <FiClock /> Pending
      </span>
    );
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));
  };

  if (!user?.uid) {
    return (
      <div className="page-container py-16 animate-rise">
        <div className="card mx-auto max-w-md p-8 text-center space-y-4 shadow-2xl">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-market-lime/40 text-4xl text-market-leaf mx-auto dark:bg-market-leaf/20">
            <FiPackage />
          </div>
          <h2 className="font-display text-2xl font-black text-slate-800 dark:text-white">
            Login Required
          </h2>
          <p className="text-sm text-slate-500">
            Please log into your account to view past and active orders.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/login")}
          >
            <span>Login to FreshMart</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container py-16">
        <div className="card mx-auto max-w-md p-8 text-center space-y-4 shadow-xl">
          <FiXCircle className="text-4xl text-red-500 mx-auto" />
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
            {error}
          </h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            <span>Back to Store</span>
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-container py-16 animate-rise">
        <div className="card mx-auto max-w-lg p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-market-lime/40 text-5xl text-market-leaf shadow-inner animate-float mx-auto dark:bg-market-leaf/20 dark:text-market-lime">
            <FiBox />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white">
              No Orders Placed Yet
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              You haven't ordered any fresh produce yet. Discover what's in season today!
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/fruits")}
          >
            <FiArrowLeft />
            <span>Explore Produce</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container space-y-8 pb-16 animate-rise">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <span className="section-label">Order History</span>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl">
            My Orders 📦
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track real-time delivery status and view order receipts.
          </p>
        </div>

        <button
          type="button"
          className="btn-secondary self-start sm:self-auto text-xs font-bold"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          <span>Shop More</span>
        </button>
      </div>

      {/* Orders List */}
      <section className="space-y-6">
        {orders.map((order) => {
          const status = order.status || "Pending";
          const items = Array.isArray(order.items) ? order.items : [];
          const isExpanded = expandedOrder === order.id;

          return (
            <article
              key={order.id}
              className="card overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:border-market-leaf/30"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 p-5 sm:px-6 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center gap-3.5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-market-lime/60 text-market-leaf text-xl dark:bg-market-leaf/30 dark:text-market-lime">
                    <FiPackage />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Order ID: #{order.id.slice(0, 8)}...
                    </span>
                    <strong className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                      Placed on {formatDate(order.createdAt)}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(status)}
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    onClick={() => toggleOrder(order.id)}
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
              </div>

              {/* Order Summary Strip */}
              <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Total Items</span>
                  <strong className="text-slate-800 dark:text-white text-sm">
                    {order.itemCount || items.reduce((acc, i) => acc + Number(i.quantity || 0), 0)} items
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Payment Mode</span>
                  <strong className="text-slate-800 dark:text-white text-sm">
                    {order.paymentMethod || "COD"} ({order.paymentStatus || "Pending"})
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Delivery City</span>
                  <strong className="text-slate-800 dark:text-white text-sm truncate block">
                    {order.deliveryAddress?.city || "Local"}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold">Order Total</span>
                  <strong className="text-market-leaf dark:text-market-lime text-base font-black">
                    ₹{Number(order.total || 0).toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* Products Section */}
              <div className="p-5 sm:px-6 space-y-3">
                <div className="space-y-2.5">
                  {(isExpanded ? items : items.slice(0, 2)).map((item, index) => {
                    const image = item.image || item.imageLarge || item.originalImage;
                    return (
                      <div
                        key={item.productId || `${order.id}-${index}`}
                        className="flex items-center gap-3.5 rounded-xl bg-slate-50/50 p-2.5 dark:bg-slate-800/30"
                      >
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-market-cream dark:bg-slate-800">
                          {image && (
                            <img
                              src={image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <strong className="block truncate text-xs font-bold text-slate-800 dark:text-white">
                            {item.name}
                          </strong>
                          <span className="text-[11px] text-slate-400">
                            {item.quantity} {item.unit || "item"} × ₹{item.price}
                          </span>
                        </div>

                        <span className="text-xs font-black text-slate-800 dark:text-white">
                          ₹{(Number(item.quantity || 1) * Number(item.price || 0)).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {items.length > 2 && !isExpanded && (
                  <button
                    type="button"
                    className="text-xs font-bold text-market-leaf hover:underline dark:text-market-lime"
                    onClick={() => toggleOrder(order.id)}
                  >
                    + View {items.length - 2} more items
                  </button>
                )}
              </div>

              {/* Expanded Details: Tracking Steps */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-market-cream/20 p-5 sm:px-6 space-y-4 dark:border-slate-800 dark:bg-slate-900/40 animate-rise">
                  <h3 className="font-display text-sm font-bold text-slate-800 dark:text-white">
                    Live Order Timeline
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: "confirmed", label: "Confirmed", icon: <FiCheckCircle /> },
                      { key: "preparing", label: "Harvest & Pack", icon: <FiPackage /> },
                      { key: "shipped", label: "On the Way", icon: <FiTruck /> },
                      { key: "delivered", label: "Delivered", icon: <FiCheckCircle /> },
                    ].map((step, idx) => {
                      const lowerStatus = String(status).toLowerCase();
                      const isComplete =
                        (step.key === "confirmed" && ["confirmed", "preparing", "shipped", "delivered"].includes(lowerStatus)) ||
                        (step.key === "preparing" && ["preparing", "shipped", "delivered"].includes(lowerStatus)) ||
                        (step.key === "shipped" && ["shipped", "delivered"].includes(lowerStatus)) ||
                        (step.key === "delivered" && lowerStatus === "delivered");

                      return (
                        <div
                          key={step.key}
                          className={`flex items-center gap-2.5 rounded-xl p-3 border ${
                            isComplete
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "border-slate-200 bg-white/70 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50"
                          }`}
                        >
                          <span className="text-lg">{step.icon}</span>
                          <div>
                            <span className="text-[10px] font-bold block">Step 0{idx + 1}</span>
                            <strong className="text-xs">{step.label}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {order.deliveryAddress && (
                    <div className="rounded-xl border border-slate-200/80 bg-white/80 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60 flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <FiMapPin className="text-market-leaf text-base shrink-0 mt-0.5" />
                      <span>
                        <strong>Delivering to:</strong> {order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default Orders;
