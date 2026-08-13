import { useEffect, useState } from "react";

import {
  FiSettings,
  FiShoppingBag,
  FiEdit3,
  FiTrash2,
  FiClipboard,
  FiArrowRight,
  FiUsers,
  FiUser,
  FiMail,
  FiShield,
  FiRefreshCw,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "../../Firebase/Firebase";

import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  // =========================================
  // USER STATES
  // =========================================

  const [users, setUsers] = useState([]);

  const [usersLoading, setUsersLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [error, setError] = useState("");

  // =========================================
  // GET USERS
  // =========================================

  const fetchUsers = async (showRefresh = false) => {
    try {
      setError("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setUsersLoading(true);
      }

      const usersRef = collection(db, "users");

      const snapshot = await getDocs(usersRef);

      const usersData = snapshot.docs.map((userDoc) => {
        const data = userDoc.data();

        return {
          id: userDoc.id,

          uid: data.uid || userDoc.id,

          name: data.name || data.displayName || "Unknown User",

          email: data.email || "No email",

          role: data.role || "user",
        };
      });

      setUsers(usersData);
    } catch (fetchError) {
      console.error("Settings Users Error:", fetchError);

      setError("Unable to load users. Please try again.");
    } finally {
      setUsersLoading(false);

      setRefreshing(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================================
  // DELETE CONFIRMATION
  // =========================================

  const openDeleteConfirmation = (user) => {
    // =======================================
    // ADMIN PROTECTION
    // =======================================

    if (user.role === "admin") {
      setError("Admin accounts cannot be deleted from Settings.");

      return;
    }

    setSelectedUser(user);
  };

  // =========================================
  // CLOSE CONFIRMATION
  // =========================================

  const closeDeleteConfirmation = () => {
    if (deleteLoading) {
      return;
    }

    setSelectedUser(null);
  };

  // =========================================
  // DELETE USER
  // =========================================

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      setDeleteLoading(true);

      setError("");

      // =====================================
      // DELETE FIRESTORE USER DOCUMENT
      // =====================================

      await deleteDoc(doc(db, "users", selectedUser.id));

      // =====================================
      // REMOVE FROM UI
      // =====================================

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== selectedUser.id),
      );

      setSelectedUser(null);
    } catch (deleteError) {
      console.error("Delete User Error:", deleteError);

      setError("Unable to delete user. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // =========================================
  // ORDER MANAGEMENT
  // =========================================

  const orderActions = [
    {
      title: "Manage Orders",

      description: "View and manage all customer orders from the admin panel.",

      icon: <FiClipboard />,

      action: () => navigate("/admin/orders"),

      button: "Manage Orders",
    },

    {
      title: "Update Order",

      description:
        "Update order status, customer details and order information.",

      icon: <FiEdit3 />,

      action: () => navigate("/admin/orders"),

      button: "Update Order",
    },

    {
      title: "Delete Order",

      description: "Remove unwanted or cancelled orders from the system.",

      icon: <FiTrash2 />,

      action: () => navigate("/admin/orders"),

      button: "Delete Order",
    },
  ];

  // =========================================
  // UI
  // =========================================

  return (
    <div className="settings-page">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="settings-header">
        <div className="settings-header-icon">
          <FiSettings />
        </div>

        <div>
          <span className="settings-label">ADMIN PANEL</span>

          <h1>Settings</h1>

          <p>Manage FreshMart orders and users.</p>
        </div>
      </div>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="settings-error">
          <FiAlertTriangle />

          <span>{error}</span>

          <button type="button" onClick={() => setError("")}>
            <FiX />
          </button>
        </div>
      )}

      {/* =====================================
          ORDER MANAGEMENT
      ====================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">
            <FiShoppingBag />
          </div>

          <div>
            <h2>Order Management</h2>

            <p>Manage customer orders and order operations.</p>
          </div>
        </div>

        <div className="settings-actions">
          {orderActions.map((item) => (
            <div className="settings-action-card" key={item.title}>
              <div className="settings-action-icon">{item.icon}</div>

              <div className="settings-action-content">
                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>

              <button
                type="button"
                className="settings-action-btn"
                onClick={item.action}
              >
                {item.button}

                <FiArrowRight />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================
          USER MANAGEMENT
      ====================================== */}

      <section className="settings-section">
        {/* SECTION HEADER */}

        <div className="settings-section-header">
          <div className="settings-section-icon">
            <FiUsers />
          </div>

          <div>
            <h2>User Management</h2>

            <p>View and manage registered FreshMart users.</p>
          </div>

          {/* REFRESH */}

          <button
            type="button"
            className="settings-refresh-btn"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            title="Refresh users"
          >
            <FiRefreshCw
              className={refreshing ? "settings-refresh-spin" : ""}
            />
          </button>
        </div>

        {/* ===================================
            USER COUNT
        ==================================== */}

        <div className="settings-user-count">
          <FiUsers />

          <span>Total Registered Users</span>

          <strong>{users.length}</strong>
        </div>

        {/* ===================================
            LOADING
        ==================================== */}

        {usersLoading ? (
          <div className="settings-users-loading">
            <div className="settings-spinner"></div>

            <span>Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          /* =================================
              NO USERS
          ================================= */

          <div className="settings-no-users">
            <FiUsers />

            <h3>No Users Found</h3>

            <p>Registered users will appear here.</p>
          </div>
        ) : (
          /* =================================
              USERS
          ================================= */

          <div className="settings-users-list">
            {users.map((user) => (
              <div className="settings-user-card" key={user.id}>
                {/* AVATAR */}

                <div className="settings-user-avatar">
                  <FiUser />
                </div>

                {/* INFO */}

                <div className="settings-user-info">
                  <div className="settings-user-name">
                    <h3>{user.name}</h3>

                    <span
                      className={
                        user.role === "admin"
                          ? "settings-user-role admin"
                          : "settings-user-role"
                      }
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>

                  <div className="settings-user-email">
                    <FiMail />

                    <span>{user.email}</span>
                  </div>
                </div>

                {/* UID */}

                <div className="settings-user-uid">
                  <span>USER ID</span>

                  <strong>{user.uid}</strong>
                </div>

                {/* DELETE */}

                <button
                  type="button"
                  className="settings-delete-user"
                  onClick={() => openDeleteConfirmation(user)}
                  disabled={user.role === "admin"}
                  title={
                    user.role === "admin"
                      ? "Admin cannot be deleted"
                      : "Delete user"
                  }
                >
                  <FiTrash2 />

                  <span>Delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =====================================
          SYSTEM INFORMATION
      ====================================== */}

      <section className="settings-section">
        <div className="settings-section-header">
          <div className="settings-section-icon">
            <FiSettings />
          </div>

          <div>
            <h2>System Settings</h2>

            <p>FreshMart admin system configuration.</p>
          </div>
        </div>

        <div className="settings-info-card">
          <div>
            <span>Application</span>

            <strong>FreshMart</strong>
          </div>

          <div>
            <span>Panel</span>

            <strong>Administrator</strong>
          </div>

          <div>
            <span>Authentication</span>

            <strong>Firebase</strong>
          </div>
        </div>
      </section>

      {/* =====================================
          DELETE CONFIRMATION MODAL
      ====================================== */}

      {selectedUser && (
        <div
          className="settings-modal-overlay"
          onClick={closeDeleteConfirmation}
        >
          <div
            className="settings-delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            {/* ICON */}

            <div className="settings-delete-icon">
              <FiTrash2 />
            </div>

            {/* TITLE */}

            <h2>Delete User?</h2>

            {/* DESCRIPTION */}

            <p>Are you sure you want to delete this user?</p>

            {/* USER */}

            <div className="settings-delete-user-info">
              <div className="settings-delete-avatar">
                <FiUser />
              </div>

              <div>
                <strong>{selectedUser.name}</strong>

                <span>{selectedUser.email}</span>
              </div>
            </div>

            <p className="settings-delete-warning">
              This will permanently delete the user's Firestore profile.
            </p>

            {/* BUTTONS */}

            <div className="settings-modal-actions">
              <button
                type="button"
                className="settings-cancel-btn"
                onClick={closeDeleteConfirmation}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="settings-confirm-delete-btn"
                onClick={handleDeleteUser}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <span className="settings-button-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
