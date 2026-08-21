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
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { db } from "../../Firebase/Firebase";

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const ordersQuery = query(collection(db, "orders"));
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
        console.error("Admin Orders Error:", firebaseError);
        setError("Unable to load orders.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

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

  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId) return;
    setUpdatingOrder(orderId);

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        ...(newStatus === "Delivered" && { paymentStatus: "Paid" }),
      });
    } catch (err) {
      console.error("Status Update Error:", err);
      setError("Unable to update order status.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleCancelOrder = async (order) => {
    if (!order?.id) return;
    if (order.status === "Delivered" || order.status === "Cancelled") return;
    const confirmed = window.confirm(`Cancel order ${order.id}?`);
    if (!confirmed) return;
    await handleStatusChange(order.id, "Cancelled");
  };

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

  const pendingOrders = orders.filter(
    (o) => String(o.status || "Pending").toLowerCase() === "pending",
  ).length;
  const preparingOrders = orders.filter(
    (o) => String(o.status || "").toLowerCase() === "preparing",
  ).length;
  const shippedOrders = orders.filter(
    (o) => String(o.status || "").toLowerCase() === "shipped",
  ).length;
  const deliveredOrders = orders.filter(
    (o) => String(o.status || "").toLowerCase() === "delivered",
  ).length;

  const totalRevenue = orders
    .filter((o) => String(o.status || "").toLowerCase() !== "cancelled")
    .reduce((total, o) => total + Number(o.total || 0), 0);

  const toggleOrder = (orderId) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-market-leaf border-t-transparent" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading order records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-rise">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800">
        <div>
          <span className="section-label ml-5">Fulfillment Center</span>
          <h1 className="font-display text-3xl font-black text-slate-800 dark:text-white md:text-4xl  ml-5">
            Order Management 📋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400  ml-5">
            Process orders, change live dispatch status, and manage payments.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {/* KPI Stats Strip */}
      <section className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
        <div className="card flex items-center gap-3.5 p-4 shadow-lg">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-market-lime/60 text-market-leaf text-xl dark:bg-market-leaf/30 dark:text-market-lime">
            <FiBox />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Total</span>
            <strong className="font-display text-xl font-black block text-slate-800 dark:text-white">
              {orders.length}
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-3.5 p-4 shadow-lg">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600 text-xl dark:bg-amber-950/50 dark:text-amber-400">
            <FiClock />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Pending</span>
            <strong className="font-display text-xl font-black block text-amber-600 dark:text-amber-400">
              {pendingOrders}
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-3.5 p-4 shadow-lg">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-600 text-xl dark:bg-sky-950/50 dark:text-sky-400">
            <FiPackage />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Preparing</span>
            <strong className="font-display text-xl font-black block text-sky-600 dark:text-sky-400">
              {preparingOrders}
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-3.5 p-4 shadow-lg">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600 text-xl dark:bg-emerald-950/50 dark:text-emerald-400">
            <FiCheckCircle />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Delivered</span>
            <strong className="font-display text-xl font-black block text-emerald-600 dark:text-emerald-400">
              {deliveredOrders}
            </strong>
          </div>
        </div>

        <div className="card flex items-center gap-3.5 p-4 shadow-lg col-span-2 lg:col-span-1">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-market-leaf text-white text-lg shadow-sm">
            ₹
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400">Gross Sales</span>
            <strong className="font-display text-lg font-black block text-market-leaf dark:text-market-lime">
              ₹{totalRevenue.toFixed(2)}
            </strong>
          </div>
        </div>
      </section>

      {/* Toolbar: Search + Status Filter */}
      <div className="card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 shadow-md">
        <div className="input-field min-h-10 py-1 flex-1 sm:max-w-md">
          <FiSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer, phone, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold outline-none dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <span className="text-xs font-semibold text-slate-400">
            {filteredOrders.length} orders
          </span>
        </div>
      </div>

      {/* Order Cards List */}
      <section className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="card p-12 text-center text-slate-400 text-sm">
            No matching orders found for this search or filter.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = order.status || "Pending";
            const items = Array.isArray(order.items) ? order.items : [];
            const isExpanded = expandedOrder === order.id;

            return (
              <article
                key={order.id}
                className="card overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:border-market-leaf/30"
              >
                {/* Card Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/60 p-5 sm:px-6 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-market-lime/60 text-market-leaf text-lg dark:bg-market-leaf/30 dark:text-market-lime">
                      <FiPackage />
                    </div>
                    <div>
                      <strong className="block text-sm font-bold text-slate-800 dark:text-white">
                        Order #{order.id}
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(status)}
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      onClick={() => toggleOrder(order.id)}
                    >
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Customer Details Strip */}
                <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Customer</span>
                    <strong className="text-slate-800 dark:text-white text-sm">
                      {order.customer?.name || "Customer"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold">Contact</span>
                    <strong className="text-slate-800 dark:text-white text-sm">
                      {order.customer?.phone || "N/A"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold">Payment</span>
                    <strong className="text-slate-800 dark:text-white text-sm">
                      {order.paymentMethod || "COD"} · {order.paymentStatus || "Pending"}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold">Total</span>
                    <strong className="text-market-leaf dark:text-market-lime text-base font-black">
                      ₹{Number(order.total || 0).toFixed(2)}
                    </strong>
                  </div>
                </div>

                {/* Status Control Strip */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:px-6 bg-market-cream/30 border-b border-slate-100 dark:border-slate-800 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                      Update Status:
                    </label>
                    <select
                      value={status}
                      disabled={updatingOrder === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold outline-none shadow-xs dark:border-slate-700 dark:bg-slate-800"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {updatingOrder === order.id && (
                      <span className="text-xs font-semibold text-market-leaf animate-pulse">
                        Updating...
                      </span>
                    )}
                  </div>

                  {status !== "Delivered" && status !== "Cancelled" && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700"
                      onClick={() => handleCancelOrder(order)}
                    >
                      <FiXCircle />
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>

                {/* Products Section */}
                <div className="p-5 sm:px-6 space-y-2.5">
                  {(isExpanded ? items : items.slice(0, 2)).map((item, index) => {
                    const image = item.image || item.imageLarge || item.originalImage;
                    return (
                      <div
                        key={item.productId || `${order.id}-${index}`}
                        className="flex items-center gap-3.5 rounded-xl bg-slate-50/50 p-2.5 dark:bg-slate-800/30 text-xs"
                      >
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-market-cream dark:bg-slate-800">
                          {image && (
                            <img
                              src={image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <strong className="block truncate text-slate-800 dark:text-white font-bold">
                            {item.name}
                          </strong>
                          <span className="text-slate-400">
                            {item.quantity} {item.unit || "item"} × ₹{item.price}
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">
                          ₹{(Number(item.quantity || 1) * Number(item.price || 0)).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Address & Expanded Details */}
                {isExpanded && order.deliveryAddress && (
                  <div className="border-t border-slate-100 p-5 sm:px-6 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 text-xs space-y-1">
                    <span className="font-bold text-slate-500 block">Delivery Address:</span>
                    <p className="text-slate-700 dark:text-slate-300">
                      {order.deliveryAddress.address}, {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                    </p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

export default AdminOrders;
