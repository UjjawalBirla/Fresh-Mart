import { useEffect, useMemo, useState } from "react";

import {
  FiUsers,
  FiUser,
  FiMail,
  FiCalendar,
  FiSearch,
  FiRefreshCw,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";

import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "../../firebase/firebase";

import "./Customers.css";

function Customers() {
  // =========================================
  // STATES
  // =========================================

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // =========================================
  // FETCH CUSTOMERS
  // =========================================

  const fetchCustomers = async (showRefreshLoader = false) => {
    try {
      setError("");

      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // =====================================
      // FIRESTORE USERS COLLECTION
      // =====================================

      const usersRef = collection(db, "users");

      // =====================================
      // GET USERS
      // =====================================

      const usersQuery = query(usersRef, orderBy("createdAt", "desc"));

      const snapshot = await getDocs(usersQuery);

      // =====================================
      // CONVERT FIRESTORE DATA
      // =====================================

      const users = snapshot.docs.map((userDoc) => {
        const data = userDoc.data();

        return {
          id: userDoc.id,

          uid: data.uid || userDoc.id,

          name: data.name || data.displayName || "Unknown User",

          email: data.email || "No email",

          role: data.role || "user",

          createdAt: data.createdAt || null,
        };
      });

      setCustomers(users);
    } catch (fetchError) {
      console.error("Customers Fetch Error:", fetchError);

      // =====================================
      // FALLBACK
      // =====================================

      try {
        const usersRef = collection(db, "users");

        const snapshot = await getDocs(usersRef);

        const users = snapshot.docs.map((userDoc) => {
          const data = userDoc.data();

          return {
            id: userDoc.id,

            uid: data.uid || userDoc.id,

            name: data.name || data.displayName || "Unknown User",

            email: data.email || "No email",

            role: data.role || "user",

            createdAt: data.createdAt || null,
          };
        });

        setCustomers(users);
      } catch (fallbackError) {
        console.error("Customers Fallback Error:", fallbackError);

        setError("Unable to load customers. Please try again.");
      }
    } finally {
      setLoading(false);

      setRefreshing(false);
    }
  };

  // =========================================
  // INITIAL FETCH
  // =========================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================================
  // SEARCH
  // =========================================

  const filteredCustomers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = customer.name?.toLowerCase() || "";

      const email = customer.email?.toLowerCase() || "";

      const uid = customer.uid?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        uid.includes(searchValue)
      );
    });
  }, [customers, search]);

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "N/A";
    }

    try {
      let date;

      if (timestamp?.toDate && typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date(timestamp);
      }

      if (Number.isNaN(date.getTime())) {
        return "N/A";
      }

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // =========================================
  // STATISTICS
  // =========================================

  const totalCustomers = customers.length;

  const totalAdmins = customers.filter(
    (customer) => customer.role === "admin",
  ).length;

  const totalUsers = customers.filter(
    (customer) => customer.role !== "admin",
  ).length;

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="customers-page">
        <div className="customers-loading">
          <div className="customers-spinner"></div>

          <h2>Loading customers...</h2>

          <p>Please wait while we fetch users.</p>
        </div>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="customers-page">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="customers-header">
        <div>
          <span className="customers-label">ADMIN PANEL</span>

          <h1>Customers</h1>

          <p>View all registered FreshMart users.</p>
        </div>

        <button
          type="button"
          className="customers-refresh-btn"
          onClick={() => fetchCustomers(true)}
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? "refresh-spinning" : ""} />

          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && <div className="customers-error">{error}</div>}

      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="customers-stats">
        <div className="customers-stat-card">
          <div className="customers-stat-icon">
            <FiUsers />
          </div>

          <div>
            <span>Total Accounts</span>

            <strong>{totalCustomers}</strong>
          </div>
        </div>

        <div className="customers-stat-card">
          <div className="customers-stat-icon">
            <FiUserCheck />
          </div>

          <div>
            <span>Customers</span>

            <strong>{totalUsers}</strong>
          </div>
        </div>

        <div className="customers-stat-card">
          <div className="customers-stat-icon admin">
            <FiShield />
          </div>

          <div>
            <span>Admins</span>

            <strong>{totalAdmins}</strong>
          </div>
        </div>
      </div>

      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="customers-toolbar">
        <div className="customers-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search by name, email or UID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <span className="customers-result-count">
          Showing <strong>{filteredCustomers.length}</strong> of{" "}
          <strong>{totalCustomers}</strong>
        </span>
      </div>

      {/* =====================================
          EMPTY
      ====================================== */}

      {filteredCustomers.length === 0 ? (
        <div className="customers-empty">
          <div className="customers-empty-icon">
            <FiUsers />
          </div>

          <h2>
            {customers.length === 0 ? "No customers yet" : "No customers found"}
          </h2>

          <p>
            {customers.length === 0
              ? "Registered users will appear here."
              : "Try searching with a different name, email or UID."}
          </p>
        </div>
      ) : (
        /* ===================================
            CUSTOMER LIST
        ==================================== */

        <div className="customers-list">
          {filteredCustomers.map((customer) => (
            <div className="customer-card" key={customer.id}>
              {/* AVATAR */}

              <div className="customer-avatar">
                <FiUser />
              </div>

              {/* USER INFO */}

              <div className="customer-info">
                <div className="customer-name-row">
                  <h3>{customer.name}</h3>

                  <span
                    className={
                      customer.role === "admin"
                        ? "customer-role admin"
                        : "customer-role user"
                    }
                  >
                    {customer.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>

                <div className="customer-detail">
                  <FiMail />

                  <span>{customer.email}</span>
                </div>

                <div className="customer-detail">
                  <FiCalendar />

                  <span>Joined {formatDate(customer.createdAt)}</span>
                </div>
              </div>

              {/* UID */}

              <div className="customer-uid">
                <span>USER ID</span>

                <strong>{customer.uid}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Customers;
